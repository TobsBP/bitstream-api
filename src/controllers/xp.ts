import type { FastifyReply, FastifyRequest } from 'fastify';
import { userService } from '@/services/user.js';
import { xpService } from '@/services/xp.js';

export const xpController = {
	async getByUser(request: FastifyRequest, reply: FastifyReply) {
		const { id } = request.params as { id: string };

		const { data: user } = await userService.getById(id);
		if (!user) return reply.status(404).send({ error: 'User not found' });

		const { data, error } = await xpService.getByUser(id);
		if (error) return reply.status(500).send({ error });
		return reply.status(200).send(data);
	},

	async add(request: FastifyRequest, reply: FastifyReply) {
		const { id } = request.params as { id: string };
		const { amount } = request.body as { amount: number };

		const { data: user } = await userService.getById(id);
		if (!user) return reply.status(404).send({ error: 'User not found' });

		const { error } = await xpService.add(id, amount);
		if (error) return reply.status(500).send({ error });
		return reply.status(200).send({ message: 'XP added' });
	},

	async reset(request: FastifyRequest, reply: FastifyReply) {
		const { id } = request.params as { id: string };
		const userId = (request.user as { sub: string }).sub;
		if (userId !== id) return reply.status(403).send({ error: 'Forbidden' });

		const { data: user } = await userService.getById(id);
		if (!user) return reply.status(404).send({ error: 'User not found' });

		const { error } = await xpService.reset(id);
		if (error) return reply.status(500).send({ error });
		return reply.status(200).send({ message: 'XP reset' });
	},
};
