import type { FastifyReply, FastifyRequest } from 'fastify';
import { collectionService } from '@/services/collection.js';

export const collectionController = {
	async getAll(_request: FastifyRequest, reply: FastifyReply) {
		const { data, error } = await collectionService.getAll();
		if (error) return reply.status(500).send({ error });
		return reply.status(200).send(data);
	},

	async getById(request: FastifyRequest, reply: FastifyReply) {
		const { id } = request.params as { id: string };
		const { data, error } = await collectionService.getById(id);
		if (error) return reply.status(500).send({ error });
		if (!data) return reply.status(404).send({ error: 'Collection not found' });
		return reply.status(200).send(data);
	},

	async create(request: FastifyRequest, reply: FastifyReply) {
		const userId = (request.user as { sub: string }).sub;
		const { name, description } = request.body as {
			name: string;
			description?: string;
		};
		const { error } = await collectionService.create({
			creator_id: userId,
			name,
			description: description ?? null,
		});
		if (error) return reply.status(500).send({ error });
		return reply.status(201).send({ message: 'Collection created' });
	},

	async addPost(request: FastifyRequest, reply: FastifyReply) {
		const { id } = request.params as { id: string };
		const { post_id } = request.body as { post_id: string };
		const { error } = await collectionService.addPost(id, post_id);
		if (error) return reply.status(500).send({ error });
		return reply.status(200).send({ message: 'Post added to collection' });
	},
};
