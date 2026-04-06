import { withCapture } from '@/lib/sentry.js';
import { collectionRepository } from '@/repositories/collection.js';
import type { NewCollection } from '@/types/collection.js';

export const collectionService = {
	async getAll() {
		return withCapture(() => collectionRepository.findAll());
	},

	async getById(id: string) {
		return withCapture(async () => {
			const collection = await collectionRepository.findById(id);
			if (!collection) return null;
			const posts = await collectionRepository.findPostsByCollection(id);
			return { ...collection, posts };
		});
	},

	async create(payload: NewCollection) {
		return withCapture(() => collectionRepository.create(payload));
	},

	async addPost(collectionId: string, postId: string) {
		return withCapture(() =>
			collectionRepository.addPost(collectionId, postId),
		);
	},
};
