import { supabaseAdmin } from '@/lib/supabase.js';
import type { Collection, NewCollection } from '@/types/collection.js';

export const collectionRepository = {
	async findAll(): Promise<Collection[]> {
		const { data } = await supabaseAdmin
			.from('collections')
			.select('*')
			.order('created_at', { ascending: false });
		return (data ?? []) as Collection[];
	},

	async findById(id: string): Promise<Collection | null> {
		const { data } = await supabaseAdmin
			.from('collections')
			.select('*')
			.eq('id', id)
			.single();
		return data ?? null;
	},

	async create(payload: NewCollection): Promise<Collection> {
		const { data, error } = await supabaseAdmin
			.from('collections')
			.insert(payload)
			.select()
			.single();
		if (error) throw error;
		return data as Collection;
	},

	async addPost(collectionId: string, postId: string): Promise<void> {
		const { error } = await supabaseAdmin
			.from('posts')
			.update({ collection_id: collectionId })
			.eq('id', postId);
		if (error) throw error;
	},

	async findPostsByCollection(collectionId: string) {
		const { data } = await supabaseAdmin
			.from('posts')
			.select('*')
			.eq('collection_id', collectionId)
			.order('created_at', { ascending: false });
		return data ?? [];
	},

	async delete(id: string): Promise<void> {
		const { error } = await supabaseAdmin
			.from('collections')
			.delete()
			.eq('id', id);
		if (error) throw error;
	},

	async removePost(collectionId: string, postId: string): Promise<void> {
		const { error } = await supabaseAdmin
			.from('posts')
			.update({ collection_id: null })
			.eq('id', postId)
			.eq('collection_id', collectionId);
		if (error) throw error;
	},
};
