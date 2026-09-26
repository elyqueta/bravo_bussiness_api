import { Request, RequestHandler } from 'express';
import multer from 'multer';
import { BadRequestError } from '../errors';

const storage = multer.memoryStorage();

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  next: (err: Error | null, accept?: boolean) => void
): void => {
  if (!file.mimetype.startsWith('image/')) {
    next(new BadRequestError('Apenas arquivos de imagem são permitidos.'));
    return;
  }

  next(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

async function detectMimeType(buffer: Buffer): Promise<string | undefined> {
  const { fileTypeFromBuffer } = await import('file-type');
  const detected = await fileTypeFromBuffer(buffer);
  return detected?.mime;
}

export async function validateImageMagicBytes(file: Express.Multer.File): Promise<void> {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  const detectedMime = await detectMimeType(file.buffer);

  if (!detectedMime || !allowedTypes.includes(detectedMime)) {
    throw new BadRequestError('O arquivo enviado não é uma imagem válida (JPEG, PNG ou WebP).');
  }
}

export function uploadProductImages(): RequestHandler {
  return upload.fields([
    { name: 'img', maxCount: 1 },
    { name: 'gallery[]', maxCount: 20 },
  ]);
}
