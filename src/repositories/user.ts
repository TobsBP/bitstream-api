import { supabaseAdmin } from '@/lib/supabase.js';
import type { UserAchievement } from '@/types/achievement.js';
import type { User, UserPatch } from '@/types/user.js';

export const userRepository = {
	async getAll(): Promise<User[]> {
		const { data } = await supabaseAdmin.from('users').select('*');
		return data ?? [];
	},

	async findById(id: string): Promise<User | null> {
		const { data } = await supabaseAdmin
			.from('users')
			.select('*')
			.eq('id', id)
			.single();
		return data ?? null;
	},

	async create(id: string, username: string): Promise<User> {
		const { data, error } = await supabaseAdmin
			.from('users')
			.insert({ id, username })
			.select()
			.single();
		if (error) throw error;
		return data;
	},

	async update(id: string, payload: UserPatch): Promise<User | null> {
		const { data } = await supabaseAdmin
			.from('users')
			.update(payload)
			.eq('id', id)
			.select()
			.single();
		return data ?? null;
	},

	async findFollowers(id: string): Promise<User[]> {
		const { data } = await supabaseAdmin
			.from('follows')
			.select('users!follower_id(*)')
			.eq('following_id', id);
		return data?.map((r: { users: unknown }) => r.users as User) ?? [];
	},

	async findFollowing(id: string): Promise<User[]> {
		const { data } = await supabaseAdmin
			.from('follows')
			.select('users!following_id(*)')
			.eq('follower_id', id);
		return data?.map((r: { users: unknown }) => r.users as User) ?? [];
	},

	async isFollowing(followerId: string, followingId: string): Promise<boolean> {
		const { data } = await supabaseAdmin
			.from('follows')
			.select('follower_id')
			.eq('follower_id', followerId)
			.eq('following_id', followingId)
			.single();
		return !!data;
	},

	async follow(followerId: string, followingId: string): Promise<void> {
		await supabaseAdmin
			.from('follows')
			.upsert({ follower_id: followerId, following_id: followingId });
	},

	async unfollow(followerId: string, followingId: string): Promise<void> {
		await supabaseAdmin
			.from('follows')
			.delete()
			.eq('follower_id', followerId)
			.eq('following_id', followingId);
	},

	async findAchievements(userId: string): Promise<UserAchievement[]> {
		const { data } = await supabaseAdmin
			.from('user_achievements')
			.select('achievements(*), earned_at')
			.eq('user_id', userId)
			.order('earned_at', { ascending: false });
		return (data?.map((r: { achievements: unknown; earned_at: string }) => ({
			...(r.achievements as Record<string, unknown>),
			earned_at: r.earned_at,
		})) ?? []) as unknown as UserAchievement[];
	},

	async delete(id: string): Promise<void> {
		const { error } = await supabaseAdmin.from('users').delete().eq('id', id);
		if (error) throw error;
	},

	async addXp(userId: string, amount: number): Promise<void> {
		const { data: user } = await supabaseAdmin
			.from('users')
			.select('xp, xp_max, level')
			.eq('id', userId)
			.single();
		if (!user) return;

		const newXp = user.xp + amount;
		if (newXp >= user.xp_max) {
			await supabaseAdmin
				.from('users')
				.update({
					xp: newXp - user.xp_max,
					xp_max: user.xp_max + 500,
					level: user.level + 1,
				})
				.eq('id', userId);
		} else {
			await supabaseAdmin.from('users').update({ xp: newXp }).eq('id', userId);
		}
	},
};
