"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productController = void 0;
const asyncHandler_1 = require("../middlewares/asyncHandler");
const product_service_1 = require("../services/product.service");
const errors_1 = require("../errors");
const create = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const files = req.files;
    const imageFile = files.img?.[0];
    if (!imageFile) {
        throw new errors_1.BadRequestError('Arquivo de imagem obrigatório.');
    }
    const galleryFiles = files['gallery[]'] ?? [];
    const product = await product_service_1.productService.create(req.body, imageFile, galleryFiles);
    res.status(201).json({
        status: 'success',
        data: product,
    });
});
const findAll = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { page, limit, categorySlug, badge, search } = req.query;
    const result = await product_service_1.productService.findAll({ categorySlug, badge, search }, { page, limit });
    res.status(200).json({
        status: 'success',
        data: result.data,
        pagination: {
            page: result.page,
            limit: result.limit,
            total: result.total,
            totalPages: result.totalPages,
        },
    });
});
const findById = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const product = await product_service_1.productService.findById(req.params.id);
    res.status(200).json({
        status: 'success',
        data: product,
    });
});
const update = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const files = req.files;
    const imageFile = files.img?.[0];
    const galleryFiles = files['gallery[]'] ?? [];
    const product = await product_service_1.productService.update(req.params.id, req.body, imageFile, galleryFiles);
    res.status(200).json({
        status: 'success',
        data: product,
    });
});
const remove = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    await product_service_1.productService.remove(req.params.id);
    res.status(204).send();
});
exports.productController = {
    create,
    findAll,
    findById,
    update,
    remove,
};
//# sourceMappingURL=product.controller.js.map