"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userCompanyParamSchema = exports.companyIdParamOnlySchema = exports.updateUserCompanySchema = exports.createUserCompanySchema = void 0;
const zod_1 = require("zod");
const roleSchema = zod_1.z.string().trim().max(100, 'role deve ter no máximo 100 caracteres.');
/**
 * companyId NÃO entra aqui — vem sempre do parâmetro de rota
 * (:companyId), nunca do corpo. O único dado que o cliente envia no
 * corpo é QUEM está a associar (userId) e QUAL o cargo (role).
 */
exports.createUserCompanySchema = zod_1.z.object({
    userId: zod_1.z.uuid('userId deve ser um UUID válido.'),
    role: roleSchema.optional(),
});
/**
 * "role" é o único campo desta associação além das chaves — por
 * isso o PATCH exige-o sempre presente (sem .optional() aqui), em
 * vez de usar o padrão de "pelo menos um campo" do resto da API:
 * com um único campo possível, torná-lo opcional tornaria um PATCH
 * vazio {} tecnicamente válido, o que não faz sentido.
 */
exports.updateUserCompanySchema = zod_1.z.object({
    role: roleSchema.nullable(),
});
exports.companyIdParamOnlySchema = zod_1.z.object({
    companyId: zod_1.z.uuid('companyId deve ser um UUID válido.'),
});
exports.userCompanyParamSchema = zod_1.z.object({
    companyId: zod_1.z.uuid('companyId deve ser um UUID válido.'),
    userId: zod_1.z.uuid('userId deve ser um UUID válido.'),
});
//# sourceMappingURL=userCompany.validator.js.map