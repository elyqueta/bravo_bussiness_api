import { productRepository } from '../repositories/product.repository';
import { categoryService } from './category.service';
import { CreateProductData, Product, ProductFilters } from '../types/product.types';
import { CreateProductInput, UpdateProductInput } from '../validators/product.validator';
import { NotFoundError } from '../errors';

async function create(input: CreateProductInput): Promise<Product> {
  const category = await categoryService.findBySlug(input.categorySlug);

  const countResult = await productRepository.findAll(
    { categorySlug: category.slug },
    { page: 1, limit: 1 }
  );

  const nextSeq = countResult.total + 1;
  const productId = `BB-${category.prefix}${String(nextSeq).padStart(3, '0')}`;

  const data: CreateProductData = {
    id: productId,
    categorySlug: category.slug,
    name: input.name,
    description: input.description ?? null,
    price: input.price,
    oldPrice: input.oldPrice ?? null,
    img: input.img,
    badge: input.badge ?? null,
    features: input.features ?? [],
    gallery: input.gallery ?? [],
  };

  return productRepository.create(data);
}

async function findAll(
  filters: ProductFilters,
  pagination: { page: number; limit: number }
): Promise<{ data: Product[]; page: number; limit: number; total: number; totalPages: number }> {
  return productRepository.findAll(filters, pagination);
}

async function findById(id: string): Promise<Product> {
  const product = await productRepository.findById(id);

  if (!product) {
    throw new NotFoundError(`Produto com id "${id}" não encontrado.`);
  }

  return product;
}

async function update(id: string, input: UpdateProductInput): Promise<Product> {
  if (input.categorySlug !== undefined) {
    await categoryService.findBySlug(input.categorySlug);
  }

  const updated = await productRepository.update(id, input);

  if (!updated) {
    throw new NotFoundError(`Produto com id "${id}" não encontrado.`);
  }

  return updated;
}

async function remove(id: string): Promise<void> {
  const deleted = await productRepository.remove(id);

  if (!deleted) {
    throw new NotFoundError(`Produto com id "${id}" não encontrado.`);
  }
}

export const productService = {
  create,
  findAll,
  findById,
  update,
  remove,
};
