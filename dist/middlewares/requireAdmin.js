"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = requireAdmin;
const errors_1 = require("../errors");
/**
 * Middleware de autorização (não confundir com autenticação).
 *
 * Diferença entre os dois, e por que são middlewares SEPARADOS:
 *
 * `authenticate` responde a "quem é você?" — verifica o token e
 * preenche req.user. `requireAdmin` responde a "você tem permissão
 * para isto?" — já assume que req.user existe, e só decide se o
 * TIPO de conta autenticada pode prosseguir. Separar os dois permite
 * reutilizar `authenticate` sozinho em rotas onde "estar logado" já
 * basta (ex.: GET /api/companies), e empilhar `requireAdmin` só onde
 * for preciso mais do que isso.
 *
 * Por que isto SEMPRE precisa vir DEPOIS de `authenticate` na cadeia
 * de middlewares da rota?
 *
 * req.user só é preenchido por `authenticate`. Se `requireAdmin`
 * rodasse primeiro, req.user seria sempre undefined, e este
 * middleware bloquearia todo mundo — inclusive admins legítimos.
 *
 * Por que 403 (ForbiddenError) e não 401 (UnauthorizedError)?
 *
 * 401 significa "eu não sei quem você é" (token ausente/inválido).
 * 403 significa "eu sei exatamente quem você é, e mesmo assim você
 * não pode fazer isto". Um utilizador 'personal' autenticado com um
 * token perfeitamente válido tentando aceder aqui está no segundo
 * caso — a identidade dele foi confirmada, só não tem permissão.
 */
function requireAdmin(req, _res, next) {
    if (req.user?.role !== 'admin') {
        next(new errors_1.ForbiddenError('Apenas administradores podem aceder a este recurso.'));
        return;
    }
    next();
}
//# sourceMappingURL=requireAdmin.js.map