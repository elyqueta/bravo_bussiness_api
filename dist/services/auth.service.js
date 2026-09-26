"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const user_repository_1 = require("../repositories/user.repository");
const session_repository_1 = require("../repositories/session.repository");
const password_util_1 = require("../utils/password.util");
const token_util_1 = require("../utils/token.util");
const errors_1 = require("../errors");
const env_1 = require("../config/env");
function toSafeUser(user) {
    return {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
}
async function issueTokens(user, device, ip) {
    const accessToken = (0, token_util_1.generateAccessToken)({
        sub: user.id,
        email: user.email,
        role: user.role,
    });
    const refreshToken = (0, token_util_1.generateRefreshToken)();
    const refreshTokenExpiresIn = env_1.env.JWT_REFRESH_EXPIRES_IN;
    const refreshExpiresAt = new Date(Date.now() + refreshTokenExpiresIn);
    await session_repository_1.sessionRepository.create({
        userId: user.id,
        tokenHash: (0, token_util_1.hashToken)(refreshToken),
        device: device ?? null,
        ip: ip ?? null,
        expiresAt: refreshExpiresAt,
    });
    return {
        user,
        accessToken,
        refreshToken,
        refreshExpiresAt,
    };
}
function isAccountLocked(user) {
    return user.lockedUntil !== null && user.lockedUntil > new Date();
}
async function login(input, device, ip) {
    const userWithHash = await user_repository_1.userRepository.findByEmail(input.email);
    if (!userWithHash) {
        throw new errors_1.UnauthorizedError('Credenciais inválidas.');
    }
    if (userWithHash.status !== 'active') {
        throw new errors_1.UnauthorizedError('Esta conta não está ativa. Contacte o suporte.');
    }
    if (isAccountLocked(userWithHash)) {
        throw new errors_1.UnauthorizedError('Conta temporariamente bloqueada. Tente novamente mais tarde.');
    }
    const isPasswordValid = await (0, password_util_1.comparePassword)(input.password, userWithHash.passwordHash);
    if (!isPasswordValid) {
        await user_repository_1.userRepository.incrementFailedAttempts(userWithHash.id);
        throw new errors_1.UnauthorizedError('Credenciais inválidas.');
    }
    await user_repository_1.userRepository.resetFailedAttempts(userWithHash.id);
    const user = toSafeUser(userWithHash);
    return issueTokens(user, device, ip);
}
async function refresh(refreshToken) {
    const tokenHash = (0, token_util_1.hashToken)(refreshToken);
    const session = await session_repository_1.sessionRepository.findByTokenHash(tokenHash);
    if (!session) {
        throw new errors_1.UnauthorizedError('Refresh token inválido ou expirado.');
    }
    if (session.expiresAt < new Date()) {
        await session_repository_1.sessionRepository.remove(session.id);
        throw new errors_1.UnauthorizedError('Refresh token expirado.');
    }
    const user = await user_repository_1.userRepository.findById(session.userId);
    if (!user || user.status !== 'active') {
        await session_repository_1.sessionRepository.removeAllByUserId(session.userId);
        throw new errors_1.UnauthorizedError('Sessão inválida.');
    }
    await session_repository_1.sessionRepository.remove(session.id);
    return issueTokens(user, session.device, session.ip);
}
async function registerAdmin(fullName, email, plainPassword) {
    const passwordHash = await (0, password_util_1.hashPassword)(plainPassword);
    return user_repository_1.userRepository.create({
        fullName,
        email,
        passwordHash,
        phone: '',
        role: 'admin',
    });
}
exports.authService = {
    login,
    refresh,
    registerAdmin,
};
//# sourceMappingURL=auth.service.js.map