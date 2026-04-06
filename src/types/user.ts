import { z } from 'zod';

export const userSchema = z.object({
	id: z.uuid(),
	username: z.string().min(3).max(30),
	avatar_url: z.string().nullable(),
	title: z.string().nullable(),
	level: z.number().int(),
	xp: z.number().int(),
	xp_max: z.number().int(),
	created_at: z.string(),
});

export const userUpdateSchema = userSchema
	.pick({ username: true, title: true })
	.partial();

export type User = z.infer<typeof userSchema>;
export type UserUpdate = z.infer<typeof userUpdateSchema>;
export type UserPatch = UserUpdate & { avatar_url?: string | null };
