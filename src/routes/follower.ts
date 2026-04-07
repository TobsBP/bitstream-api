import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { followerController } from '@/controllers/follower.js';
import { authenticate } from '@/middleware/auth.js';
import { userSchema } from '@/types/user.js';

export const followerRoutes = async (app: FastifyInstance) => {
	app.get(
		'/user/:id/followers',
		{
			schema: {
				tags: ['Followers'],
				params: z.object({ id: z.uuid() }),
				response: { 200: z.array(userSchema) },
			},
		},
		followerController.getFollowers,
	);

	app.get(
		'/user/:id/following',
		{
			schema: {
				tags: ['Followers'],
				params: z.object({ id: z.uuid() }),
				response: { 200: z.array(userSchema) },
			},
		},
		followerController.getFollowing,
	);

	app.post(
		'/user/:id/follow',
		{
			schema: {
				tags: ['Followers'],
				params: z.object({ id: z.uuid() }),
			},
			onRequest: [authenticate],
		},
		followerController.toggleFollow,
	);
};
