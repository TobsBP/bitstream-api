import { supabaseAdmin } from '@/lib/supabase.js';
import type { Duel, DuelWithVotes, NewDuel } from '@/types/duel.js';

export const duelRepository = {
	async findAll(): Promise<Duel[]> {
		const { data } = await supabaseAdmin
			.from('duels')
			.select('*')
			.eq('status', 'active')
			.order('created_at', { ascending: false });
		return (data ?? []) as Duel[];
	},

	async findById(id: string): Promise<DuelWithVotes | null> {
		const { data: duel } = await supabaseAdmin
			.from('duels')
			.select('*')
			.eq('id', id)
			.single();
		if (!duel) return null;

		const { count: votes1 } = await supabaseAdmin
			.from('duel_votes')
			.select('*', { count: 'exact', head: true })
			.eq('duel_id', id)
			.eq('post_id', duel.post1_id);

		const { count: votes2 } = await supabaseAdmin
			.from('duel_votes')
			.select('*', { count: 'exact', head: true })
			.eq('duel_id', id)
			.eq('post_id', duel.post2_id);

		return {
			...duel,
			votes1: votes1 ?? 0,
			votes2: votes2 ?? 0,
		} as DuelWithVotes;
	},

	async create(data: NewDuel): Promise<Duel> {
		const { data: duel, error } = await supabaseAdmin
			.from('duels')
			.insert(data)
			.select()
			.single();
		if (error) throw error;
		return duel as Duel;
	},

	async hasVoted(duelId: string, userId: string): Promise<boolean> {
		const { data } = await supabaseAdmin
			.from('duel_votes')
			.select('user_id')
			.eq('duel_id', duelId)
			.eq('user_id', userId)
			.single();
		return !!data;
	},

	async vote(duelId: string, userId: string, postId: string): Promise<void> {
		const { error } = await supabaseAdmin
			.from('duel_votes')
			.insert({ duel_id: duelId, user_id: userId, post_id: postId });
		if (error) throw error;
	},

	async end(id: string): Promise<void> {
		await supabaseAdmin.from('duels').update({ status: 'ended' }).eq('id', id);
	},

	async getWinnerId(id: string): Promise<string | null> {
		const { data } = await supabaseAdmin
			.from('duel_votes')
			.select('post_id')
			.eq('duel_id', id);
		if (!data || data.length === 0) return null;

		const counts: Record<string, number> = {};
		for (const { post_id } of data) {
			counts[post_id] = (counts[post_id] ?? 0) + 1;
		}
		return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
	},
};
