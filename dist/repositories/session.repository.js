"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionRepository = void 0;
const pool_1 = require("../database/pool");
function toSession(row) {
    return {
        id: row.id,
        userId: row.id_user,
        tokenHash: row.token_hash,
        device: row.device,
        ip: row.ip,
        expiresAt: row.expires_at,
        createdAt: row.created_at,
    };
}
/**
 * Cria uma nova sessão (chamado no login e no refresh, um registo
 * por dispositivo/token emitido).
 *
 * Não precisa de tratamento de UNIQUE violation em token_hash: como
 * o token é gerado com 64 bytes aleatórios (ver generateRefreshToken
 * em token.util.ts), uma colisão é estatisticamente impossível na
 * prática — tratar esse erro aqui seria complexidade sem benefício
 * real.
 */
async function create(data) {
    const result = await (0, pool_1.query)(`INSERT INTO session (id_user, token_hash, device, ip, expires_at)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, id_user, token_hash, device, ip, expires_at, created_at`, [data.userId, data.tokenHash, data.device ?? null, data.ip ?? null, data.expiresAt]);
    return toSession(result.rows[0]);
}
/**
 * Busca uma sessão pelo hash do token — é assim que o fluxo de
 * refresh localiza a sessão correspondente ao refresh token que o
 * cliente enviou (depois de o service recalcular o hash dele).
 */
async function findByTokenHash(tokenHash) {
    const result = await (0, pool_1.query)(`SELECT id, id_user, token_hash, device, ip, expires_at, created_at
     FROM session
     WHERE token_hash = $1`, [tokenHash]);
    const row = result.rows[0];
    return row ? toSession(row) : null;
}
/**
 * Remove uma sessão específica pelo id — usada no logout de UM
 * dispositivo (o atual). Devolve boolean para o service decidir se
 * a sessão já não existia (idempotência do logout: repetir o logout
 * não deve gerar erro).
 */
async function remove(id) {
    const result = await (0, pool_1.query)('DELETE FROM session WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
}
/**
 * Remove TODAS as sessões de um utilizador — usada em "sair de todos
 * os dispositivos", ou como medida de precaução ao detetar reuso
 * suspeito de um refresh token (ver auth.service.ts no próximo
 * passo).
 */
async function removeAllByUserId(userId) {
    await (0, pool_1.query)('DELETE FROM session WHERE id_user = $1', [userId]);
}
exports.sessionRepository = {
    create,
    findByTokenHash,
    remove,
    removeAllByUserId,
};
//# sourceMappingURL=session.repository.js.map