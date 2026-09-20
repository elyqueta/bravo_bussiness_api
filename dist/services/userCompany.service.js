"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userCompanyService = void 0;
const userCompany_repository_1 = require("../repositories/userCompany.repository");
const company_service_1 = require("./company.service");
const errors_1 = require("../errors");
/**
 * `await companyService.findById(companyId)` aqui não serve para usar
 * o valor devolvido — serve só para forçar um 404 CLARO ("empresa não
 * encontrada") antes de sequer tentar o INSERT. Sem isto, um
 * companyId inválido só seria detectado pela FOREIGN KEY do Postgres,
 * misturado com o caso "userId inválido" na mesma exceção — perderíamos
 * a distinção entre os dois erros.
 */
async function associate(companyId, input) {
    await company_service_1.companyService.findById(companyId);
    return userCompany_repository_1.userCompanyRepository.create({
        userId: input.userId,
        companyId,
        role: input.role ?? null,
    });
}
async function listByCompany(companyId) {
    await company_service_1.companyService.findById(companyId);
    return userCompany_repository_1.userCompanyRepository.findByCompany(companyId);
}
async function updateRole(companyId, userId, input) {
    const updated = await userCompany_repository_1.userCompanyRepository.updateRole(companyId, userId, input.role);
    if (!updated) {
        throw new errors_1.NotFoundError('Associação entre este utilizador e esta empresa não encontrada.');
    }
    return updated;
}
async function remove(companyId, userId) {
    const removed = await userCompany_repository_1.userCompanyRepository.remove(companyId, userId);
    if (!removed) {
        throw new errors_1.NotFoundError('Associação entre este utilizador e esta empresa não encontrada.');
    }
}
exports.userCompanyService = {
    associate,
    listByCompany,
    updateRole,
    remove,
};
//# sourceMappingURL=userCompany.service.js.map