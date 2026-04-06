import { withCapture } from '@/lib/sentry.js';
import { achievementRepository } from '@/repositories/achievement.js';

export const achievementService = {
	async getAll() {
		return withCapture(() => achievementRepository.findAll());
	},

	async getById(id: string) {
		return withCapture(() => achievementRepository.findById(id));
	},
};
