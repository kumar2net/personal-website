import { z } from "zod";

export const metricsWindowSchema = z.object({
  mode: z.enum(["first_2h_proxy", "last_7_days"]),
  startDate: z.string(),
  endDate: z.string(),
  note: z.string(),
});

export const shortVideoSchema = z.object({
  videoId: z.string().min(1),
  title: z.string().min(1),
  description: z.string().default(""),
  publishedAt: z.string(),
  durationSeconds: z.number().nullable(),
  tags: z.array(z.string()).default([]),
  channelId: z.string().optional(),
});

export const shortMetricsSchema = z.object({
  videoId: z.string().min(1),
  impressions: z.number().nullable(),
  impressionClickThroughRate: z.number().nullable(),
  views: z.number().nullable(),
  averageViewDuration: z.number().nullable(),
  averageViewPercentage: z.number().nullable(),
  first3sRetentionProxy: z.number().nullable(),
  durationSeconds: z.number().nullable(),
  window: metricsWindowSchema,
  raw: z.unknown().optional(),
});

export const mockMetricSchema = z.object({
  impressions: z.number().nullable(),
  impressionClickThroughRate: z.number().nullable(),
  views: z.number().nullable(),
  averageViewDuration: z.number().nullable(),
  averageViewPercentage: z.number().nullable(),
  first3sRetentionProxy: z.number().nullable(),
  window: metricsWindowSchema,
});

export const mockFixtureSchema = z.object({
  videos: z.array(shortVideoSchema),
  metrics: z.record(mockMetricSchema),
});

export type MetricsWindow = z.infer<typeof metricsWindowSchema>;
export type ShortVideo = z.infer<typeof shortVideoSchema>;
export type ShortMetrics = z.infer<typeof shortMetricsSchema>;
export type MockFixture = z.infer<typeof mockFixtureSchema>;

export interface VideoSelectionOptions {
  last: number;
  videoId?: string;
  channelMine?: boolean;
}
