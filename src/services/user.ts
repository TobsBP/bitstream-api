import type { Readable } from 'node:stream';
import { uploadStream } from '@/lib/cloudinary.js';
import { withCapture } from '@/lib/sentry.js';
import { supabaseAdmin } from '@/lib/supabase.js';
import { userRepository } from '@/repositories/user.js';
import type { UserUpdate } from '@/types/user.js';

export const userService = {
	async register(email: string, password: string, username: string) {
		return withCapture(async () => {
			const { data, error } = await supabaseAdmin.auth.admin.createUser({
				email,
				password,
				email_confirm: true,
			});
			if (error) throw error;
			const user = await userRepository.create(data.user.id, username);
			return { user, session: null };
		});
	},

	async login(email: string, password: string) {
		return withCapture(async () => {
			const { data, error } = await supabaseAdmin.auth.signInWithPassword({
				email,
				password,
			});
			if (error) throw error;
			return data;
		});
	},

	async getById(id: string) {
		return withCapture(() => userRepository.findById(id));
	},

	async getAll() {
		return withCapture(() => userRepository.getAll());
	},

	async update(id: string, payload: UserUpdate) {
		return withCapture(() => userRepository.update(id, payload));
	},

	async uploadAvatar(id: string, stream: Readable) {
		return withCapture(async () => {
			const url = await uploadStream(stream, 'bitstream/avatars');
			return userRepository.update(id, { avatar_url: url });
		});
	},

	async getAchievements(userId: string) {
		return withCapture(() => userRepository.findAchievements(userId));
	},

	async delete(id: string) {
		return withCapture(async () => {
			await userRepository.delete(id);
			await supabaseAdmin.auth.admin.deleteUser(id);
		});
	},
};
