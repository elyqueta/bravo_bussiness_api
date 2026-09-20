"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryService = void 0;
const category_repository_1 = require("../repositories/category.repository");
const slug_util_1 = require("../utils/slug.util");
const errors_1 = require("../errors");
async function create(input) {
    const slug = (0, slug_util_1.generateSlug)(input.label);
    return category_repository_1.categoryRepository.create({
        slug,
        label: input.label,
        icon: input.icon ?? null,
        prefix: input.prefix,
        anchor: input.anchor,
    });
}
async function findAll() {
    return category_repository_1.categoryRepository.findAll();
}
async function findById(id) {
    const category = await category_repository_1.categoryRepository.findById(id);
    if (!category) {
        throw new errors_1.NotFoundError(`Categoria com id "${id}" não encontrada.`);
    }
    return category;
}
async function findBySlug(slug) {
    const category = await category_repository_1.categoryRepository.findBySlug(slug);
    if (!category) {
        throw new errors_1.NotFoundError(`Categoria com slug "${slug}" não encontrada.`);
    }
    return category;
}
async function update(id, input) {
    const updated = await category_repository_1.categoryRepository.update(id, input);
    if (!updated) {
        throw new errors_1.NotFoundError(`Categoria com id "${id}" não encontrada.`);
    }
    return updated;
}
async function remove(id) {
    const deleted = await category_repository_1.categoryRepository.remove(id);
    if (!deleted) {
        throw new errors_1.NotFoundError(`Categoria com id "${id}" não encontrada.`);
    }
}
exports.categoryService = {
    create,
    findAll,
    findById,
    findBySlug,
    update,
    remove,
};
//# sourceMappingURL=category.service.js.map