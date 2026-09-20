import { z } from 'zod';

if (process.env.NODE_ENV !== 'production') {
  void import('dotenv/config');
}

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  PORT: z.coerce.number({ error: 'PORT deve ser um número' }).int().positive().default(3000),

  DATABASE_URL: z
    .string({ error: 'DATABASE_URL é obrigatória' })
    .min(1, 'DATABASE_URL não pode ser vazia')
    .url('DATABASE_URL deve ser uma URL de conexão válida'),

  CORS_ORIGIN: z
    .string({ error: 'CORS_ORIGIN é obrigatória' })
    .min(1, 'CORS_ORIGIN não pode ser vazia'),

  RATE_LIMIT_WINDOW_MS: z.coerce
    .number({ error: 'RATE_LIMIT_WINDOW_MS deve ser um número' })
    .int()
    .positive()
    .default(900000),

  RATE_LIMIT_MAX: z.coerce
    .number({ error: 'RATE_LIMIT_MAX deve ser um número' })
    .int()
    .positive()
    .default(100),

  JWT_SECRET: z
    .string({ error: 'JWT_SECRET é obrigatória' })
    .min(32, 'JWT_SECRET deve ter no mínimo 32 caracteres.'),

  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),

  BCRYPT_SALT_ROUNDS: z.coerce
    .number({ error: 'BCRYPT_SALT_ROUNDS deve ser um número' })
    .int()
    .min(10, 'BCRYPT_SALT_ROUNDS deve ser no mínimo 10 por segurança.')
    .max(15, 'BCRYPT_SALT_ROUNDS acima de 15 é impraticavelmente lento.')
    .default(12),

  CLOUDINARY_CLOUD_NAME: z
    .string({ error: 'CLOUDINARY_CLOUD_NAME é obrigatória' })
    .min(1, 'CLOUDINARY_CLOUD_NAME não pode ser vazia'),

  CLOUDINARY_API_KEY: z
    .string({ error: 'CLOUDINARY_API_KEY é obrigatória' })
    .min(1, 'CLOUDINARY_API_KEY não pode ser vazia'),

  CLOUDINARY_API_SECRET: z
    .string({ error: 'CLOUDINARY_API_SECRET é obrigatória' })
    .min(1, 'CLOUDINARY_API_SECRET não pode ser vazia'),
});

export type Env = z.infer<typeof envSchema>;

function loadEnv(): Env {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error('\nErro na configuração de variáveis de ambiente:\n');

    for (const issue of result.error.issues) {
      const campo = issue.path.join('.') || '(desconhecido)';
      console.error(`  • ${campo}: ${issue.message}`);
    }

    console.error(
      '\nVerifique as variáveis de ambiente e tente novamente.\n'
    );

    process.exit(1);
  }

  return result.data;
}

export const env = loadEnv();
