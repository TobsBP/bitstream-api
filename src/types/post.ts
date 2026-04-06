import { z } from 'zod';

export const postSchema = z.object({
	id: z.string(),
	user_id: z.uuid(),
	content: z.string().min(5),
	type: z.string(),
	art_url: z.string().nullable(),
	created_at: z.string(),
	updated_at: z.string().nullable(),
});

export const createPostSchema = postSchema.omit({
	id: true,
	user_id: true,
	created_at: true,
	updated_at: true,
});

export const updatePostSchema = createPostSchema.partial();

export const getPostsSchema = {
	description: 'Get all posts',
	response: {
		200: z.array(postSchema),
	},
};

export type Post = z.infer<typeof postSchema>;
export type CreatePost = z.infer<typeof createPostSchema>;
export type UpdatePost = z.infer<typeof updatePostSchema>;
