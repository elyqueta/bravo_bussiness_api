import { z } from 'zod';

const emailSchema = z
  .email('email deve ser um endereço válido.')
  .trim()
  .toLowerCase()
  .max(255, 'email deve ter no máximo 255 caracteres.');

const passwordSchema = z
  .string({ error: 'password é obrigatória e deve ser texto.' })
  .min(1, 'password não pode ser vazia.');

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type LoginInput = z.infer<typeof loginSchema>;
