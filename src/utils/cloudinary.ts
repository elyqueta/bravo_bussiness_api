import { v2 as cloudinary } from 'cloudinary';
import { env } from '../config/env';

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export interface UploadedImage {
  url: string;
  publicId: string;
}

export async function uploadImage(file: Express.Multer.File): Promise<UploadedImage> {
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

          if (!result?.secure_url || !result?.public_id) {
            reject(new Error('Cloudinary retornou uma resposta sem URL ou public_id.'));
            return;
          }

          resolve({ url: result.secure_url, publicId: result.public_id });
        }
      )
      .end(buffer);
  });
}

export async function deleteImage(url: string): Promise<void> {
  const publicId = getPublicIdFromUrl(url);

  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error(`Falha ao eliminar imagem do Cloudinary (${publicId}):`, error);
  }
}

function getPublicIdFromUrl(url: string): string {
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.\w+)?$/);
  if (!match || !match[1]) return url;
  return match[1];
}

export { cloudinary };