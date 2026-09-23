import { v2 as cloudinary } from 'cloudinary';
import { env } from '../config/env';

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(file: Express.Multer.File): Promise<string> {
  const buffer = file.buffer;

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: 'bravo-business/products',
          resource_type: 'image',
          transformation: [
            { width: 1200, height: 800, crop: 'limit', quality: 'auto' },
            { fetch_format: 'auto' },
          ],
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(new Error(`Falha ao enviar imagem para o Cloudinary: ${error.message}`));
            return;
          }

          if (!result?.secure_url) {
            reject(new Error('Cloudinary retornou uma resposta sem URL.'));
            return;
          }

          resolve(result.secure_url);
        }
      )
      .end(buffer);
  });
}

export { cloudinary };