import type { Readable } from 'node:stream';
import { uploadStream } from '@/lib/cloudinary.js';
import { withCapture } from '@/lib/sentry.js';
import { postRepository } from '@/repositories/post.js';
import type { Post, UpdatePost } from '@/types/post.js';

export const postService = {
	async getPosts() {
		return withCapture(() => postRepository.findAll());
	},

	async getPostById(id: string) {
		return withCapture(() => postRepository.findById(id));
	},

	async getPostsByUser(userId: string, filter?: string) {
		return withCapture(() => postRepository.findByUserId(userId, filter));
	},

	async createPost(payload: Omit<Post, 'id' | 'created_at' | 'updated_at' | 'art_url'>, image?: Readable) {
		return withCapture(async () => {
			const art_url = image
				? await uploadStream(image, 'bitstream/posts')
				: null;
			return postRepository.create({ ...payload, art_url } as Post);
		});
	},

	async updatePost(id: string, payload: UpdatePost) {
		return withCapture(() => postRepository.update(id, payload));
	},

	async deletePost(id: string) {
		return withCapture(() => postRepository.delete(id));
	},

	async getFeed(userId: string) {
		return withCapture(() => postRepository.findFeedByUserId(userId));
	},
};
