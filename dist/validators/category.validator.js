"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryIdParamSchema = exports.updateCategorySchema = exports.createCategorySchema = void 0;
const zod_1 = require("zod");
const labelSchema = zod_1.z
    .string({ error: 'label é obrigatório e deve ser texto.' })
    .trim()
    .min(1, 'label não pode ser vazio.')
    .max(100, 'label deve ter no máximo 100 caracteres.');
const iconSchema = zod_1.z
    .string()
    .trim()
    .min(3, 'icon deve ter pelo menos 3 caracteres.')
    .max(30, 'icon deve ter no máximo 30 caracteres.');
const prefixSchema = zod_1.z
    .string()
    .trim()
    .length(1, 'prefix deve ter exatamente 1 caractere.')
    .regex(/[A-Za-z]/, 'prefix deve ser uma letra.');
const anchorSchema = zod_1.z
    .string()
    .trim()
    .min(1, 'anchor não pode ser vazio.')
    .max(50, 'anchor deve ter no máximo 50 caracteres.');
exports.createCategorySchema = zod_1.z.object({
    label: labelSchema,
    icon: iconSchema.optional(),
    prefix: prefixSchema,
    anchor: anchorSchema,
});
exports.updateCategorySchema = zod_1.z
    .object({
    label: labelSchema.optional(),
    icon: iconSchema.nullable().optional(),
    prefix: prefixSchema.optional(),
    anchor: anchorSchema.optional(),
})
    .refine((data) => Object.keys(data).length > 0, {
    message: 'Pelo menos um campo deve ser enviado para atualização.',
});
exports.categoryIdParamSchema = zod_1.z.object({
    id: zod_1.z.string().min(1, 'id é obrigatório.'),
});
//# sourceMappingURL=category.validator.js.map