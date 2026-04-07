import { supabaseAdmin } from '@/lib/supabase.js';
import { XP_INITIAL } from '@/utils/consts/xp.js';

export const xpRepository = {
	async findByUser(
		userId: string,
	): Promise<{ xp: number; xp_max: number; level: number } | null> {
		const { data } = await supabaseAdmin
			.from('users')
			.select('xp, xp_max, level')
			.eq('id', userId)
			.single();
		return data ?? null;
	},

	async update(
		userId: string,
		payload: { xp: number; xp_max?: number; level?: number },
	): Promise<void> {
		await supabaseAdmin.from('users').update(payload).eq('id', userId);
	},

	async reset(userId: string): Promise<void> {
		await supabaseAdmin.from('users').update(XP_INITIAL).eq('id', userId);
	},
};
