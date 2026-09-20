"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedCategories = seedCategories;
exports.seedProducts = seedProducts;
const category_repository_1 = require("../../repositories/category.repository");
const product_repository_1 = require("../../repositories/product.repository");
const pool_1 = require("../../database/pool");
const data_1 = require("./data");
async function seedCategories() {
    const labelToId = new Map();
    for (const category of data_1.SEED_CATEGORIES) {
        const existing = await (0, pool_1.query)('SELECT id FROM category WHERE slug = $1', [
            category.label.toLowerCase().replace(/\s+/g, '-'),
        ]);
        if (existing.rows[0]) {
            console.warn(`Categoria "${category.label}" já existe (id: ${existing.rows[0].id}). Nada a fazer.`);
            labelToId.set(category.label, existing.rows[0].id);
            continue;
        }
        const slug = category.label.toLowerCase().replace(/\s+/g, '-');
        const created = await category_repository_1.categoryRepository.create({
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
async function seedProducts(categoryLabels) {
    for (const product of data_1.SEED_PRODUCTS) {
        const categoryId = categoryLabels.get(product.categoryLabel);
        if (!categoryId) {
            console.error(`Categoria "${product.categoryLabel}" não encontrada para o produto "${product.name}".`);
            continue;
        }
        const category = await category_repository_1.categoryRepository.findById(categoryId);
        if (!category) {
            console.error(`Categoria com id "${categoryId}" não encontrada.`);
            continue;
        }
        const existing = await (0, pool_1.query)('SELECT id FROM product WHERE name = $1', [
            product.name,
        ]);
        if (existing.rows[0]) {
            console.warn(`Produto "${product.name}" já existe (id: ${existing.rows[0].id}). Nada a fazer.`);
            continue;
        }
        const countResult = await (0, pool_1.query)('SELECT COUNT(*)::text AS count FROM product WHERE category_slug = $1', [category.slug]);
        const nextSeq = Number(countResult.rows[0]?.count ?? 0) + 1;
        const productId = `BB-${category.prefix}${String(nextSeq).padStart(3, '0')}`;
        const created = await product_repository_1.productRepository.create({
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
//# sourceMappingURL=seedCatalog.js.map