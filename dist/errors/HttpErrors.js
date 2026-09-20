"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationError = exports.ConflictError = exports.NotFoundError = exports.ForbiddenError = exports.UnauthorizedError = exports.BadRequestError = void 0;
const AppError_1 = require("./AppError");
/**
 * Cada subclasse abaixo representa uma categoria de erro HTTP comum
 * em uma API REST. A ideia é que, em qualquer controller/service
 * futuro, o código de negócio simplesmente lance a classe certa:
 *
 *   if (!produto) {
 *     throw new NotFoundError('Produto não encontrado.');
 *   }
 *
 * ...sem nunca precisar saber ou escrever manualmente o número do
 * status HTTP (404, 409, etc.) — isso fica encapsulado aqui, em um
 * único lugar. Se um dia a equipe decidir mudar a convenção (por
 * exemplo, usar 400 em vez de 422 para erros de validação), a
 * mudança acontece em UM arquivo, não espalhada pela aplicação.
 */
/** 400 — a requisição está malformada ou não faz sentido como veio. */
class BadRequestError extends AppError_1.AppError {
    constructor(message = 'Requisição inválida.', details) {
        super(message, 400, details);
    }
}
exports.BadRequestError = BadRequestError;
/** 401 — o cliente não está autenticado (token ausente/inválido/expirado). */
class UnauthorizedError extends AppError_1.AppError {
    constructor(message = 'Não autenticado.', details) {
        super(message, 401, details);
    }
}
exports.UnauthorizedError = UnauthorizedError;
/** 403 — o cliente está autenticado, mas não tem permissão para a ação. */
class ForbiddenError extends AppError_1.AppError {
    constructor(message = 'Acesso negado.', details) {
        super(message, 403, details);
    }
}
exports.ForbiddenError = ForbiddenError;
/** 404 — o recurso solicitado não existe. */
class NotFoundError extends AppError_1.AppError {
    constructor(message = 'Recurso não encontrado.', details) {
        super(message, 404, details);
    }
}
exports.NotFoundError = NotFoundError;
/**
 * 409 — a requisição conflita com o estado atual do recurso.
 * Exemplo típico: tentar cadastrar um NIF que já existe.
 */
class ConflictError extends AppError_1.AppError {
    constructor(message = 'Conflito com o estado atual do recurso.', details) {
        super(message, 409, details);
    }
}
exports.ConflictError = ConflictError;
/**
 * 422 — a requisição está bem formada (é um JSON válido, por exemplo),
 * mas os dados nela não passam nas regras de validação de negócio.
 * É o status que o Zod (na camada de validators/) deve gerar quando
 * um schema falha.
 */
class ValidationError extends AppError_1.AppError {
    constructor(message = 'Dados inválidos.', details) {
        super(message, 422, details);
    }
}
exports.ValidationError = ValidationError;
//# sourceMappingURL=HttpErrors.js.map