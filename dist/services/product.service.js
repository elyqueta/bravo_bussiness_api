"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productService = void 0;
const product_repository_1 = require("../repositories/product.repository");
const category_service_1 = require("./category.service");
const errors_1 = require("../errors");
const cloudinary_1 = require("../utils/cloudinary");
async function create(input, imageFile, galleryFiles = []) {
    const category = await category_service_1.categoryService.findBySlug(input.categorySlug);
    const countResult = await product_repository_1.productRepository.findAll({ categorySlug: category.slug }, { page: 1, limit: 1 });
    let nextSeq = countResult.total + 1;
    const maxRetries = 10;
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        const productId = `BB-${category.prefix}${String(nextSeq).padStart(3, '0')}`;
        const img = await (0, cloudinary_1.uploadImage)(imageFile);
        const gallery = [];
        for (const file of galleryFiles) {
            const url = await (0, cloudinary_1.uploadImage)(file);
            gallery.push(url);
        }
        const data = {
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
            return await product_repository_1.productRepository.create(data);
        }
        catch (err) {
            const isUniqueViolation = typeof err === 'object' &&
                err !== null &&
                'code' in err &&
                err.code === '23505';
            if (!isUniqueViolation) {
                throw err;
            }
            nextSeq += 1;
        }
    }
    throw new errors_1.ConflictError('Não foi possível gerar um código de produto único após várias tentativas.');
}
async function findAll(filters, pagination) {
    return product_repository_1.productRepository.findAll(filters, pagination);
}
async function findById(id) {
    const product = await product_repository_1.productRepository.findById(id);
    if (!product) {
        throw new errors_1.NotFoundError(`Produto com id "${id}" não encontrado.`);
    }
    return product;
}
async function update(id, input, imageFile, galleryFiles) {
    if (input.categorySlug !== undefined) {
        await category_service_1.categoryService.findBySlug(input.categorySlug);
    }
    const updateData = { ...input };
    if (imageFile) {
        updateData.img = await (0, cloudinary_1.uploadImage)(imageFile);
    }
    if (galleryFiles && galleryFiles.length > 0) {
        const gallery = [];
        for (const file of galleryFiles) {
            const url = await (0, cloudinary_1.uploadImage)(file);
            gallery.push(url);
        }
        updateData.gallery = gallery;
    }
    const updated = await product_repository_1.productRepository.update(id, updateData);
    if (!updated) {
        throw new errors_1.NotFoundError(`Produto com id "${id}" não encontrado.`);
    }
    return updated;
}
async function remove(id) {
    const deleted = await product_repository_1.productRepository.remove(id);
    if (!deleted) {
        throw new errors_1.NotFoundError(`Produto com id "${id}" não encontrado.`);
    }
}
exports.productService = {
    create,
    findAll,
    findById,
    update,
    remove,
};
//# sourceMappingURL=product.service.js.map