import { productRepository } from '../repositories/product.repository';
import { categoryService } from './category.service';
import { CreateProductData, Product, ProductFilters } from '../types/product.types';
import { CreateProductInput, UpdateProductInput } from '../validators/product.validator';
import { NotFoundError } from '../errors';
import { uploadImage } from '../utils/cloudinary';

async function create(input: CreateProductInput, imageFile: Express.Multer.File): Promise<Product> {
  const category = await categoryService.findBySlug(input.categorySlug);

  const countResult = await productRepository.findAll(
    { categorySlug: category.slug },
    { page: 1, limit: 1 }
  );

  const nextSeq = countResult.total + 1;
  const productId = `BB-${category.prefix}${String(nextSeq).padStart(3, '0')}`;

  const img = await uploadImage(imageFile);

  const data: CreateProductData = {
    id: productId,
    categorySlug: category.slug,
    name: input.name,
    description: input.description ?? null,
    price: input.price,
    oldPrice: input.oldPrice ?? null,
    img,
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

async function update(
  id: string,
  input: UpdateProductInput,
  imageFile?: Express.Multer.File
): Promise<Product> {
  if (input.categorySlug !== undefined) {
    await categoryService.findBySlug(input.categorySlug);
  }

  const updateData: UpdateProductInput = { ...input };

  if (imageFile) {
    (updateData as UpdateProductInput & { img: string }).img = await uploadImage(imageFile);
  }

  const updated = await productRepository.update(id, updateData);

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
