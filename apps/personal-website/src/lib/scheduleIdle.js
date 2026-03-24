export function scheduleIdleTask(
  task,
  { timeout = 1500, fallbackDelay = 300 } = {},
) {
  if (typeof window === "undefined") {
    return () => {};
  }

  if ("requestIdleCallback" in window) {
    const id = window.requestIdleCallback(task, { timeout });
    return () => window.cancelIdleCallback(id);
  }

  const id = window.setTimeout(task, Math.min(timeout, fallbackDelay));
  return () => window.clearTimeout(id);
}
