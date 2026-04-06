import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { postController } from '@/controllers/post.js';
import { authenticate } from '@/middleware/auth.js';
import { getPostsSchema, postSchema, updatePostSchema } from '@/types/post.js';

export const postRoutes = async (app: FastifyInstance) => {
	app.get(
		'/posts',
		{ schema: { ...getPostsSchema, tags: ['Posts'] } },
		postController.getAll,
	);

	app.get(
		'/feed',
		{
			schema: {
				tags: ['Posts'],
				description: 'Get post feed for authenticated user',
				response: { 200: z.array(postSchema) },
			},
			onRequest: [authenticate],
		},
		postController.getFeed,
	);

	app.get(
		'/post/:id',
		{
			schema: {
				tags: ['Posts'],
				description: 'Get post by id',
				params: z.object({ id: z.uuid() }),
				response: { 200: postSchema },
			},
		},
		postController.getById,
	);

	app.get(
		'/posts/:userId',
		{
			schema: {
				tags: ['Posts'],
				description: 'Get posts by user',
				params: z.object({ userId: z.uuid() }),
				querystring: z.object({ filter: z.string().optional() }),
				response: { 200: z.array(postSchema) },
			},
		},
		postController.getByUser,
	);

	app.post(
		'/post',
		{
			schema: {
				tags: ['Posts'],
				description: 'Create a post (multipart/form-data: content, type, image?)',
				response: { 201: z.object({ message: z.string() }) },
			},
			onRequest: [authenticate],
		},
		postController.create,
	);

	app.patch(
		'/post/:id',
		{
			schema: {
				tags: ['Posts'],
				description: 'Update a post',
				params: z.object({ id: z.uuid() }),
				body: updatePostSchema,
				response: { 200: z.object({ message: z.string() }) },
			},
			onRequest: [authenticate],
		},
		postController.update,
	);

	app.delete(
		'/post/:id',
		{
			schema: {
				tags: ['Posts'],
				description: 'Delete a post',
				params: z.object({ id: z.uuid() }),
				response: { 200: z.object({ message: z.string() }) },
			},
			onRequest: [authenticate],
		},
		postController.delete,
	);
};
