import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { userController } from '@/controllers/user.js';
import { authenticate } from '@/middleware/auth.js';
import { userSchema, userUpdateSchema } from '@/types/user.js';

export const userRoutes = async (app: FastifyInstance) => {
	app.get(
		'/users',
		{
			schema: {
				tags: ['Users'],
				response: { 200: z.array(userSchema) },
			},
		},
		userController.getAll,
	);

	app.get(
		'/user/:id',
		{
			schema: {
				tags: ['Users'],
				params: z.object({ id: z.uuid() }),
				response: { 200: userSchema },
			},
		},
		userController.getById,
	);

	app.patch(
		'/user/:id',
		{
			schema: {
				tags: ['Users'],
				params: z.object({ id: z.uuid() }),
				body: userUpdateSchema,
				response: { 200: z.object({ message: z.string() }) },
			},
			onRequest: [authenticate],
		},
		userController.update,
	);

	app.post(
		'/user/:id/avatar',
		{
			schema: {
				tags: ['Users'],
				params: z.object({ id: z.uuid() }),
				response: { 200: z.object({ message: z.string() }) },
			},
			onRequest: [authenticate],
		},
		userController.uploadAvatar,
	);

	app.get(
		'/user/:id/achievements',
		{
			schema: {
				tags: ['Users'],
				params: z.object({ id: z.uuid() }),
			},
		},
		userController.getAchievements,
	);

	app.get(
		'/user/:id/posts',
		{
			schema: {
				tags: ['Users'],
				params: z.object({ id: z.uuid() }),
				querystring: z.object({ filter: z.string().optional() }),
			},
		},
		userController.getPosts,
	);
};
