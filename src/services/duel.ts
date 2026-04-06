import { withCapture } from '@/lib/sentry.js';
import { supabaseAdmin } from '@/lib/supabase.js';
import { duelRepository } from '@/repositories/duel.js';
import { userRepository } from '@/repositories/user.js';
import type { NewDuel } from '@/types/duel.js';

const VOTE_XP = 5;
const WIN_XP = 50;

export const duelService = {
	async getAll() {
		return withCapture(() => duelRepository.findAll());
	},

	async getById(id: string) {
		return withCapture(() => duelRepository.findById(id));
	},

	async create(payload: NewDuel) {
		return withCapture(() => duelRepository.create(payload));
	},

	async vote(duelId: string, userId: string, postId: string) {
		return withCapture(async () => {
			const already = await duelRepository.hasVoted(duelId, userId);
			if (already) throw new Error('Already voted in this duel');

			await duelRepository.vote(duelId, userId, postId);
			await userRepository.addXp(userId, VOTE_XP);

			return { xp_gained: VOTE_XP };
		});
	},

	async end(duelId: string) {
		return withCapture(async () => {
			const winnerPostId = await duelRepository.getWinnerId(duelId);
			if (winnerPostId) {
				const { data: post } = await supabaseAdmin
					.from('posts')
					.select('user_id')
					.eq('id', winnerPostId)
					.single();
				if (post?.user_id) {
					await userRepository.addXp(post.user_id, WIN_XP);
				}
			}
			await duelRepository.end(duelId);
			return { ended: true };
		});
	},
};
