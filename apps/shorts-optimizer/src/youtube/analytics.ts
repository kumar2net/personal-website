import { readFile } from "node:fs/promises";
import { GoogleAuth, OAuth2Client } from "google-auth-library";
import type { RuntimeConfig } from "../config/env.js";
import {
  mockFixtureSchema,
  shortMetricsSchema,
  shortVideoSchema,
  type MockFixture,
  type MetricsWindow,
  type ShortMetrics,
  type ShortVideo,
  type VideoSelectionOptions,
} from "./data.js";

const YT_DATA_BASE_URL = "https://www.googleapis.com/youtube/v3";
const YT_ANALYTICS_BASE_URL = "https://youtubeanalytics.googleapis.com/v2/reports";

const YT_SCOPES = [
  "https://www.googleapis.com/auth/youtube.readonly",
  "https://www.googleapis.com/auth/yt-analytics.readonly",
];

const SHORTS_MAX_SECONDS = 90;

type ChannelListResponse = {
  items?: Array<{
    contentDetails?: {
      relatedPlaylists?: {
        uploads?: string;
      };
    };
  }>;
};

type PlaylistItemsResponse = {
  nextPageToken?: string;
  items?: Array<{
    contentDetails?: {
      videoId?: string;
    };
  }>;
};

type VideosListResponse = {
  items?: Array<{
    id?: string;
    snippet?: {
      title?: string;
      description?: string;
      publishedAt?: string;
      tags?: string[];
      channelId?: string;
    };
    contentDetails?: {
      duration?: string;
    };
  }>;
};

type AnalyticsResponse = {
  columnHeaders?: Array<{
    name?: string;
  }>;
  rows?: Array<Array<string | number | null>>;
};

function toNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function round2(value: number | null): number | null {
  if (value == null) {
    return null;
  }

  return Math.round(value * 100) / 100;
}

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function parseIsoDurationSeconds(duration: string): number | null {
  const match = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?$/iu.exec(duration);
  if (!match) {
    return null;
  }

  const hours = Number(match[1] ?? 0);
  const minutes = Number(match[2] ?? 0);
  const seconds = Number(match[3] ?? 0);

  if (![hours, minutes, seconds].every(Number.isFinite)) {
    return null;
  }

  return Math.round((hours * 3600 + minutes * 60 + seconds) * 100) / 100;
}

function chunk<T>(values: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < values.length; i += size) {
    out.push(values.slice(i, i + size));
  }
  return out;
}

function windowForVideo(video: ShortVideo): MetricsWindow {
  const publishedMs = new Date(video.publishedAt).getTime();
  const now = Date.now();

  if (Number.isFinite(publishedMs) && now - publishedMs <= 2 * 60 * 60 * 1000) {
    const publishDate = toIsoDate(new Date(publishedMs));
    return {
      mode: "first_2h_proxy",
      startDate: publishDate,
      endDate: publishDate,
      note: "First 2 hours are approximated using same-day partial YouTube Analytics data (day-level granularity).",
    };
  }

  const endDate = toIsoDate(new Date(now));
  const startDate = toIsoDate(new Date(now - 7 * 24 * 60 * 60 * 1000));

  return {
    mode: "last_7_days",
    startDate,
    endDate,
    note: "Used 7-day fallback window.",
  };
}

export class YouTubeAnalyticsClient {
  private oauthClient: OAuth2Client | null = null;

  private adcAuth: GoogleAuth | null = null;

  private mockFixture: MockFixture | null = null;

  public constructor(private readonly config: RuntimeConfig) {}

  public async listTargetVideos(options: VideoSelectionOptions): Promise<ShortVideo[]> {
    const last = Math.max(1, options.last || 1);

    if (this.config.mockMode) {
      return this.listTargetVideosMock({ ...options, last });
    }

    if (options.videoId) {
      const video = await this.fetchVideoById(options.videoId);
      if (!video) {
        return [];
      }
      return [video];
    }

    return this.listRecentShortsLive(last);
  }

  public async fetchMetrics(video: ShortVideo): Promise<ShortMetrics> {
    if (this.config.mockMode) {
      return this.fetchMetricsMock(video);
    }

    return this.fetchMetricsLive(video);
  }

