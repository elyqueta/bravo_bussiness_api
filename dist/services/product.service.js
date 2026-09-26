"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productService = void 0;
const product_repository_1 = require("../repositories/product.repository");
const category_service_1 = require("./category.service");
const errors_1 = require("../errors");
const cloudinary_1 = require("../utils/cloudinary");
const upload_1 = require("../middlewares/upload");
async function create(input, imageFile, galleryFiles = []) {
    await (0, upload_1.validateImageMagicBytes)(imageFile);
    for (const file of galleryFiles) {
        await (0, upload_1.validateImageMagicBytes)(file);
    }
    const category = await category_service_1.categoryService.findBySlug(input.categorySlug);
    const countResult = await product_repository_1.productRepository.findAll({ categorySlug: category.slug }, { page: 1, limit: 1 });
    let nextSeq = countResult.total + 1;
    const maxRetries = 10;
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        const productId = `BB-${category.prefix}${String(nextSeq).padStart(3, '0')}`;
        const { url: img } = await (0, cloudinary_1.uploadImage)(imageFile);
        const gallery = [];
        for (const file of galleryFiles) {
            const { url } = await (0, cloudinary_1.uploadImage)(file);
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
    const existing = await product_repository_1.productRepository.findById(id);
    if (!existing) {
        throw new errors_1.NotFoundError(`Produto com id "${id}" não encontrado.`);
    }
    const updateData = { ...input };
    if (imageFile) {
        await (0, upload_1.validateImageMagicBytes)(imageFile);
        updateData.img = (await (0, cloudinary_1.uploadImage)(imageFile)).url;
    }
    if (galleryFiles && galleryFiles.length > 0) {
        for (const file of galleryFiles) {
            await (0, upload_1.validateImageMagicBytes)(file);
        }
        const gallery = [];
        for (const file of galleryFiles) {
            const { url } = await (0, cloudinary_1.uploadImage)(file);
            gallery.push(url);
        }
        updateData.gallery = gallery;
    }
    const updated = await product_repository_1.productRepository.update(id, updateData);
    if (!updated) {
        throw new errors_1.NotFoundError(`Produto com id "${id}" não encontrado.`);
    }
    if (imageFile && existing.img) {
        await (0, cloudinary_1.deleteImage)(existing.img);
    }
    if (galleryFiles && galleryFiles.length > 0 && existing.gallery.length > 0) {
        await Promise.all(existing.gallery.map((url) => (0, cloudinary_1.deleteImage)(url)));
    }
    return updated;
}
async function remove(id) {
    const existing = await product_repository_1.productRepository.findById(id);
    if (!existing) {
        throw new errors_1.NotFoundError(`Produto com id "${id}" não encontrado.`);
    }
    const deleted = await product_repository_1.productRepository.remove(id);
    if (!deleted) {
        throw new errors_1.NotFoundError(`Produto com id "${id}" não encontrado.`);
    }
    const imagesToDelete = [existing.img, ...existing.gallery].filter(Boolean);
    await Promise.all(imagesToDelete.map((url) => (0, cloudinary_1.deleteImage)(url)));
}
exports.productService = {
    create,
    findAll,
    findById,
    update,
    remove,
};
//# sourceMappingURL=product.service.js.map