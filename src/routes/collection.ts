import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { collectionController } from '@/controllers/collection.js';
import { authenticate } from '@/middleware/auth.js';
import { collectionSchema } from '@/types/collection.js';

export const collectionRoutes = async (app: FastifyInstance) => {
	app.get(
		'/collections',
		{
			schema: {
				tags: ['Collections'],
				description: 'Get all collections',
				response: { 200: z.array(collectionSchema) },
			},
		},
		collectionController.getAll,
	);

	app.get(
		'/collection/:id',
		{
			schema: {
				tags: ['Collections'],
				description: 'Get collection by id',
				params: z.object({ id: z.uuid() }),
				response: { 200: collectionSchema },
			},
		},
		collectionController.getById,
	);

	app.post(
		'/collection',
		{
			schema: {
				tags: ['Collections'],
				description: 'Create a collection',
				body: z.object({
					name: z.string().min(1).max(100),
					description: z.string().optional(),
				}),
				response: { 201: z.object({ message: z.string() }) },
			},
			onRequest: [authenticate],
		},
		collectionController.create,
	);

	app.post(
		'/collection/:id/post',
		{
			schema: {
				tags: ['Collections'],
				description: 'Add a post to a collection',
				params: z.object({ id: z.uuid() }),
				body: z.object({ post_id: z.uuid() }),
				response: { 200: z.object({ message: z.string() }) },
			},
			onRequest: [authenticate],
		},
		collectionController.addPost,
	);

	app.delete(
		'/collection/:id',
		{
			schema: {
				tags: ['Collections'],
				description: 'Delete a collection',
				params: z.object({ id: z.uuid() }),
				response: { 200: z.object({ message: z.string() }) },
			},
			onRequest: [authenticate],
		},
		collectionController.delete,
	);

	app.delete(
		'/collection/:id/post/:postId',
		{
			schema: {
				tags: ['Collections'],
				description: 'Remove a post from a collection',
				params: z.object({ id: z.uuid(), postId: z.uuid() }),
				response: { 200: z.object({ message: z.string() }) },
			},
			onRequest: [authenticate],
		},
		collectionController.removePost,
	);
};
