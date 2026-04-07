import { supabaseAdmin } from '@/lib/supabase.js';
import type { User } from '@/types/user.js';

export const followerRepository = {
	async findFollowers(userId: string): Promise<User[]> {
		const { data } = await supabaseAdmin
			.from('follows')
			.select('users!follower_id(*)')
			.eq('following_id', userId);
		return data?.map((r: { users: unknown }) => r.users as User) ?? [];
	},

	async findFollowing(userId: string): Promise<User[]> {
		const { data } = await supabaseAdmin
			.from('follows')
			.select('users!following_id(*)')
			.eq('follower_id', userId);
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
};
