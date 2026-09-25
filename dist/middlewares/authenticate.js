"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
const token_util_1 = require("../utils/token.util");
const errors_1 = require("../errors");
/**
 * Middleware que protege rotas exigindo um access token válido no
 * cabeçalho Authorization.
 *
 * Formato esperado: "Authorization: Bearer <token>" — este é o
 * padrão definido pela RFC 6750 (OAuth 2.0 Bearer Token), adotado
 * universalmente por APIs REST, não uma convenção nossa.
 *
 * Onde este middleware deve ser usado?
 *
 * Em qualquer rota que precise saber "quem está a fazer esta
 * requisição" — ex: GET /api/v1/cart (carrinho é sempre de um
 * utilizador específico), POST /api/v1/orders. Rotas públicas como
 * GET /api/v1/categories continuam sem este middleware.
 *
 * Por que não distinguir "token ausente" de "token inválido" na
 * mensagem de erro?
 *
 * Mesmo raciocínio já aplicado no login (ver auth.service.ts): do
 * ponto de vista do cliente, a ação correta é sempre a mesma
 * ("autentique-se de novo"). Diferenciar as mensagens não ajudaria
 * um utilizador legítimo e só daria informação extra a quem estiver
 * a tentar contornar a autenticação.
 */
function authenticate(req, _res, next) {
    const authHeader = req.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        next(new errors_1.UnauthorizedError('Token de acesso ausente.'));
        return;
    }
    // "Bearer <token>" — descarta os 7 caracteres de "Bearer " para
    // isolar só o token em si.
    const token = authHeader.slice(7);
    try {
        const payload = (0, token_util_1.verifyAccessToken)(token);
        req.user = payload;
        next();
    }
    catch {
        // verifyAccessToken lança em dois cenários: assinatura inválida
        // (token forjado/adulterado) ou token expirado. Tratamos os
        // dois da mesma forma aqui, pelo motivo explicado acima.
        next(new errors_1.UnauthorizedError('Token de acesso inválido ou expirado.'));
    }
}
//# sourceMappingURL=authenticate.js.map