"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const asyncHandler_1 = require("../middlewares/asyncHandler");
const password_util_1 = require("../utils/password.util");
const user_repository_1 = require("../repositories/user.repository");
const errors_1 = require("../errors");
const zod_1 = require("zod");
const createAdminSchema = zod_1.z.object({
    email: zod_1.z.email().trim().toLowerCase().max(255),
    password: zod_1.z.string().min(8, 'password deve ter no mínimo 8 caracteres.'),
    fullName: zod_1.z.string().trim().min(3, 'fullName deve ter no mínimo 3 caracteres.').max(150),
});
const createInitialAdmin = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { email, password, fullName } = createAdminSchema.parse(req.body);
    const existing = await user_repository_1.userRepository.findByEmail(email);
    if (existing) {
        throw new errors_1.ConflictError('Já existe um usuário com este email.');
    }
    const passwordHash = await (0, password_util_1.hashPassword)(password);
    const admin = await user_repository_1.userRepository.create({
        fullName,
        email,
        passwordHash,
        phone: '',
        role: 'admin',
    });
    res.status(201).json({
        status: 'success',
        message: 'Admin criado com sucesso.',
        data: {
            id: admin.id,
            email: admin.email,
            fullName: admin.fullName,
        },
    });
});
const router = (0, express_1.Router)();
/**
 * @openapi
 * /api/seed/init:
 *   post:
 *     tags: [Seed]
 *     summary: Cria o admin inicial (rota pública para setup)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - fullName
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               fullName:
 *                 type: string
 *     responses:
 *       201:
 *         description: Admin criado com sucesso.
 *       409:
 *         description: Já existe um usuário com este email.
 *       422:
 *         description: Dados inválidos.
 */
router.post('/seed/init', createInitialAdmin);
exports.default = router;
//# sourceMappingURL=seed.routes.js.map