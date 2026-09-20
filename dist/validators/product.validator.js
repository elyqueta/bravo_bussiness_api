"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listProductsQuerySchema = exports.productIdParamSchema = exports.updateProductSchema = exports.createProductSchema = void 0;
const zod_1 = require("zod");
const nameSchema = zod_1.z
    .string({ error: 'name é obrigatório e deve ser texto.' })
    .trim()
    .min(1, 'name não pode ser vazio.')
    .max(200, 'name deve ter no máximo 200 caracteres.');
const descriptionSchema = zod_1.z
    .string()
    .trim()
    .max(5000, 'description deve ter no máximo 5000 caracteres.');
const badgeSchema = zod_1.z.enum(['Sale', 'Premium', 'Novo']);
const priceSchema = zod_1.z
    .coerce
    .number({ error: 'price é obrigatório e deve ser um número.' })
    .int('price deve ser um número inteiro (Kz).')
    .positive('price deve ser maior que zero.');
const oldPriceSchema = zod_1.z
    .coerce
    .number({ error: 'oldPrice deve ser um número.' })
    .int('oldPrice deve ser um número inteiro (Kz).')
    .positive('oldPrice deve ser maior que zero.');
const categorySlugSchema = zod_1.z.string().trim().min(1, 'categorySlug é obrigatório.');
const featuresSchema = zod_1.z.array(zod_1.z.string().trim()).max(50, 'features deve ter no máximo 50 itens.');
function validatePriceConsistency(data, ctx) {
    if (data.oldPrice !== undefined &&
        data.oldPrice !== null &&
        data.oldPrice <= data.price) {
        ctx.addIssue({
            code: 'custom',
            path: ['oldPrice'],
            message: 'oldPrice deve ser maior que price (senão não representa um desconto).',
        });
    }
}
exports.createProductSchema = zod_1.z
    .object({
    categorySlug: categorySlugSchema,
    name: nameSchema,
    description: descriptionSchema.optional(),
    price: priceSchema,
    oldPrice: oldPriceSchema.optional(),
    badge: badgeSchema.optional(),
    features: featuresSchema.optional(),
})
    .strict()
    .superRefine(validatePriceConsistency);
exports.updateProductSchema = zod_1.z
    .object({
    categorySlug: categorySlugSchema.optional(),
    name: nameSchema.optional(),
    description: descriptionSchema.nullable().optional(),
    price: priceSchema.optional(),
    oldPrice: oldPriceSchema.nullable().optional(),
    badge: badgeSchema.nullable().optional(),
    features: featuresSchema.nullable().optional(),
})
    .strict()
    .refine((data) => Object.keys(data).length > 0, {
    message: 'Pelo menos um campo deve ser enviado para atualização.',
})
    .superRefine((data, ctx) => {
    if (data.price !== undefined &&
        data.oldPrice !== undefined &&
        data.oldPrice !== null) {
        validatePriceConsistency({ price: data.price, oldPrice: data.oldPrice }, ctx);
    }
});
exports.productIdParamSchema = zod_1.z.object({
    id: zod_1.z.string().regex(/^BB-[A-Za-z]\d{3}$/, 'id deve seguir o formato BB-{prefix}{seq}, ex: BB-R001.'),
});
exports.listProductsQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().positive().default(1),
    limit: zod_1.z.coerce.number().int().positive().max(100, 'limit máximo é 100.').default(20),
    categorySlug: zod_1.z.string().trim().min(1).optional(),
    badge: badgeSchema.optional(),
    search: zod_1.z.string().trim().max(100).optional(),
});
//# sourceMappingURL=product.validator.js.map