import { query } from '../database/pool';
import { CreateProductData, Product, ProductFilters, ProductRow } from '../types/product.types';
import { PaginationParams } from '../types/pagination.types';
import { UpdateProductInput } from '../validators/product.validator';
import { ConflictError } from '../errors';

const PG_FOREIGN_KEY_VIOLATION = '23503';

function isPgError(err: unknown): err is { code: string } {
  return typeof err === 'object' && err !== null && 'code' in err;
}

function toProduct(row: ProductRow): Product {
  return {
    id: row.id,
    categorySlug: row.category_slug,
    name: row.name,
    description: row.description,
    price: Number(row.price),
    oldPrice: row.old_price !== null ? Number(row.old_price) : null,
    img: row.img,
    badge: row.badge as Product['badge'],
    features: row.features ?? [],
    gallery: row.gallery ?? [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

const RETURNING_COLUMNS = `id, category_slug, name, description, price, old_price,
  img, badge, features, gallery, created_at, updated_at`;
const LIST_COLUMNS = `product.id, product.category_slug, product.name, product.description,
  product.price, product.old_price, product.img, product.badge,
  product.features, product.gallery, product.created_at, product.updated_at`;

async function create(data: CreateProductData): Promise<Product> {
  const result = await query<ProductRow>(
    `INSERT INTO product (id, category_slug, name, description, price, old_price, img, badge, features, gallery)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb, $10::jsonb)
     RETURNING ${RETURNING_COLUMNS}`,
    [
      data.id,
      data.categorySlug,
      data.name,
      data.description ?? null,
      data.price,
      data.oldPrice ?? null,
      data.img,
      data.badge ?? null,
      JSON.stringify(data.features ?? []),
      JSON.stringify(data.gallery ?? []),
    ]
  );

  return toProduct(result.rows[0] as ProductRow);
}

function buildWhereClause(filters: ProductFilters): { clause: string; values: unknown[] } {
  const conditions: string[] = [];
  const values: unknown[] = [];

  if (filters.categorySlug !== undefined) {
    values.push(filters.categorySlug);
    conditions.push(`category_slug = $${values.length}`);
  }

  if (filters.badge !== undefined) {
    values.push(filters.badge);
    conditions.push(`badge = $${values.length}`);
  }

  if (filters.search !== undefined) {
    values.push(`%${filters.search}%`);
    conditions.push(`name ILIKE $${values.length}`);
  }

  const clause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  return { clause, values };
}

async function findAll(
  filters: ProductFilters,
  pagination: PaginationParams
): Promise<{ data: Product[]; page: number; limit: number; total: number; totalPages: number }> {
  const { clause, values } = buildWhereClause(filters);

  const countResult = await query<{ count: number }>(
    `SELECT COUNT(*)::int AS count FROM product ${clause}`,
    values
  );
  const total = countResult.rows[0]?.count ?? 0;

  const offset = (pagination.page - 1) * pagination.limit;
  const limitParamIndex = values.length + 1;
  const offsetParamIndex = values.length + 2;

  const dataResult = await query<ProductRow>(
    `SELECT ${LIST_COLUMNS}, category.label AS category_label
     FROM product
     INNER JOIN category ON category.slug = product.category_slug
     ${clause}
     ORDER BY product.created_at DESC
     LIMIT $${limitParamIndex} OFFSET $${offsetParamIndex}`,
    [...values, pagination.limit, offset]
  );

  return {
    data: dataResult.rows.map(toProduct),
    page: pagination.page,
    limit: pagination.limit,
    total,
    totalPages: Math.ceil(total / pagination.limit),
  };
}

async function findById(id: string): Promise<Product | null> {
  const result = await query<ProductRow>(`SELECT ${RETURNING_COLUMNS} FROM product WHERE id = $1`, [
    id,
  ]);

  const row = result.rows[0];
  return row ? toProduct(row) : null;
}

async function update(id: string, data: UpdateProductInput): Promise<Product | null> {
  const fields: string[] = [];
  const values: unknown[] = [];
  let paramIndex = 1;

  if (data.categorySlug !== undefined) {
    fields.push(`category_slug = $${paramIndex}`);
    values.push(data.categorySlug);
    paramIndex += 1;
  }
  if (data.name !== undefined) {
    fields.push(`name = $${paramIndex}`);
    values.push(data.name);
    paramIndex += 1;
  }
  if ('description' in data) {
    fields.push(`description = $${paramIndex}`);
    values.push(data.description);
    paramIndex += 1;
  }
  if (data.price !== undefined) {
    fields.push(`price = $${paramIndex}`);
    values.push(data.price);
    paramIndex += 1;
  }
  if ('oldPrice' in data) {
    fields.push(`old_price = $${paramIndex}`);
    values.push(data.oldPrice);
    paramIndex += 1;
  }
  if ('img' in data) {
    fields.push(`img = $${paramIndex}`);
    values.push(data.img);
    paramIndex += 1;
  }
  if ('badge' in data) {
    fields.push(`badge = $${paramIndex}`);
    values.push(data.badge);
    paramIndex += 1;
  }
  if ('features' in data) {
    fields.push(`features = $${paramIndex}::jsonb`);
    values.push(JSON.stringify(data.features));
    paramIndex += 1;
  }
  if ('gallery' in data) {
    fields.push(`gallery = $${paramIndex}::jsonb`);
    values.push(JSON.stringify(data.gallery));
    paramIndex += 1;
  }

  if (fields.length === 0) {
    return findById(id);
  }

  values.push(id);

  const result = await query<ProductRow>(
    `UPDATE product
     SET ${fields.join(', ')}
     WHERE id = $${paramIndex}
     RETURNING ${RETURNING_COLUMNS}`,
    values
  );

  const row = result.rows[0];
  return row ? toProduct(row) : null;
}

async function remove(id: string): Promise<boolean> {
  try {
    const result = await query('DELETE FROM product WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  } catch (err) {
    if (isPgError(err) && err.code === PG_FOREIGN_KEY_VIOLATION) {
      throw new ConflictError(
        'Não é possível remover este produto: existem referências a ele em outros registos.'
      );
    }
    throw err;
  }
}

export const productRepository = {
  create,
  findAll,
  findById,
  update,
  remove,
};
