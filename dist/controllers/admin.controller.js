"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminController = void 0;
function getMe(req, res) {
    res.status(200).json({
        status: 'success',
        data: req.user,
    });
}
exports.adminController = {
    getMe,
};
//# sourceMappingURL=admin.controller.js.map