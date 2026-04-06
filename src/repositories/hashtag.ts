import { supabaseAdmin } from '@/lib/supabase.js';
import type { Hashtag, TrendingHashtag } from '@/types/hashtag.js';

export const hashtagRepository = {
	async findTrending(limit = 10): Promise<TrendingHashtag[]> {
		const { data } = await supabaseAdmin
			.from('hashtags')
			.select('*, post_hashtags(count)')
			.order('post_hashtags.count', { ascending: false })
			.limit(limit);

		return (data?.map((h) => ({
			id: h.id,
			name: h.name,
			post_count: Number(h.post_hashtags?.[0]?.count ?? 0),
		})) ?? []) as TrendingHashtag[];
	},

	async findOrCreate(name: string): Promise<Hashtag> {
		const { data: existing } = await supabaseAdmin
			.from('hashtags')
			.select('*')
			.eq('name', name.toLowerCase())
			.single();

		if (existing) return existing as Hashtag;

		const { data, error } = await supabaseAdmin
			.from('hashtags')
			.insert({ name: name.toLowerCase() })
			.select()
			.single();
		if (error) throw error;
		return data as Hashtag;
	},

	async attachToPost(postId: string, hashtagId: string): Promise<void> {
		await supabaseAdmin
			.from('post_hashtags')
			.upsert({ post_id: postId, hashtag_id: hashtagId });
	},

	async findPostIdsByTag(tag: string): Promise<string[]> {
		const { data: hashtag } = await supabaseAdmin
			.from('hashtags')
			.select('id')
			.eq('name', tag.toLowerCase())
			.single();
		if (!hashtag) return [];

		const { data } = await supabaseAdmin
			.from('post_hashtags')
			.select('post_id')
			.eq('hashtag_id', hashtag.id);

		return data?.map((r) => r.post_id) ?? [];
	},
};
