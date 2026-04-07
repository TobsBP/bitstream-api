import { withCapture } from '@/lib/sentry.js';
import { duelRepository } from '@/repositories/duel.js';
import { userService } from '@/services/user.js';
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
			await userService.addXp(userId, VOTE_XP);

			return { xp_gained: VOTE_XP };
		});
	},

	async end(duelId: string) {
		return withCapture(async () => {
			const winnerUserId = await duelRepository.getWinnerUserId(duelId);
			if (winnerUserId) {
				await userService.addXp(winnerUserId, WIN_XP);
			}
			await duelRepository.end(duelId);
			return { ended: true };
		});
	},
};
