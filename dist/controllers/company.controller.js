"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.companyController = void 0;
const asyncHandler_1 = require("../middlewares/asyncHandler");
const company_service_1 = require("../services/company.service");
const create = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const company = await company_service_1.companyService.create(req.body);
    res.status(201).json({
        status: 'success',
        data: company,
    });
});
const findAll = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    const companies = await company_service_1.companyService.findAll();
    res.status(200).json({
        status: 'success',
        data: companies,
        count: companies.length,
    });
});
const findById = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const company = await company_service_1.companyService.findById(req.params.id);
    res.status(200).json({
        status: 'success',
        data: company,
    });
});
const update = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const company = await company_service_1.companyService.update(req.params.id, req.body);
    res.status(200).json({
        status: 'success',
        data: company,
    });
});
/**
 * DELETE aqui é semanticamente um soft delete (ver
 * company.service.ts -> deactivate). Mantemos o verbo HTTP DELETE e
 * o status 204 porque, do ponto de vista do CLIENTE da API, o efeito
 * observável é o mesmo de uma remoção: a empresa deixa de estar
 * disponível para novas operações. O "como" (soft vs hard delete) é
 * um detalhe de implementação que não precisa vazar para o contrato
 * HTTP.
 */
const remove = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    await company_service_1.companyService.deactivate(req.params.id);
    res.status(204).send();
});
exports.companyController = {
    create,
    findAll,
    findById,
    update,
    remove,
};
//# sourceMappingURL=company.controller.js.map