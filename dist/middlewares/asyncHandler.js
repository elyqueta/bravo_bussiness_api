"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = asyncHandler;
function asyncHandler(handler) {
    return (req, res, next) => {
        // O .catch aqui é o ponto-chave: garante que QUALQUER rejeição
        // da Promise retornada pelo handler seja capturada e encaminhada
        // para o Express, em vez de se perder silenciosamente.
        handler(req, res, next).catch(next);
    };
}
//# sourceMappingURL=asyncHandler.js.map