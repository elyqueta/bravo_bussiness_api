"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const asyncHandler_1 = require("../middlewares/asyncHandler");
const auth_service_1 = require("../services/auth.service");
const login = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const result = await auth_service_1.authService.login(req.body, req.ip);
    res.status(200).json({
        status: 'success',
        data: result,
    });
});
const refresh = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { refreshToken } = req.body;
    const result = await auth_service_1.authService.refresh(refreshToken);
    res.status(200).json({
        status: 'success',
        data: result,
    });
});
exports.authController = {
    login,
    refresh,
};
//# sourceMappingURL=auth.controller.js.map