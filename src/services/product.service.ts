import { productRepository } from '../repositories/product.repository';
import { categoryService } from './category.service';
import { CreateProductData, Product, ProductFilters } from '../types/product.types';
import { CreateProductInput, UpdateProductInput } from '../validators/product.validator';
import { NotFoundError, ConflictError } from '../errors';
import { uploadImage, deleteImage } from '../utils/cloudinary';
import { validateImageMagicBytes } from '../middlewares/upload';

async function create(
  input: CreateProductInput,
  imageFile: Express.Multer.File,
  galleryFiles: Express.Multer.File[] = []
): Promise<Product> {
  await validateImageMagicBytes(imageFile);
  for (const file of galleryFiles) {
    await validateImageMagicBytes(file);
  }

  const category = await categoryService.findBySlug(input.categorySlug);

  const countResult = await productRepository.findAll(
    { categorySlug: category.slug },
    { page: 1, limit: 1 }
  );

  let nextSeq = countResult.total + 1;
  const maxRetries = 10;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const productId = `BB-${category.prefix}${String(nextSeq).padStart(3, '0')}`;

    const { url: img } = await uploadImage(imageFile);

    const gallery: string[] = [];
    for (const file of galleryFiles) {
      const { url } = await uploadImage(file);
      gallery.push(url);
    }

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
      gallery,
    };

    try {
      return await productRepository.create(data);
    } catch (err) {
      const isUniqueViolation =
        typeof err === 'object' &&
        err !== null &&
        'code' in err &&
        (err as { code?: string }).code === '23505';

      if (!isUniqueViolation) {
        throw err;
      }

      nextSeq += 1;
    }
  }

  throw new ConflictError(
    'Não foi possível gerar um código de produto único após várias tentativas.'
  );
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
  imageFile?: Express.Multer.File,
  galleryFiles?: Express.Multer.File[]
): Promise<Product> {
  if (input.categorySlug !== undefined) {
    await categoryService.findBySlug(input.categorySlug);
  }

  const existing = await productRepository.findById(id);
  if (!existing) {
    throw new NotFoundError(`Produto com id "${id}" não encontrado.`);
  }

  const updateData: UpdateProductInput = { ...input };

  if (imageFile) {
    await validateImageMagicBytes(imageFile);
    (updateData as UpdateProductInput & { img: string }).img = (await uploadImage(imageFile)).url;
  }

  if (galleryFiles && galleryFiles.length > 0) {
    for (const file of galleryFiles) {
      await validateImageMagicBytes(file);
    }

    const gallery: string[] = [];
    for (const file of galleryFiles) {
      const { url } = await uploadImage(file);
      gallery.push(url);
    }
    (updateData as UpdateProductInput & { gallery: string[] }).gallery = gallery;
  }

  const updated = await productRepository.update(id, updateData);

  if (!updated) {
    throw new NotFoundError(`Produto com id "${id}" não encontrado.`);
  }

  if (imageFile && existing.img) {
    await deleteImage(existing.img);
  }

  if (galleryFiles && galleryFiles.length > 0 && existing.gallery.length > 0) {
    await Promise.all(existing.gallery.map((url) => deleteImage(url)));
  }

  return updated;
}

async function remove(id: string): Promise<void> {
  const existing = await productRepository.findById(id);

  if (!existing) {
    throw new NotFoundError(`Produto com id "${id}" não encontrado.`);
  }

  const deleted = await productRepository.remove(id);

  if (!deleted) {
    throw new NotFoundError(`Produto com id "${id}" não encontrado.`);
  }

  const imagesToDelete = [existing.img, ...existing.gallery].filter(Boolean);
  await Promise.all(imagesToDelete.map((url) => deleteImage(url)));
}

export const productService = {
  create,
  findAll,
  findById,
  update,
  remove,
};
