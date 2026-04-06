import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { authController } from '@/controllers/auth.js';

export const authRoutes = async (app: FastifyInstance) => {
	app.post(
		'/auth/register',
		{
			schema: {
				tags: ['Auth'],
				body: z.object({
					email: z.string().email(),
					password: z.string().min(6),
					username: z.string().min(3),
				}),
				response: { 201: z.object({ message: z.string() }) },
			},
		},
		authController.register,
	);

	app.post(
		'/auth/login',
		{
			schema: {
				tags: ['Auth'],
				body: z.object({
					email: z.string().email(),
					password: z.string(),
				}),
				response: { 200: z.object({ token: z.string() }) },
			},
		},
		authController.login,
	);
};
