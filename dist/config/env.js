"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const zod_1 = require("zod");
const dotenv_1 = __importDefault(require("dotenv"));
if (process.env.NODE_ENV !== 'production') {
    dotenv_1.default.config();
}
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    PORT: zod_1.z.coerce.number({ error: 'PORT deve ser um número' }).int().positive().default(3000),
    DATABASE_URL: zod_1.z
        .string({ error: 'DATABASE_URL é obrigatória' })
        .min(1, 'DATABASE_URL não pode ser vazia')
        .url('DATABASE_URL deve ser uma URL de conexão válida'),
    CORS_ORIGIN: zod_1.z
        .string({ error: 'CORS_ORIGIN é obrigatória' })
        .min(1, 'CORS_ORIGIN não pode ser vazia'),
    RATE_LIMIT_WINDOW_MS: zod_1.z.coerce
        .number({ error: 'RATE_LIMIT_WINDOW_MS deve ser um número' })
        .int()
        .positive()
        .default(900000),
    RATE_LIMIT_MAX: zod_1.z.coerce
        .number({ error: 'RATE_LIMIT_MAX deve ser um número' })
        .int()
        .positive()
        .default(100),
    JWT_SECRET: zod_1.z
        .string({ error: 'JWT_SECRET é obrigatória' })
        .min(32, 'JWT_SECRET deve ter no mínimo 32 caracteres.'),
    JWT_ACCESS_EXPIRES_IN: zod_1.z.string().default('15m'),
    JWT_REFRESH_EXPIRES_IN: zod_1.z.coerce
        .number({ error: 'JWT_REFRESH_EXPIRES_IN deve ser um número' })
        .int()
        .positive()
        .default(7 * 24 * 60 * 60 * 1000),
    COOKIE_DOMAIN: zod_1.z.string().optional(),
    BCRYPT_SALT_ROUNDS: zod_1.z.coerce
        .number({ error: 'BCRYPT_SALT_ROUNDS deve ser um número' })
        .int()
        .min(10, 'BCRYPT_SALT_ROUNDS deve ser no mínimo 10 por segurança.')
        .max(15, 'BCRYPT_SALT_ROUNDS acima de 15 é impraticavelmente lento.')
        .default(12),
    CLOUDINARY_CLOUD_NAME: zod_1.z
        .string({ error: 'CLOUDINARY_CLOUD_NAME é obrigatória' })
        .min(1, 'CLOUDINARY_CLOUD_NAME não pode ser vazia'),
    CLOUDINARY_API_KEY: zod_1.z
        .string({ error: 'CLOUDINARY_API_KEY é obrigatória' })
        .min(1, 'CLOUDINARY_API_KEY não pode ser vazia'),
    CLOUDINARY_API_SECRET: zod_1.z
        .string({ error: 'CLOUDINARY_API_SECRET é obrigatória' })
        .min(1, 'CLOUDINARY_API_SECRET não pode ser vazia'),
});
function loadEnv() {
    const result = envSchema.safeParse(process.env);
    if (!result.success) {
        console.error('\nErro na configuração de variáveis de ambiente:\n');
        for (const issue of result.error.issues) {
            const campo = issue.path.join('.') || '(desconhecido)';
            console.error(`  • ${campo}: ${issue.message}`);
        }
        console.error('\nVerifique as variáveis de ambiente e tente novamente.\n');
        process.exit(1);
    }
    return result.data;
}
exports.env = loadEnv();
//# sourceMappingURL=env.js.map