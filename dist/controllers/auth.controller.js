"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const asyncHandler_1 = require("../middlewares/asyncHandler");
const auth_service_1 = require("../services/auth.service");
const session_repository_1 = require("../repositories/session.repository");
const token_util_1 = require("../utils/token.util");
const env_1 = require("../config/env");
function getCookieOptions() {
    return {
        httpOnly: true,
        secure: env_1.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/api/v1/auth',
        maxAge: env_1.env.JWT_REFRESH_EXPIRES_IN,
        domain: env_1.env.COOKIE_DOMAIN || undefined,
    };
}
const login = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const result = await auth_service_1.authService.login(req.body, req.ip);
    res.cookie('refreshToken', result.refreshToken, getCookieOptions());
    res.status(200).json({
        status: 'success',
        data: {
            user: result.user,
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
            refreshExpiresAt: result.refreshExpiresAt,
        },
    });
});
const refresh = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const bodyToken = req.body.refreshToken;
    const cookieToken = req.cookies?.refreshToken;
    const refreshToken = cookieToken || bodyToken;
    if (!refreshToken) {
        res.status(401).json({
            status: 'error',
            message: 'Sessão não encontrada.',
        });
        return;
    }
    const result = await auth_service_1.authService.refresh(refreshToken);
    res.cookie('refreshToken', result.refreshToken, getCookieOptions());
    res.status(200).json({
        status: 'success',
        data: {
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
            refreshExpiresAt: result.refreshExpiresAt,
        },
    });
});
const logout = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    const token = _req.cookies?.refreshToken;
    if (token) {
        const tokenHash = (0, token_util_1.hashToken)(token);
        const session = await session_repository_1.sessionRepository.findByTokenHash(tokenHash);
        if (session) {
            await session_repository_1.sessionRepository.remove(session.id);
        }
    }
    res.clearCookie('refreshToken', { path: '/api/v1/auth', domain: env_1.env.COOKIE_DOMAIN || undefined });
    res.status(204).send();
});
exports.authController = {
    login,
    refresh,
    logout,
};
//# sourceMappingURL=auth.controller.js.map