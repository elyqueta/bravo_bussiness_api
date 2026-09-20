"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const user_repository_1 = require("../repositories/user.repository");
const password_util_1 = require("../utils/password.util");
const token_util_1 = require("../utils/token.util");
const errors_1 = require("../errors");
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
function issueTokens(user) {
    const accessToken = (0, token_util_1.generateAccessToken)({
        sub: user.id,
        email: user.email,
        role: user.role,
    });
    return { user, accessToken };
}
async function login(input) {
    const userWithHash = await user_repository_1.userRepository.findByEmail(input.email);
    if (!userWithHash) {
        throw new errors_1.UnauthorizedError('Credenciais inválidas.');
    }
    const isPasswordValid = await (0, password_util_1.comparePassword)(input.password, userWithHash.passwordHash);
    if (!isPasswordValid) {
        throw new errors_1.UnauthorizedError('Credenciais inválidas.');
    }
    if (userWithHash.status !== 'active') {
        throw new errors_1.UnauthorizedError('Esta conta não está ativa. Contacte o suporte.');
    }
    const user = toSafeUser(userWithHash);
    return issueTokens(user);
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
    registerAdmin,
};
//# sourceMappingURL=auth.service.js.map