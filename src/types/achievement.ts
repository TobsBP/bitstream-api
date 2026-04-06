import { z } from 'zod';

export const achievementSchema = z.object({
	id: z.uuid(),
	name: z.string(),
	description: z.string().nullable(),
	image_url: z.string().nullable(),
	xp_reward: z.number().int(),
});

export const userAchievementSchema = achievementSchema.extend({
	earned_at: z.string(),
});

export type Achievement = z.infer<typeof achievementSchema>;
export type UserAchievement = z.infer<typeof userAchievementSchema>;
