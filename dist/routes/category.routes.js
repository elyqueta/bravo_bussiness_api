"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const category_controller_1 = require("../controllers/category.controller");
const validate_1 = require("../middlewares/validate");
const authenticate_1 = require("../middlewares/authenticate");
const requireAdmin_1 = require("../middlewares/requireAdmin");
const category_validator_1 = require("../validators/category.validator");
const router = (0, express_1.Router)();
/**
 * @openapi
 * tags:
 *   name: Categories
 *   description: Gestão de categorias de produtos
 */
/**
 * @openapi
 * /api/categories:
 *   post:
 *     tags: [Categories]
 *     summary: Cria uma nova categoria (admin)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCategoryInput'
 *     responses:
 *       201:
 *         description: Categoria criada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 data: { $ref: '#/components/schemas/Category' }
 *       401:
 *         description: Token de acesso ausente, inválido ou expirado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Apenas administradores podem criar categorias.
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
 */
router.post('/', authenticate_1.authenticate, requireAdmin_1.requireAdmin, (0, validate_1.validate)({ body: category_validator_1.createCategorySchema }), category_controller_1.categoryController.create);
/**
 * @openapi
 * /api/categories:
 *   get:
 *     tags: [Categories]
 *     summary: Lista todas as categorias, ordenadas por label
 *     responses:
 *       200:
 *         description: Lista de categorias.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 count: { type: integer, example: 3 }
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Category' }
 */
router.get('/', category_controller_1.categoryController.findAll);
/**
 * @openapi
 * /api/categories/{id}:
 *   get:
 *     tags: [Categories]
 *     summary: Busca uma categoria pelo id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Categoria encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 data: { $ref: '#/components/schemas/Category' }
 *       404:
 *         description: Categoria não encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', (0, validate_1.validate)({ params: category_validator_1.categoryIdParamSchema }), category_controller_1.categoryController.findById);
/**
 * @openapi
 * /api/categories/{id}:
 *   patch:
 *     tags: [Categories]
 *     summary: Atualiza parcialmente uma categoria (admin)
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
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCategoryInput'
 *     responses:
 *       200:
 *         description: Categoria atualizada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 data: { $ref: '#/components/schemas/Category' }
 *       401:
 *         description: Token de acesso ausente, inválido ou expirado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Apenas administradores podem atualizar categorias.
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
 *         description: Dados inválidos ou payload vazio.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch('/:id', authenticate_1.authenticate, requireAdmin_1.requireAdmin, (0, validate_1.validate)({ params: category_validator_1.categoryIdParamSchema, body: category_validator_1.updateCategorySchema }), category_controller_1.categoryController.update);
/**
 * @openapi
 * /api/categories/{id}:
 *   delete:
 *     tags: [Categories]
 *     summary: Remove uma categoria (admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: Categoria removida com sucesso (sem conteúdo).
 *       401:
 *         description: Token de acesso ausente, inválido ou expirado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Apenas administradores podem remover categorias.
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
 *       409:
 *         description: Categoria possui produtos associados.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/:id', authenticate_1.authenticate, requireAdmin_1.requireAdmin, (0, validate_1.validate)({ params: category_validator_1.categoryIdParamSchema }), category_controller_1.categoryController.remove);
exports.default = router;
//# sourceMappingURL=category.routes.js.map