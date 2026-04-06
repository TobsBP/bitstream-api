import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { hashtagController } from '@/controllers/hashtag.js';

export const hashtagRoutes = async (app: FastifyInstance) => {
	app.get(
		'/trending',
		{
			schema: {
				tags: ['Hashtags'],
				description: 'Get trending hashtags',
			},
		},
		hashtagController.getTrending,
	);

	app.get(
		'/hashtag/:tag/posts',
		{
			schema: {
				tags: ['Hashtags'],
				params: z.object({ tag: z.string() }),
			},
		},
		hashtagController.getPostsByTag,
	);

	app.get(
		'/discover',
		{
			schema: {
				tags: ['Hashtags'],
				description: 'Get discover posts',
			},
		},
		hashtagController.getDiscover,
	);
};
