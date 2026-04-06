import { z } from 'zod';

export const hashtagSchema = z.object({
	id: z.uuid(),
	name: z.string().min(1).max(50),
});

export const trendingHashtagSchema = hashtagSchema.extend({
	post_count: z.number().int(),
});

export type Hashtag = z.infer<typeof hashtagSchema>;
export type TrendingHashtag = z.infer<typeof trendingHashtagSchema>;
