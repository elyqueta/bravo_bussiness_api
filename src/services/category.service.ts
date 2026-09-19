import { categoryRepository } from '../repositories/category.repository';
import { Category } from '../types/category.types';
import { CreateCategoryInput, UpdateCategoryInput } from '../validators/category.validator';
import { generateSlug } from '../utils/slug.util';
import { NotFoundError } from '../errors';

async function create(input: CreateCategoryInput): Promise<Category> {
  const slug = generateSlug(input.label);

  return categoryRepository.create({
    slug,
    label: input.label,
    icon: input.icon ?? null,
    prefix: input.prefix,
    anchor: input.anchor,
  });
}

async function findAll(): Promise<Category[]> {
  return categoryRepository.findAll();
}

async function findById(id: string): Promise<Category> {
  const category = await categoryRepository.findById(id);

  if (!category) {
    throw new NotFoundError(`Categoria com id "${id}" não encontrada.`);
  }

  return category;
}

async function findBySlug(slug: string): Promise<Category> {
  const category = await categoryRepository.findBySlug(slug);

  if (!category) {
    throw new NotFoundError(`Categoria com slug "${slug}" não encontrada.`);
  }

  return category;
}

async function update(id: string, input: UpdateCategoryInput): Promise<Category> {
  const updated = await categoryRepository.update(id, input);

  if (!updated) {
    throw new NotFoundError(`Categoria com id "${id}" não encontrada.`);
  }

  return updated;
}

async function remove(id: string): Promise<void> {
  const deleted = await categoryRepository.remove(id);

  if (!deleted) {
    throw new NotFoundError(`Categoria com id "${id}" não encontrada.`);
  }
}

export const categoryService = {
  create,
  findAll,
  findById,
  findBySlug,
  update,
  remove,
};
