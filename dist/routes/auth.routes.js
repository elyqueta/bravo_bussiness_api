"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const authLimiter_1 = require("../middlewares/authLimiter");
const validate_1 = require("../middlewares/validate");
const auth_validator_1 = require("../validators/auth.validator");
const router = (0, express_1.Router)();
/**
 * @openapi
 * tags:
 *   name: Auth
 *   description: Autenticação do administrador
 */
/**
 * @openapi
 * /api/v1/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Autentica o administrador e devolve os tokens de acesso e refresh
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Login efetuado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 data: { $ref: '#/components/schemas/AuthResult' }
 *       401:
 *         description: Credenciais inválidas ou conta inativa.
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
 *       429:
 *         description: Muitas tentativas de login.
 */
router.post('/login', authLimiter_1.authLimiter, (0, validate_1.validate)({ body: auth_validator_1.loginSchema }), ((req, res, next) => {
    void auth_controller_1.authController.login(req, res, next);
}));
/**
 * @openapi
 * /api/v1/auth/refresh:
 *   post:
 *     tags: [Auth]
 *     summary: Usa o refresh token para emitir um novo access token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: eyJhbGciOi...
 *     responses:
 *       200:
 *         description: Tokens renovados com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 data: { $ref: '#/components/schemas/AuthResult' }
 *       401:
 *         description: Refresh token inválido ou expirado.
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
router.post('/refresh', (0, validate_1.validate)({ body: auth_validator_1.refreshSchema }), ((req, res, next) => {
    void auth_controller_1.authController.refresh(req, res, next);
}));
exports.default = router;
//# sourceMappingURL=auth.routes.js.map