import type { Readable } from 'node:stream';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { postService } from '@/services/post.js';
import type { UpdatePost } from '@/types/post.js';

export const postController = {
	async getAll(_request: FastifyRequest, reply: FastifyReply) {
		const { data, error } = await postService.getPosts();
		if (error) return reply.status(500).send({ error });
		return reply.status(200).send(data);
	},

	async getFeed(request: FastifyRequest, reply: FastifyReply) {
		const userId = (request.user as { sub: string }).sub;
		const { data, error } = await postService.getFeed(userId);
		if (error) return reply.status(500).send({ error });
		return reply.status(200).send(data);
	},

	async getById(request: FastifyRequest, reply: FastifyReply) {
		const { id } = request.params as { id: string };
		const { data, error } = await postService.getPostById(id);
		if (error) return reply.status(500).send({ error });
		if (!data) return reply.status(404).send({ error: 'Post not found' });
		return reply.status(200).send(data);
	},

	async getByUser(request: FastifyRequest, reply: FastifyReply) {
		const { userId } = request.params as { userId: string };
		const { filter } = request.query as { filter?: string };
		const { data, error } = await postService.getPostsByUser(userId, filter);
		if (error) return reply.status(500).send({ error });
		return reply.status(200).send(data);
	},

	async create(request: FastifyRequest, reply: FastifyReply) {
		const userId = (request.user as { sub: string }).sub;

		const fields: Record<string, string> = {};
		let imageFile: Readable | undefined;

		for await (const part of request.parts()) {
			if (part.type === 'file') {
				imageFile = part.file;
			} else {
				fields[part.fieldname] = part.value as string;
			}
		}

		const { error } = await postService.createPost(
			{ content: fields.content, type: fields.type, user_id: userId },
			imageFile,
		);
		if (error) return reply.status(500).send({ error });
		return reply.status(201).send({ message: 'Post created' });
	},

	async update(request: FastifyRequest, reply: FastifyReply) {
		const { id } = request.params as { id: string };
		const body = request.body as UpdatePost;
		const userId = (request.user as { sub: string }).sub;

		const { data: post } = await postService.getPostById(id);
		if (!post) return reply.status(404).send({ error: 'Post not found' });
		if (post.user_id !== userId)
			return reply.status(403).send({ error: 'Forbidden' });

		const { error } = await postService.updatePost(id, body);
		if (error) return reply.status(500).send({ error });
		return reply.status(200).send({ message: 'Post updated' });
	},

	async delete(request: FastifyRequest, reply: FastifyReply) {
		const { id } = request.params as { id: string };
		const userId = (request.user as { sub: string }).sub;

		const { data: post } = await postService.getPostById(id);
		if (!post) return reply.status(404).send({ error: 'Post not found' });
		if (post.user_id !== userId)
			return reply.status(403).send({ error: 'Forbidden' });

		const { error } = await postService.deletePost(id);
		if (error) return reply.status(500).send({ error });
		return reply.status(200).send({ message: 'Post deleted' });
	},
};
