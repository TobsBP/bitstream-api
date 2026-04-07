import type { FastifyReply, FastifyRequest } from 'fastify';
import { postService } from '@/services/post.js';
import { userService } from '@/services/user.js';
import type { UserUpdate } from '@/types/user.js';

export const userController = {
	async getAll(_request: FastifyRequest, reply: FastifyReply) {
		const { data, error } = await userService.getAll();
		if (error) return reply.status(500).send({ error });
		return reply.status(200).send(data);
	},

	async getById(request: FastifyRequest, reply: FastifyReply) {
		const { id } = request.params as { id: string };
		const { data, error } = await userService.getById(id);
		if (error) return reply.status(500).send({ error });
		if (!data) return reply.status(404).send({ error: 'User not found' });
		return reply.status(200).send(data);
	},

	async update(request: FastifyRequest, reply: FastifyReply) {
		const { id } = request.params as { id: string };
		const body = request.body as UserUpdate;
		const userId = (request.user as { sub: string }).sub;
		if (userId !== id) return reply.status(403).send({ error: 'Forbidden' });

		const { error } = await userService.update(id, body);
		if (error) return reply.status(500).send({ error });
		return reply.status(200).send({ message: 'User updated' });
	},

	async uploadAvatar(request: FastifyRequest, reply: FastifyReply) {
		const { id } = request.params as { id: string };
		const userId = (request.user as { sub: string }).sub;
		if (userId !== id) return reply.status(403).send({ error: 'Forbidden' });

		const file = await request.file();
		if (!file) return reply.status(400).send({ error: 'No file provided' });

		const { error } = await userService.uploadAvatar(id, file.file);
		if (error) return reply.status(500).send({ error });
		return reply.status(200).send({ message: 'Avatar updated' });
	},

	async getFollowers(request: FastifyRequest, reply: FastifyReply) {
		const { id } = request.params as { id: string };
		const { data, error } = await userService.getFollowers(id);
		if (error) return reply.status(500).send({ error });
		return reply.status(200).send(data);
	},

	async getFollowing(request: FastifyRequest, reply: FastifyReply) {
		const { id } = request.params as { id: string };
		const { data, error } = await userService.getFollowing(id);
		if (error) return reply.status(500).send({ error });
		return reply.status(200).send(data);
	},

	async toggleFollow(request: FastifyRequest, reply: FastifyReply) {
		const { id } = request.params as { id: string };
		const followerId = (request.user as { sub: string }).sub;
		const { data, error } = await userService.toggleFollow(followerId, id);
		if (error) return reply.status(500).send({ error });
		return reply.status(200).send(data);
	},

	async getAchievements(request: FastifyRequest, reply: FastifyReply) {
		const { id } = request.params as { id: string };
		const { data, error } = await userService.getAchievements(id);
		if (error) return reply.status(500).send({ error });
		return reply.status(200).send(data);
	},

	async getPosts(request: FastifyRequest, reply: FastifyReply) {
		const { id } = request.params as { id: string };
		const { filter } = request.query as { filter?: string };
		const { data, error } = await postService.getPostsByUser(id, filter);
		if (error) return reply.status(500).send({ error });
		return reply.status(200).send(data);
	},

	async delete(request: FastifyRequest, reply: FastifyReply) {
		const { id } = request.params as { id: string };
		const userId = (request.user as { sub: string }).sub;
		if (userId !== id) return reply.status(403).send({ error: 'Forbidden' });

		const { data: user } = await userService.getById(id);
		if (!user) return reply.status(404).send({ error: 'User not found' });

		const { error } = await userService.delete(id);
		if (error) return reply.status(500).send({ error });
		return reply.status(200).send({ message: 'User deleted' });
	},
};
