"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userCompanyController = void 0;
const asyncHandler_1 = require("../middlewares/asyncHandler");
const userCompany_service_1 = require("../services/userCompany.service");
const associate = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const association = await userCompany_service_1.userCompanyService.associate(req.params.companyId, req.body);
    res.status(201).json({
        status: 'success',
        data: association,
    });
});
const findAll = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const associations = await userCompany_service_1.userCompanyService.listByCompany(req.params.companyId);
    res.status(200).json({
        status: 'success',
        data: associations,
        count: associations.length,
    });
});
const update = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const association = await userCompany_service_1.userCompanyService.updateRole(req.params.companyId, req.params.userId, req.body);
    res.status(200).json({
        status: 'success',
        data: association,
    });
});
const remove = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    await userCompany_service_1.userCompanyService.remove(req.params.companyId, req.params.userId);
    res.status(204).send();
});
exports.userCompanyController = {
    associate,
    findAll,
    update,
    remove,
};
//# sourceMappingURL=userCompany.controller.js.map