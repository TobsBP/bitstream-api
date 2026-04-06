import { supabaseAdmin } from '@/lib/supabase.js';
import type { Achievement } from '@/types/achievement.js';

export const achievementRepository = {
	async findAll(): Promise<Achievement[]> {
		const { data } = await supabaseAdmin.from('achievements').select('*');
		return (data ?? []) as Achievement[];
	},

	async findById(id: string): Promise<Achievement | null> {
		const { data } = await supabaseAdmin
			.from('achievements')
			.select('*')
			.eq('id', id)
			.single();
		return data ?? null;
	},
};
