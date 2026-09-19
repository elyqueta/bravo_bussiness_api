import { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler';
import { categoryService } from '../services/category.service';
import {
  CategoryIdParam,
  CreateCategoryInput,
  UpdateCategoryInput,
} from '../validators/category.validator';

const create = asyncHandler(
  async (req: Request<Record<string, string>, unknown, CreateCategoryInput>, res: Response) => {
    const category = await categoryService.create(req.body);

    res.status(201).json({
      status: 'success',
      data: category,
    });
  }
);

const findAll = asyncHandler(async (_req: Request, res: Response) => {
  const categories = await categoryService.findAll();

  res.status(200).json({
    status: 'success',
    data: categories,
    count: categories.length,
  });
});

const findById = asyncHandler(async (req: Request<CategoryIdParam>, res: Response) => {
  const category = await categoryService.findById(req.params.id);

  res.status(200).json({
    status: 'success',
    data: category,
  });
});

const update = asyncHandler(
  async (req: Request<CategoryIdParam, unknown, UpdateCategoryInput>, res: Response) => {
    const category = await categoryService.update(req.params.id, req.body);

    res.status(200).json({
      status: 'success',
      data: category,
    });
  }
);

const remove = asyncHandler(async (req: Request<CategoryIdParam>, res: Response) => {
  await categoryService.remove(req.params.id);

  res.status(204).send();
});

export const categoryController = {
  create,
  findAll,
  findById,
  update,
  remove,
};
