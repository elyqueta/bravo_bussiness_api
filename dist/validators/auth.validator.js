"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshSchema = exports.loginSchema = void 0;
const zod_1 = require("zod");
const emailSchema = zod_1.z
    .email('email deve ser um endereço válido.')
    .trim()
    .toLowerCase()
    .max(255, 'email deve ter no máximo 255 caracteres.');
const passwordSchema = zod_1.z
    .string({ error: 'password é obrigatória e deve ser texto.' })
    .min(1, 'password não pode ser vazia.');
const refreshTokenSchema = zod_1.z
    .string({ error: 'refreshToken é obrigatório.' })
    .min(1, 'refreshToken não pode ser vazio.');
exports.loginSchema = zod_1.z.object({
    email: emailSchema,
    password: passwordSchema,
});
exports.refreshSchema = zod_1.z.object({
    refreshToken: refreshTokenSchema,
});
//# sourceMappingURL=auth.validator.js.map