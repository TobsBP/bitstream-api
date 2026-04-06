import { supabaseAdmin } from '@/lib/supabase.js';
import type { Post, UpdatePost } from '@/types/post.js';

export const postRepository = {
	async findAll(): Promise<Post[]> {
		const { data } = await supabaseAdmin
			.from('posts')
			.select('*')
			.order('created_at', { ascending: false });
		return data ?? [];
	},

	async findById(id: string): Promise<Post | null> {
		const { data } = await supabaseAdmin
			.from('posts')
			.select('*')
			.eq('id', id)
			.single();
		return data ?? null;
	},

	async findByUserId(userId: string, filter?: string): Promise<Post[]> {
		let query = supabaseAdmin
			.from('posts')
			.select('*')
			.eq('user_id', userId)
			.order('created_at', { ascending: false });

		if (filter === 'duel_entries') {
			query = query.eq('type', 'duel_entry');
		} else if (filter === 'minted') {
			query = query.eq('type', 'minted');
		}

		const { data } = await query;
		return data ?? [];
	},

	async create(data: Post): Promise<Post> {
		const { data: post, error } = await supabaseAdmin
			.from('posts')
			.insert(data)
			.select()
			.single();
		if (error) throw error;
		return post;
	},

	async update(id: string, data: UpdatePost): Promise<Post | null> {
		const { data: post } = await supabaseAdmin
			.from('posts')
			.update(data)
			.eq('id', id)
			.select()
			.single();
		return post ?? null;
	},

	async delete(id: string): Promise<void> {
		await supabaseAdmin.from('posts').delete().eq('id', id);
	},
};
