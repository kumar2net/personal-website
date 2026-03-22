export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function withRetry(task, options = {}) {
  const retries = Number.isInteger(options.retries) ? options.retries : 4;
  const baseDelayMs = Number.isFinite(options.baseDelayMs) ? options.baseDelayMs : 1_000;
  let attempt = 0;

  while (true) {
    try {
      return await task();
    } catch (error) {
      const status = error?.status || error?.response?.status || null;
      const retryable = status === 429 || status === 408 || status >= 500;
      if (!retryable || attempt >= retries) {
        throw error;
      }
      const jitter = Math.floor(Math.random() * 250);
      const backoff = baseDelayMs * 2 ** attempt + jitter;
      await sleep(backoff);
      attempt += 1;
    }
  }
}

export class RateLimitQueue {
  constructor({ intervalMs = 60_000, intervalCap = 60 } = {}) {
    this.intervalMs = intervalMs;
    this.intervalCap = intervalCap;
    this.timestamps = [];
    this.pending = Promise.resolve();
  }

  async schedule(task) {
    const run = async () => {
      await this.#throttle();
      this.timestamps.push(Date.now());
      return task();
    };

    const result = this.pending.then(run, run);
    this.pending = result.catch(() => {});
    return result;
  }

  async #throttle() {
    if (!Number.isFinite(this.intervalCap) || this.intervalCap <= 0) {
      return;
    }

    while (true) {
      const now = Date.now();
      this.timestamps = this.timestamps.filter(
        (stamp) => now - stamp < this.intervalMs,
      );

      if (this.timestamps.length < this.intervalCap) {
        return;
      }

      const waitMs = this.intervalMs - (now - this.timestamps[0]) + 25;
      await sleep(Math.max(50, waitMs));
    }
  }
}
