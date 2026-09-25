import { z } from 'zod';

const nameSchema = z
  .string({ error: 'name é obrigatório e deve ser texto.' })
  .trim()
  .min(1, 'name não pode ser vazio.')
  .max(200, 'name deve ter no máximo 200 caracteres.');

const descriptionSchema = z
  .string()
  .trim()
  .max(5000, 'description deve ter no máximo 5000 caracteres.');

const badgeSchema = z.enum(['Sale', 'Premium', 'Novo']);

const priceSchema = z
  .coerce
  .number({ error: 'price é obrigatório e deve ser um número.' })
  .positive('price deve ser maior que zero.');

const oldPriceSchema = z
  .coerce
  .number({ error: 'oldPrice deve ser um número.' })
  .positive('oldPrice deve ser maior que zero.');

const categorySlugSchema = z.string().trim().min(1, 'categorySlug é obrigatório.');

const featuresSchema = z.array(z.string().trim()).max(50, 'features deve ter no máximo 50 itens.');

function validatePriceConsistency(
  data: { price: number; oldPrice?: number | null },
  ctx: z.RefinementCtx
): void {
  if (
    data.oldPrice !== undefined &&
    data.oldPrice !== null &&
    data.oldPrice <= data.price
  ) {
    ctx.addIssue({
      code: 'custom',
      path: ['oldPrice'],
      message: 'oldPrice deve ser maior que price (senão não representa um desconto).',
    });
  }
}

export const createProductSchema = z
  .object({
    categorySlug: categorySlugSchema,
    name: nameSchema,
    description: descriptionSchema.optional(),
    price: priceSchema,
    oldPrice: oldPriceSchema.optional(),
    badge: badgeSchema.optional(),
    features: featuresSchema.optional(),
  })
  .superRefine(validatePriceConsistency);

export const updateProductSchema = z
  .object({
    categorySlug: categorySlugSchema.optional(),
    name: nameSchema.optional(),
    description: descriptionSchema.nullable().optional(),
    price: priceSchema.optional(),
    oldPrice: oldPriceSchema.nullable().optional(),
    badge: badgeSchema.nullable().optional(),
    features: featuresSchema.nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Pelo menos um campo deve ser enviado para atualização.',
  })
  .superRefine((data, ctx) => {
    if (
      data.price !== undefined &&
      data.oldPrice !== undefined &&
      data.oldPrice !== null
    ) {
      validatePriceConsistency({ price: data.price, oldPrice: data.oldPrice }, ctx);
    }
  });

export const productIdParamSchema = z.object({
  id: z.string().regex(/^BB-[A-Za-z]\d{3}$/, 'id deve seguir o formato BB-{prefix}{seq}, ex: BB-R001.'),
});

export const listProductsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100, 'limit máximo é 100.').default(20),
  categorySlug: z.string().trim().min(1).optional(),
  badge: badgeSchema.optional(),
  search: z.string().trim().max(100).optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductIdParam = z.infer<typeof productIdParamSchema>;
export type ListProductsQuery = z.infer<typeof listProductsQuerySchema>;
