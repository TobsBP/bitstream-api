import type { FastifyInstance } from 'fastify';

import { authRoutes } from '@/routes/auth.js';
import { collectionRoutes } from '@/routes/collection.js';
import { followerRoutes } from '@/routes/follower.js';
import { hashtagRoutes } from '@/routes/hashtag.js';
import { postRoutes } from '@/routes/post.js';
import { userRoutes } from '@/routes/user.js';
import { xpRoutes } from '@/routes/xp.js';

export const routes = async (app: FastifyInstance) => {
	app.register(authRoutes);
	app.register(postRoutes);
	app.register(userRoutes);
	app.register(followerRoutes);
	app.register(hashtagRoutes);
	app.register(collectionRoutes);
	app.register(xpRoutes);
};
