import type { FastifyReply, FastifyRequest } from 'fastify';
import { userService } from '@/services/user.js';

export const authController = {
	async register(request: FastifyRequest, reply: FastifyReply) {
		const { email, password, username } = request.body as {
			email: string;
			password: string;
			username: string;
		};
		const { error } = await userService.register(email, password, username);
		if (error) return reply.status(500).send({ error });
		return reply.status(201).send({ message: 'User created' });
	},

	async login(request: FastifyRequest, reply: FastifyReply) {
		const { email, password } = request.body as {
			email: string;
			password: string;
		};
		const { data, error } = await userService.login(email, password);
		if (error || !data?.session)
			return reply.status(401).send({ error: 'Invalid credentials' });
		return reply.status(200).send({ token: data.session.access_token });
	},
};
