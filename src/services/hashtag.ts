import { withCapture } from '@/lib/sentry.js';
import { supabaseAdmin } from '@/lib/supabase.js';
import { hashtagRepository } from '@/repositories/hashtag.js';

export const hashtagService = {
	async getTrending() {
		return withCapture(() => hashtagRepository.findTrending());
	},

	async getPostsByTag(tag: string) {
		return withCapture(async () => {
			const postIds = await hashtagRepository.findPostIdsByTag(tag);
			if (postIds.length === 0) return [];

			const { data } = await supabaseAdmin
				.from('posts')
				.select('*')
				.in('id', postIds)
				.order('created_at', { ascending: false });

			return data ?? [];
		});
	},

	async getDiscover() {
		return withCapture(async () => {
			const { data } = await supabaseAdmin
				.from('posts')
				.select('*')
				.order('created_at', { ascending: false })
				.limit(30);
			return data ?? [];
		});
	},
};
