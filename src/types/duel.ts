import { z } from 'zod';

export const duelSchema = z.object({
	id: z.uuid(),
	post1_id: z.uuid(),
	post2_id: z.uuid(),
	status: z.enum(['active', 'ended']),
	ends_at: z.string(),
	created_at: z.string(),
});

export const duelWithVotesSchema = duelSchema.extend({
	votes1: z.number().int(),
	votes2: z.number().int(),
});

export type Duel = z.infer<typeof duelSchema>;
export type DuelWithVotes = z.infer<typeof duelWithVotesSchema>;
export type NewDuel = Pick<Duel, 'post1_id' | 'post2_id' | 'ends_at'>;
