import type { Readable } from 'node:stream';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({ cloudinary_url: process.env.CLOUDINARY_URL });

export async function uploadStream(
	stream: Readable,
	folder: string,
): Promise<string> {
	return new Promise((resolve, reject) => {
		const upload = cloudinary.uploader.upload_stream(
			{ folder },
			(error, result) => {
				if (error || !result)
					return reject(error ?? new Error('Upload failed'));
				resolve(result.secure_url);
			},
		);
		stream.pipe(upload);
	});
}
