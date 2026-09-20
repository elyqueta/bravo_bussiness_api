"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.companyService = void 0;
const company_repository_1 = require("../repositories/company.repository");
const errors_1 = require("../errors");
async function create(input) {
    return company_repository_1.companyRepository.create({
        name: input.name,
        nif: input.nif,
        sector: input.sector ?? null,
    });
}
async function findAll() {
    return company_repository_1.companyRepository.findAll();
}
async function findById(id) {
    const company = await company_repository_1.companyRepository.findById(id);
    if (!company) {
        throw new errors_1.NotFoundError(`Empresa com id "${id}" não encontrada.`);
    }
    return company;
}
async function update(id, input) {
    const updated = await company_repository_1.companyRepository.update(id, input);
    if (!updated) {
        throw new errors_1.NotFoundError(`Empresa com id "${id}" não encontrada.`);
    }
    return updated;
}
async function deactivate(id) {
    const deactivated = await company_repository_1.companyRepository.deactivate(id);
    if (!deactivated) {
        throw new errors_1.NotFoundError(`Empresa com id "${id}" não encontrada ou já está inactiva.`);
    }
}
exports.companyService = {
    create,
    findAll,
    findById,
    update,
    deactivate,
};
//# sourceMappingURL=company.service.js.map