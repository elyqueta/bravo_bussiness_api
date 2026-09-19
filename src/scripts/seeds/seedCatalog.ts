import { categoryRepository } from '../../repositories/category.repository';
import { productRepository } from '../../repositories/product.repository';
import { query } from '../../database/pool';
import { SEED_CATEGORIES, SEED_PRODUCTS } from './data';

export async function seedCategories(): Promise<Map<string, string>> {
  const labelToId = new Map<string, string>();

  for (const category of SEED_CATEGORIES) {
    const existing = await query<{ id: string }>('SELECT id FROM category WHERE slug = $1', [
      category.label.toLowerCase().replace(/\s+/g, '-'),
    ]);

    if (existing.rows[0]) {
      console.warn(`Categoria "${category.label}" já existe (id: ${existing.rows[0].id}). Nada a fazer.`);
      labelToId.set(category.label, existing.rows[0].id);
      continue;
    }

    const slug = category.label.toLowerCase().replace(/\s+/g, '-');
    const created = await categoryRepository.create({
      slug,
      label: category.label,
      icon: category.icon,
      prefix: category.prefix,
      anchor: category.anchor,
    });

    console.warn(`Categoria criada: ${created.label} (id: ${created.id})`);
    labelToId.set(category.label, created.id);
  }

  return labelToId;
}

export async function seedProducts(categoryLabels: Map<string, string>): Promise<void> {
  for (const product of SEED_PRODUCTS) {
    const categoryId = categoryLabels.get(product.categoryLabel);

    if (!categoryId) {
      console.error(`Categoria "${product.categoryLabel}" não encontrada para o produto "${product.name}".`);
      continue;
    }

    const category = await categoryRepository.findById(categoryId);

    if (!category) {
      console.error(`Categoria com id "${categoryId}" não encontrada.`);
      continue;
    }

    const existing = await query<{ id: string }>('SELECT id FROM product WHERE name = $1', [
      product.name,
    ]);

    if (existing.rows[0]) {
      console.warn(`Produto "${product.name}" já existe (id: ${existing.rows[0].id}). Nada a fazer.`);
      continue;
    }

    const countResult = await query<{ count: string }>(
      'SELECT COUNT(*)::text AS count FROM product WHERE category_slug = $1',
      [category.slug]
    );
    const nextSeq = Number(countResult.rows[0]?.count ?? 0) + 1;
    const productId = `BB-${category.prefix}${String(nextSeq).padStart(3, '0')}`;

    const created = await productRepository.create({
      id: productId,
      categorySlug: category.slug,
      name: product.name,
      description: product.description,
      price: product.price,
      oldPrice: product.oldPrice ?? null,
      img: product.img,
      badge: product.badge ?? null,
      features: product.features,
      gallery: product.gallery,
    });

    console.warn(`Produto criado: ${created.name} (id: ${created.id})`);
  }
}