  private async loadMockFixture(): Promise<MockFixture> {
    if (this.mockFixture) {
      return this.mockFixture;
    }

    const raw = await readFile(this.config.fixturePath, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    this.mockFixture = mockFixtureSchema.parse(parsed);
    return this.mockFixture;
  }

  private async listTargetVideosMock(options: VideoSelectionOptions): Promise<ShortVideo[]> {
    const fixture = await this.loadMockFixture();
    const videos = fixture.videos
      .slice()
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    if (options.videoId) {
      const hit = videos.find((video) => video.videoId === options.videoId);
      return hit ? [hit] : [];
    }

    return videos.slice(0, options.last);
  }

  private async fetchMetricsMock(video: ShortVideo): Promise<ShortMetrics> {
    const fixture = await this.loadMockFixture();
    const metrics = fixture.metrics[video.videoId];

    if (!metrics) {
      throw new Error(`No fixture metrics found for videoId=${video.videoId}`);
    }

    return shortMetricsSchema.parse({
      videoId: video.videoId,
      durationSeconds: video.durationSeconds,
      ...metrics,
      raw: { source: "fixture" },
    });
  }

  private async fetchAccessToken(): Promise<string> {
    if (this.config.youTubeAuthMode === "oauth_refresh") {
      if (!this.oauthClient) {
        if (!this.config.ytClientId || !this.config.ytClientSecret || !this.config.ytRefreshToken) {
          throw new Error("YT OAuth refresh mode requested but credentials are incomplete.");
        }

        this.oauthClient = new OAuth2Client(
          this.config.ytClientId,
          this.config.ytClientSecret,
        );
        this.oauthClient.setCredentials({
          refresh_token: this.config.ytRefreshToken,
        });
      }

      const tokenResponse = await this.oauthClient.getAccessToken();
      const token = typeof tokenResponse === "string" ? tokenResponse : tokenResponse?.token;
      if (!token) {
        throw new Error("Unable to obtain access token from YT refresh token credentials.");
      }
      return token;
    }

    if (this.config.youTubeAuthMode === "adc") {
      if (!this.adcAuth) {
        const credentials = this.config.gcpServiceAccountJson
          ? JSON.parse(this.config.gcpServiceAccountJson)
          : undefined;

        this.adcAuth = new GoogleAuth({
          scopes: YT_SCOPES,
          credentials,
        });
      }

      const client = await this.adcAuth.getClient();
      const tokenResponse = await client.getAccessToken();
      const token = typeof tokenResponse === "string" ? tokenResponse : tokenResponse?.token;
      if (!token) {
        throw new Error("Unable to obtain access token from ADC credentials.");
      }
      return token;
    }

    throw new Error("YouTube auth mode is not configured.");
  }

  private async fetchGoogleJson<T>(url: URL): Promise<T> {
    const token = await this.fetchAccessToken();

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(
        `Google API error ${response.status}: ${response.statusText} (${body.slice(0, 320)})`,
      );
    }

    return response.json() as Promise<T>;
  }

  private async fetchVideoById(videoId: string): Promise<ShortVideo | null> {
    const url = new URL(`${YT_DATA_BASE_URL}/videos`);
    url.searchParams.set("part", "snippet,contentDetails");
    url.searchParams.set("id", videoId);
    url.searchParams.set("maxResults", "1");

    const response = await this.fetchGoogleJson<VideosListResponse>(url);
    const item = response.items?.[0];
    if (!item?.id || !item.snippet?.publishedAt || !item.snippet.title) {
      return null;
    }

    const durationSeconds = item.contentDetails?.duration
      ? parseIsoDurationSeconds(item.contentDetails.duration)
      : null;

    return shortVideoSchema.parse({
      videoId: item.id,
      title: item.snippet.title,
      description: item.snippet.description ?? "",
      publishedAt: item.snippet.publishedAt,
      durationSeconds,
      tags: item.snippet.tags ?? [],
      channelId: item.snippet.channelId,
    });
  }

