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
/**
 * @openapi
 * tags:
 *   name: Products
 *   description: Gestão de produtos
 */
/**
 * @openapi
 * /api/v1/products:
 *   post:
 *     tags: [Products]
 *     summary: Cria um novo produto (admin)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               categorySlug: { type: string, example: roupas }
 *               name: { type: string, example: Camiseta Básica }
 *               description: { type: string, example: Camiseta 100% algodão }
  *               price: { type: number, example: 14500.00 }
  *               oldPrice: { type: number, example: 18000.00 }
 *               img: { type: string, format: binary }
 *               badge: { type: string, enum: [Sale, Premium, Novo] }
 *               features: { type: array, items: { type: string } }
 *               gallery: { type: array, items: { type: string, format: binary } }
 *     responses:
 *       201:
 *         description: Produto criado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 data: { $ref: '#/components/schemas/Product' }
 *       400:
 *         description: Arquivo de imagem obrigatório.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Token de acesso ausente, inválido ou expirado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Apenas administradores podem criar produtos.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Categoria não encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       422:
 *         description: Dados inválidos.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Erro no processamento de imagens ou salvamento.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', authenticate_1.authenticate, requireAdmin_1.requireAdmin, (0, upload_1.uploadProductImages)(), (0, validate_1.validate)({ body: product_validator_1.createProductSchema }), product_controller_1.productController.create);
/**
 * @openapi
 * /api/v1/products:
 *   get:
 *     tags: [Products]
 *     summary: Lista produtos com filtros e paginação
 *     parameters:
 *       - in: query
 *         name: categorySlug
 *         required: false
 *         schema: { type: string }
 *       - in: query
 *         name: badge
 *         required: false
 *         schema: { type: string, enum: [Sale, Premium, Novo] }
 *       - in: query
 *         name: search
 *         required: false
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         required: false
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         required: false
 *         schema: { type: integer, default: 20 }
 *     responses:
 *       200:
 *         description: Lista de produtos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 pagination: { $ref: '#/components/schemas/Pagination' }
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Product' }
 *       422:
 *         description: Parâmetros inválidos.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', (0, validate_1.validate)({ query: product_validator_1.listProductsQuerySchema }), product_controller_1.productController.findAll);
/**
 * @openapi
 * /api/v1/products/{id}:
 *   get:
 *     tags: [Products]
 *     summary: Busca um produto pelo id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Produto encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 data: { $ref: '#/components/schemas/Product' }
 *       404:
 *         description: Produto não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       422:
 *         description: ID inválido.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', (0, validate_1.validate)({ params: product_validator_1.productIdParamSchema }), product_controller_1.productController.findById);
/**
 * @openapi
 * /api/v1/products/{id}:
 *   patch:
 *     tags: [Products]
 *     summary: Atualiza parcialmente um produto (admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               categorySlug: { type: string, example: roupas }
 *               name: { type: string, example: Camiseta Básica }
 *               description: { type: string }
  *               price: { type: number, example: 14500.00 }
  *               oldPrice: { type: number, example: 18000.00 }
 *               img: { type: string, format: binary }
 *               badge: { type: string, enum: [Sale, Premium, Novo] }
 *               features: { type: array, items: { type: string } }
 *               gallery: { type: array, items: { type: string, format: binary } }
 *     responses:
 *       200:
 *         description: Produto atualizado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 data: { $ref: '#/components/schemas/Product' }
 *       400:
 *         description: Arquivo de imagem obrigatório, quando enviado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Token de acesso ausente, inválido ou expirado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Apenas administradores podem atualizar produtos.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Produto ou categoria não encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       422:
 *         description: Dados inválidos ou payload vazio.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Erro no processamento de imagens ou salvamento.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch('/:id', authenticate_1.authenticate, requireAdmin_1.requireAdmin, (0, upload_1.uploadProductImages)(), (0, validate_1.validate)({ params: product_validator_1.productIdParamSchema, body: product_validator_1.updateProductSchema }), product_controller_1.productController.update);
/**
 * @openapi
 * /api/v1/products/{id}:
 *   delete:
 *     tags: [Products]
 *     summary: Remove um produto (admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: Produto removido com sucesso (sem conteúdo).
 *       401:
 *         description: Token de acesso ausente, inválido ou expirado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Apenas administradores podem remover produtos.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Produto não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Erro ao remover produto ou imagens associadas.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/:id', authenticate_1.authenticate, requireAdmin_1.requireAdmin, (0, validate_1.validate)({ params: product_validator_1.productIdParamSchema }), product_controller_1.productController.remove);
exports.default = router;
//# sourceMappingURL=product.routes.js.map