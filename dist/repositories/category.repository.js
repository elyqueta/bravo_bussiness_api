"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryRepository = void 0;
const pool_1 = require("../database/pool");
const errors_1 = require("../errors");
const PG_UNIQUE_VIOLATION = '23505';
const PG_FOREIGN_KEY_VIOLATION = '23503';
function isPgError(err) {
    return typeof err === 'object' && err !== null && 'code' in err;
}
function toCategory(row) {
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
async function create(data) {
    try {
        const result = await (0, pool_1.query)(`INSERT INTO category (id, slug, label, icon, prefix, anchor)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, slug, label, icon, prefix, anchor, created_at, updated_at`, [data.slug, data.slug, data.label, data.icon ?? null, data.prefix, data.anchor]);
        return toCategory(result.rows[0]);
    }
    catch (err) {
        if (isPgError(err) && err.code === PG_UNIQUE_VIOLATION) {
            throw new errors_1.ConflictError(`Já existe uma categoria com o slug "${data.slug}".`);
        }
        throw err;
    }
}
async function findAll() {
    const result = await (0, pool_1.query)(`SELECT id, slug, label, icon, prefix, anchor, created_at, updated_at
     FROM category
     ORDER BY label ASC`);
    return result.rows.map(toCategory);
}
async function findById(id) {
    const result = await (0, pool_1.query)(`SELECT id, slug, label, icon, prefix, anchor, created_at, updated_at
     FROM category
     WHERE id = $1`, [id]);
    const row = result.rows[0];
    return row ? toCategory(row) : null;
}
async function findBySlug(slug) {
    const result = await (0, pool_1.query)(`SELECT id, slug, label, icon, prefix, anchor, created_at, updated_at
     FROM category
     WHERE slug = $1`, [slug]);
    const row = result.rows[0];
    return row ? toCategory(row) : null;
}
async function update(id, data) {
    const fields = [];
    const values = [];
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
    const result = await (0, pool_1.query)(`UPDATE category
     SET ${fields.join(', ')}
     WHERE id = $${paramIndex}
     RETURNING id, slug, label, icon, prefix, anchor, created_at, updated_at`, values);
    const row = result.rows[0];
    return row ? toCategory(row) : null;
}
async function remove(id) {
    try {
        const result = await (0, pool_1.query)('DELETE FROM category WHERE id = $1', [id]);
        return (result.rowCount ?? 0) > 0;
    }
    catch (err) {
        if (isPgError(err) && err.code === PG_FOREIGN_KEY_VIOLATION) {
            throw new errors_1.ConflictError('Não é possível remover esta categoria: existem produtos associados a ela.');
        }
        throw err;
    }
}
exports.categoryRepository = {
    create,
    findAll,
    findById,
    findBySlug,
    update,
    remove,
};
//# sourceMappingURL=category.repository.js.map