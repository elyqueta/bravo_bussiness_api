import { query } from '../database/pool';
import { Category, CategoryRow, CreateCategoryData } from '../types/category.types';
import { UpdateCategoryInput } from '../validators/category.validator';
import { ConflictError } from '../errors';

const PG_UNIQUE_VIOLATION = '23505';
const PG_FOREIGN_KEY_VIOLATION = '23503';

function isPgError(err: unknown): err is { code: string } {
  return typeof err === 'object' && err !== null && 'code' in err;
}

function toCategory(row: CategoryRow): Category {
  return {
    id: row.id,
    slug: row.slug,
    label: row.label,
    icon: row.icon,
    prefix: row.prefix,
    anchor: row.anchor,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function create(data: CreateCategoryData): Promise<Category> {
  try {
    const result = await query<CategoryRow>(
      `INSERT INTO category (id, slug, label, icon, prefix, anchor)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, slug, label, icon, prefix, anchor, created_at, updated_at`,
      [data.slug, data.slug, data.label, data.icon ?? null, data.prefix, data.anchor]
    );

    return toCategory(result.rows[0] as CategoryRow);
  } catch (err) {
    if (isPgError(err) && err.code === PG_UNIQUE_VIOLATION) {
      throw new ConflictError(`Já existe uma categoria com o slug "${data.slug}".`);
    }
    throw err;
  }
}

async function findAll(): Promise<Category[]> {
  const result = await query<CategoryRow>(
    `SELECT id, slug, label, icon, prefix, anchor, created_at, updated_at
     FROM category
     ORDER BY label ASC`
  );

  return result.rows.map(toCategory);
}

async function findById(id: string): Promise<Category | null> {
  const result = await query<CategoryRow>(
    `SELECT id, slug, label, icon, prefix, anchor, created_at, updated_at
     FROM category
     WHERE id = $1`,
    [id]
  );

  const row = result.rows[0];
  return row ? toCategory(row) : null;
}

async function findBySlug(slug: string): Promise<Category | null> {
  const result = await query<CategoryRow>(
    `SELECT id, slug, label, icon, prefix, anchor, created_at, updated_at
     FROM category
     WHERE slug = $1`,
    [slug]
  );

  const row = result.rows[0];
  return row ? toCategory(row) : null;
}

async function update(id: string, data: UpdateCategoryInput): Promise<Category | null> {
  const fields: string[] = [];
  const values: unknown[] = [];
  let paramIndex = 1;

  if (data.label !== undefined) {
    fields.push(`label = $${paramIndex}`);
    values.push(data.label);
    paramIndex += 1;
  }

  if ('icon' in data) {
    fields.push(`icon = $${paramIndex}`);
    values.push(data.icon);
    paramIndex += 1;
  }

  if ('prefix' in data) {
    fields.push(`prefix = $${paramIndex}`);
    values.push(data.prefix);
    paramIndex += 1;
  }

  if ('anchor' in data) {
    fields.push(`anchor = $${paramIndex}`);
    values.push(data.anchor);
    paramIndex += 1;
  }

  if (fields.length === 0) {
    return findById(id);
  }

  values.push(id);

  const result = await query<CategoryRow>(
    `UPDATE category
     SET ${fields.join(', ')}
     WHERE id = $${paramIndex}
     RETURNING id, slug, label, icon, prefix, anchor, created_at, updated_at`,
    values
  );

  const row = result.rows[0];
  return row ? toCategory(row) : null;
}

async function remove(id: string): Promise<boolean> {
  try {
    const result = await query('DELETE FROM category WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  } catch (err) {
    if (isPgError(err) && err.code === PG_FOREIGN_KEY_VIOLATION) {
      throw new ConflictError(
        'Não é possível remover esta categoria: existem produtos associados a ela.'
      );
    }
    throw err;
  }
}

export const categoryRepository = {
  create,
  findAll,
  findById,
  findBySlug,
  update,
  remove,
};
