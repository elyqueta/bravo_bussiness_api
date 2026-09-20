"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = require("../controllers/product.controller");
const validate_1 = require("../middlewares/validate");
const authenticate_1 = require("../middlewares/authenticate");
const requireAdmin_1 = require("../middlewares/requireAdmin");
const upload_1 = require("../middlewares/upload");
const product_validator_1 = require("../validators/product.validator");
const router = (0, express_1.Router)();
router.post('/', authenticate_1.authenticate, requireAdmin_1.requireAdmin, (0, upload_1.uploadProductImages)(), (0, validate_1.validate)({ body: product_validator_1.createProductSchema }), product_controller_1.productController.create);
router.get('/', (0, validate_1.validate)({ query: product_validator_1.listProductsQuerySchema }), product_controller_1.productController.findAll);
router.get('/:id', (0, validate_1.validate)({ params: product_validator_1.productIdParamSchema }), product_controller_1.productController.findById);
router.patch('/:id', authenticate_1.authenticate, requireAdmin_1.requireAdmin, (0, upload_1.uploadProductImages)(), (0, validate_1.validate)({ params: product_validator_1.productIdParamSchema, body: product_validator_1.updateProductSchema }), product_controller_1.productController.update);
router.delete('/:id', authenticate_1.authenticate, requireAdmin_1.requireAdmin, (0, validate_1.validate)({ params: product_validator_1.productIdParamSchema }), product_controller_1.productController.remove);
exports.default = router;
//# sourceMappingURL=product.routes.js.map