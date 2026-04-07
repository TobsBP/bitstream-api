import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { xpController } from '@/controllers/xp.js';
import { authenticate } from '@/middleware/auth.js';

const xpSchema = z.object({
	xp: z.number().int(),
	xp_max: z.number().int(),
	level: z.number().int(),
});

export const xpRoutes = async (app: FastifyInstance) => {
	app.get(
		'/user/:id/xp',
		{
			schema: {
				tags: ['XP'],
				description: 'Get XP data for a user',
				params: z.object({ id: z.uuid() }),
				response: { 200: xpSchema },
			},
		},
		xpController.getByUser,
	);

	app.post(
		'/user/:id/xp',
		{
			schema: {
				tags: ['XP'],
				description: 'Add XP to a user',
				params: z.object({ id: z.uuid() }),
				body: z.object({ amount: z.number().int().positive() }),
				response: { 200: z.object({ message: z.string() }) },
			},
			onRequest: [authenticate],
		},
		xpController.add,
	);

	app.delete(
		'/user/:id/xp',
		{
			schema: {
				tags: ['XP'],
				description: 'Reset XP of a user to initial values',
				params: z.object({ id: z.uuid() }),
				response: { 200: z.object({ message: z.string() }) },
			},
			onRequest: [authenticate],
		},
		xpController.reset,
	);
};
