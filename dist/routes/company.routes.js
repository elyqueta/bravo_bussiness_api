"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const company_controller_1 = require("../controllers/company.controller");
const authenticate_1 = require("../middlewares/authenticate");
const validate_1 = require("../middlewares/validate");
const company_validator_1 = require("../validators/company.validator");
const userCompany_routes_1 = __importDefault(require("./userCompany.routes"));
const router = (0, express_1.Router)();
/**
 * @openapi
 * tags:
 *   name: Companies
 *   description: Gestão de contas empresariais (B2B)
 */
/**
 * Todas as rotas de empresa exigem autenticação: diferente de
 * CATEGORY (dado público de catálogo), COMPANY é informação de conta
 * — ninguém deve conseguir listar ou consultar empresas sem estar
 * autenticado.
 */
router.use(authenticate_1.authenticate);
/**
 * @openapi
 * /api/companies:
 *   post:
 *     tags: [Companies]
 *     summary: Regista uma nova empresa (conta B2B)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCompanyInput'
 *     responses:
 *       201:
 *         description: Empresa criada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 data: { $ref: '#/components/schemas/Company' }
 *       401:
 *         description: Não autenticado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Já existe uma empresa com este NIF.
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
router.post('/', (0, validate_1.validate)({ body: company_validator_1.createCompanySchema }), company_controller_1.companyController.create);
/**
 * @openapi
 * /api/companies:
 *   get:
 *     tags: [Companies]
 *     summary: Lista todas as empresas
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de empresas.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 count: { type: integer, example: 2 }
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Company' }
 */
router.get('/', company_controller_1.companyController.findAll);
/**
 * @openapi
 * /api/companies/{id}:
 *   get:
 *     tags: [Companies]
 *     summary: Busca uma empresa pelo id
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Empresa encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 data: { $ref: '#/components/schemas/Company' }
 *       404:
 *         description: Empresa não encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', (0, validate_1.validate)({ params: company_validator_1.companyIdParamSchema }), company_controller_1.companyController.findById);
/**
 * @openapi
 * /api/companies/{id}:
 *   patch:
 *     tags: [Companies]
 *     summary: Atualiza parcialmente uma empresa
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCompanyInput'
 *     responses:
 *       200:
 *         description: Empresa atualizada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 data: { $ref: '#/components/schemas/Company' }
 *       404:
 *         description: Empresa não encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: NIF já usado por outra empresa.
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
router.patch('/:id', (0, validate_1.validate)({ params: company_validator_1.companyIdParamSchema, body: company_validator_1.updateCompanySchema }), company_controller_1.companyController.update);
/**
 * @openapi
 * /api/companies/{id}:
 *   delete:
 *     tags: [Companies]
 *     summary: Desativa uma empresa (soft delete)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       204:
 *         description: Empresa desativada com sucesso (sem conteúdo).
 *       404:
 *         description: Empresa não encontrada ou já inactiva.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/:id', (0, validate_1.validate)({ params: company_validator_1.companyIdParamSchema }), company_controller_1.companyController.remove);
/**
 * Rotas aninhadas: /api/companies/:companyId/users/...
 * Gestão da associação N:N entre utilizadores e esta empresa.
 */
router.use('/:companyId/users', userCompany_routes_1.default);
exports.default = router;
//# sourceMappingURL=company.routes.js.map