import { z } from 'zod';

const labelSchema = z
  .string({ error: 'label é obrigatório e deve ser texto.' })
  .trim()
  .min(1, 'label não pode ser vazio.')
  .max(100, 'label deve ter no máximo 100 caracteres.');

const iconSchema = z
  .string()
  .trim()
  .min(3, 'icon deve ter pelo menos 3 caracteres.')
  .max(30, 'icon deve ter no máximo 30 caracteres.');

const prefixSchema = z
  .string()
  .trim()
  .length(1, 'prefix deve ter exatamente 1 caractere.')
  .regex(/[A-Za-z]/, 'prefix deve ser uma letra.');

const anchorSchema = z
  .string()
  .trim()
  .min(1, 'anchor não pode ser vazio.')
  .max(50, 'anchor deve ter no máximo 50 caracteres.');

export const createCategorySchema = z.object({
  label: labelSchema,
  icon: iconSchema.optional(),
  prefix: prefixSchema,
  anchor: anchorSchema,
});

export const updateCategorySchema = z
  .object({
    label: labelSchema.optional(),
    icon: iconSchema.nullable().optional(),
    prefix: prefixSchema.optional(),
    anchor: anchorSchema.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Pelo menos um campo deve ser enviado para atualização.',
  });

export const categoryIdParamSchema = z.object({
  id: z.string().min(1, 'id é obrigatório.'),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type CategoryIdParam = z.infer<typeof categoryIdParamSchema>;
