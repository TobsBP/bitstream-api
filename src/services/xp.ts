import { withCapture } from '@/lib/sentry.js';
import { xpRepository } from '@/repositories/xp.js';

export const xpService = {
	async getByUser(userId: string) {
		return withCapture(() => xpRepository.findByUser(userId));
	},

	async add(userId: string, amount: number) {
		return withCapture(async () => {
			const xp = await xpRepository.findByUser(userId);
			if (!xp) return;

			const newXp = xp.xp + amount;
			if (newXp >= xp.xp_max) {
				await xpRepository.update(userId, {
					xp: newXp - xp.xp_max,
					xp_max: xp.xp_max + 500,
					level: xp.level + 1,
				});
			} else {
				await xpRepository.update(userId, { xp: newXp });
			}
		});
	},

	async reset(userId: string) {
		return withCapture(() => xpRepository.reset(userId));
	},
};