  private async listRecentShortsLive(last: number): Promise<ShortVideo[]> {
    const channelUrl = new URL(`${YT_DATA_BASE_URL}/channels`);
    channelUrl.searchParams.set("part", "contentDetails");
    channelUrl.searchParams.set("mine", "true");

    const channelResponse = await this.fetchGoogleJson<ChannelListResponse>(channelUrl);
    const uploadsPlaylistId = channelResponse.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;

    if (!uploadsPlaylistId) {
      throw new Error("Unable to determine uploads playlist for authenticated channel.");
    }

    const candidateIds: string[] = [];
    let pageToken: string | undefined;

    for (let page = 0; page < 5 && candidateIds.length < last * 6; page += 1) {
      const playlistUrl = new URL(`${YT_DATA_BASE_URL}/playlistItems`);
      playlistUrl.searchParams.set("part", "contentDetails");
      playlistUrl.searchParams.set("playlistId", uploadsPlaylistId);
      playlistUrl.searchParams.set("maxResults", "50");
      if (pageToken) {
        playlistUrl.searchParams.set("pageToken", pageToken);
      }

      const playlistResponse = await this.fetchGoogleJson<PlaylistItemsResponse>(playlistUrl);
      for (const item of playlistResponse.items ?? []) {
        const id = item.contentDetails?.videoId;
        if (id) {
          candidateIds.push(id);
        }
      }

      pageToken = playlistResponse.nextPageToken;
      if (!pageToken) {
        break;
      }
    }

    const uniqueIds = [...new Set(candidateIds)];
    const collected: ShortVideo[] = [];

    for (const idChunk of chunk(uniqueIds, 50)) {
      const videosUrl = new URL(`${YT_DATA_BASE_URL}/videos`);
      videosUrl.searchParams.set("part", "snippet,contentDetails");
      videosUrl.searchParams.set("id", idChunk.join(","));
      videosUrl.searchParams.set("maxResults", String(idChunk.length));

      const videosResponse = await this.fetchGoogleJson<VideosListResponse>(videosUrl);

      for (const item of videosResponse.items ?? []) {
        if (!item?.id || !item.snippet?.publishedAt || !item.snippet.title) {
          continue;
        }

        const durationSeconds = item.contentDetails?.duration
          ? parseIsoDurationSeconds(item.contentDetails.duration)
          : null;

        if (durationSeconds != null && durationSeconds > SHORTS_MAX_SECONDS) {
          continue;
        }

        collected.push(
          shortVideoSchema.parse({
            videoId: item.id,
            title: item.snippet.title,
            description: item.snippet.description ?? "",
            publishedAt: item.snippet.publishedAt,
            durationSeconds,
            tags: item.snippet.tags ?? [],
            channelId: item.snippet.channelId,
          }),
        );
      }

      if (collected.length >= last) {
        break;
      }
    }

    return collected
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, last);
  }

  private async fetchFirst3sRetentionProxy(
    videoId: string,
    window: MetricsWindow,
    durationSeconds: number | null,
  ): Promise<number | null> {
    if (!durationSeconds || durationSeconds <= 0) {
      return null;
    }

    try {
      const url = new URL(YT_ANALYTICS_BASE_URL);
      url.searchParams.set("ids", "channel==MINE");
      url.searchParams.set("startDate", window.startDate);
      url.searchParams.set("endDate", window.endDate);
      url.searchParams.set("dimensions", "elapsedVideoTimeRatio");
      url.searchParams.set("metrics", "audienceWatchRatio");
      url.searchParams.set("filters", `video==${videoId}`);

      const response = await this.fetchGoogleJson<AnalyticsResponse>(url);
      const rows = response.rows ?? [];
      if (!rows.length) {
        return null;
      }

      const targetRatio = Math.min(1, 3 / durationSeconds);
      let best: { distance: number; watchRatio: number | null } = {
        distance: Number.POSITIVE_INFINITY,
        watchRatio: null,
      };

      for (const row of rows) {
        const elapsed = toNumber(row[0]);
        const watchRatio = toNumber(row[1]);
        if (elapsed == null || watchRatio == null) {
          continue;
        }

        const distance = Math.abs(elapsed - targetRatio);
        if (distance < best.distance) {
          best = {
            distance,
            watchRatio,
          };
        }
      }

      if (best.watchRatio == null) {
        return null;
      }

      const normalized = best.watchRatio <= 1 ? best.watchRatio * 100 : best.watchRatio;
      return round2(normalized);
    } catch {
      return null;
    }
  }

  private async fetchMetricsLive(video: ShortVideo): Promise<ShortMetrics> {
    const window = windowForVideo(video);

    const url = new URL(YT_ANALYTICS_BASE_URL);
    url.searchParams.set("ids", "channel==MINE");
    url.searchParams.set("startDate", window.startDate);
    url.searchParams.set("endDate", window.endDate);
    url.searchParams.set("dimensions", "video");
    url.searchParams.set(
      "metrics",
      "impressions,impressionClickThroughRate,views,averageViewDuration,averageViewPercentage",
    );
    url.searchParams.set("filters", `video==${video.videoId}`);

    const response = await this.fetchGoogleJson<AnalyticsResponse>(url);

    const headers = response.columnHeaders?.map((entry) => entry.name ?? "") ?? [];
    const row = response.rows?.[0] ?? [];

    const getMetric = (name: string): number | null => {
      const index = headers.indexOf(name);
      if (index < 0) {
        return null;
      }
      return toNumber(row[index]);
    };

    const first3sRetentionProxy = await this.fetchFirst3sRetentionProxy(
      video.videoId,
      window,
      video.durationSeconds,
    );

    return shortMetricsSchema.parse({
      videoId: video.videoId,
      impressions: round2(getMetric("impressions")),
      impressionClickThroughRate: round2(getMetric("impressionClickThroughRate")),
      views: round2(getMetric("views")),
      averageViewDuration: round2(getMetric("averageViewDuration")),
      averageViewPercentage: round2(getMetric("averageViewPercentage")),
      first3sRetentionProxy,
      durationSeconds: video.durationSeconds,
      window,
      raw: response,
    });
  }
}
