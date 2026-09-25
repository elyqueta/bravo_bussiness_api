import { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler';
import { productService } from '../services/product.service';
import {
  CreateProductInput,
  ListProductsQuery,
  ProductIdParam,
  UpdateProductInput,
} from '../validators/product.validator';
import { BadRequestError } from '../errors';

const create = asyncHandler(
  async (req: Request<Record<string, string>, unknown, CreateProductInput>, res: Response) => {
    const files = req.files as { img?: Express.Multer.File[]; 'gallery[]'?: Express.Multer.File[] };

    const imageFile = files.img?.[0];

    if (!imageFile) {
      throw new BadRequestError('Arquivo de imagem obrigatório.');
    }

    const galleryFiles: Express.Multer.File[] = files['gallery[]'] ?? [];

    const product = await productService.create(req.body, imageFile, galleryFiles);

    res.status(201).json({
      status: 'success',
      data: product,
    });
  }
);

const findAll = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, categorySlug, badge, search } = req.query as unknown as ListProductsQuery;

  const result = await productService.findAll(
    { categorySlug, badge, search },
    { page, limit }
  );

  res.status(200).json({
    status: 'success',
    data: result.data,
    pagination: {
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: result.totalPages,
    },
  });
});

const findById = asyncHandler(async (req: Request<ProductIdParam>, res: Response) => {
  const product = await productService.findById(req.params.id);

  res.status(200).json({
    status: 'success',
    data: product,
  });
});

const update = asyncHandler(
  async (req: Request<ProductIdParam, unknown, UpdateProductInput>, res: Response) => {
    const files = req.files as { img?: Express.Multer.File[]; 'gallery[]'?: Express.Multer.File[] };

    const imageFile: Express.Multer.File | undefined = files.img?.[0];
    const galleryFiles: Express.Multer.File[] = files['gallery[]'] ?? [];

    const product = await productService.update(req.params.id, req.body, imageFile, galleryFiles);

    res.status(200).json({
      status: 'success',
      data: product,
    });
  }
);

const remove = asyncHandler(async (req: Request<ProductIdParam>, res: Response) => {
  await productService.remove(req.params.id);

  res.status(204).send();
});

export const productController = {
  create,
  findAll,
  findById,
  update,
  remove,
};
