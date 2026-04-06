import { z } from 'zod';

export const collectionSchema = z.object({
	id: z.uuid(),
	creator_id: z.uuid(),
	name: z.string().min(1).max(100),
	description: z.string().nullable(),
	created_at: z.string(),
});

export type Collection = z.infer<typeof collectionSchema>;
export type NewCollection = Pick<
	Collection,
	'creator_id' | 'name' | 'description'
>;
