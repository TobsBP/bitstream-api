import { withCapture } from '@/lib/sentry.js';
import { followerRepository } from '@/repositories/follower.js';

export const followerService = {
	async getFollowers(userId: string) {
		return withCapture(() => followerRepository.findFollowers(userId));
	},

	async getFollowing(userId: string) {
		return withCapture(() => followerRepository.findFollowing(userId));
	},

	async toggleFollow(followerId: string, followingId: string) {
		return withCapture(async () => {
			const already = await followerRepository.isFollowing(
				followerId,
				followingId,
			);
			if (already) {
				await followerRepository.unfollow(followerId, followingId);
				return { following: false };
			}
			await followerRepository.follow(followerId, followingId);
			return { following: true };
		});
	},
};
