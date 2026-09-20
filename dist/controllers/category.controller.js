"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryController = void 0;
const asyncHandler_1 = require("../middlewares/asyncHandler");
const category_service_1 = require("../services/category.service");
const create = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const category = await category_service_1.categoryService.create(req.body);
    res.status(201).json({
        status: 'success',
        data: category,
    });
});
const findAll = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    const categories = await category_service_1.categoryService.findAll();
    res.status(200).json({
        status: 'success',
        data: categories,
        count: categories.length,
    });
});
const findById = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const category = await category_service_1.categoryService.findById(req.params.id);
    res.status(200).json({
        status: 'success',
        data: category,
    });
});
const update = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const category = await category_service_1.categoryService.update(req.params.id, req.body);
    res.status(200).json({
        status: 'success',
        data: category,
    });
});
const remove = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    await category_service_1.categoryService.remove(req.params.id);
    res.status(204).send();
});
exports.categoryController = {
    create,
    findAll,
    findById,
    update,
    remove,
};
//# sourceMappingURL=category.controller.js.map