import type { FastifyReply, FastifyRequest } from 'fastify';
import { followerService } from '@/services/follower.js';
import { userService } from '@/services/user.js';

export const followerController = {
	async getFollowers(request: FastifyRequest, reply: FastifyReply) {
		const { id } = request.params as { id: string };
		const { data: user } = await userService.getById(id);
		if (!user) return reply.status(404).send({ error: 'User not found' });

		const { data, error } = await followerService.getFollowers(id);
		if (error) return reply.status(500).send({ error });
		return reply.status(200).send(data);
	},

	async getFollowing(request: FastifyRequest, reply: FastifyReply) {
		const { id } = request.params as { id: string };
		const { data: user } = await userService.getById(id);
		if (!user) return reply.status(404).send({ error: 'User not found' });

		const { data, error } = await followerService.getFollowing(id);
		if (error) return reply.status(500).send({ error });
		return reply.status(200).send(data);
	},

	async toggleFollow(request: FastifyRequest, reply: FastifyReply) {
		const { id } = request.params as { id: string };
		const followerId = (request.user as { sub: string }).sub;

		const { data: user } = await userService.getById(id);
		if (!user) return reply.status(404).send({ error: 'User not found' });

		const { data, error } = await followerService.toggleFollow(followerId, id);
		if (error) return reply.status(500).send({ error });
		return reply.status(200).send(data);
	},
};
