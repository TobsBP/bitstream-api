import type { FastifyReply, FastifyRequest } from 'fastify';
import { duelService } from '@/services/duel.js';

export const duelController = {
	async getAll(_request: FastifyRequest, reply: FastifyReply) {
		const { data, error } = await duelService.getAll();
		if (error) return reply.status(500).send({ error });
		return reply.status(200).send(data);
	},

	async getById(request: FastifyRequest, reply: FastifyReply) {
		const { id } = request.params as { id: string };
		const { data, error } = await duelService.getById(id);
		if (error) return reply.status(500).send({ error });
		if (!data) return reply.status(404).send({ error: 'Duel not found' });
		return reply.status(200).send(data);
	},

	async create(request: FastifyRequest, reply: FastifyReply) {
		const body = request.body as {
			post1_id: string;
			post2_id: string;
			ends_at: string;
		};
		const { error } = await duelService.create(body);
		if (error) return reply.status(500).send({ error });
		return reply.status(201).send({ message: 'Duel created' });
	},

	async vote(request: FastifyRequest, reply: FastifyReply) {
		const { id } = request.params as { id: string };
		const { post_id } = request.body as { post_id: string };
		const userId = (request.user as { sub: string }).sub;
		const { error } = await duelService.vote(id, userId, post_id);
		if (error) return reply.status(400).send({ error });
		return reply.status(200).send({ message: 'Vote registered' });
	},
};
