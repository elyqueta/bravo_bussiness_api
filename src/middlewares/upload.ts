import { Request } from 'express';
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

export function uploadSingle(fieldName = 'img') {
  return upload.single(fieldName);
}
