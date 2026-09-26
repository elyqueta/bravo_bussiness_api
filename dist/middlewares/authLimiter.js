"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authLimiter = void 0;
const express_rate_limit_1 = require("express-rate-limit");
exports.authLimiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    handler(req, res) {
        const resetTime = req.rateLimit?.resetTime;
        const retryAfter = resetTime ? Math.ceil((resetTime - Date.now()) / 1000) : 0;
        res.status(429).json({
            status: 'error',
            message: 'Muitas tentativas de login. Tente novamente mais tarde.',
            retryAfter,
        });
    },
});
//# sourceMappingURL=authLimiter.js.map