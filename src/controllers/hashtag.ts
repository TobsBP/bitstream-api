import type { FastifyReply, FastifyRequest } from 'fastify';
import { hashtagService } from '@/services/hashtag.js';

export const hashtagController = {
	async getTrending(_request: FastifyRequest, reply: FastifyReply) {
		const { data, error } = await hashtagService.getTrending();
		if (error) return reply.status(500).send({ error });
		return reply.status(200).send(data);
	},

	async getPostsByTag(request: FastifyRequest, reply: FastifyReply) {
		const { tag } = request.params as { tag: string };
		const { data, error } = await hashtagService.getPostsByTag(tag);
		if (error) return reply.status(500).send({ error });
		return reply.status(200).send(data);
	},

	async getDiscover(_request: FastifyRequest, reply: FastifyReply) {
		const { data, error } = await hashtagService.getDiscover();
		if (error) return reply.status(500).send({ error });
		return reply.status(200).send(data);
	},
};
