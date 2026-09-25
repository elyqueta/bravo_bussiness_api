"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionRepository = void 0;
const pool_1 = require("../database/pool");
function toSession(row) {
    return {
        id: row.id,
        userId: row.user_id,
        tokenHash: row.token_hash,
        device: row.device,
        ip: row.ip,
        expiresAt: row.expires_at,
        createdAt: row.created_at,
    };
}
async function create(data) {
    const result = await (0, pool_1.query)(`INSERT INTO sessions (user_id, token_hash, device, ip, expires_at)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, user_id, token_hash, device, ip, expires_at, created_at`, [data.userId, data.tokenHash, data.device ?? null, data.ip ?? null, data.expiresAt]);
    const row = result.rows[0];
    if (!row) {
        throw new Error('Falha ao criar sessão: nenhuma linha retornada.');
    }
    return toSession(row);
}
async function findByTokenHash(tokenHash) {
    const result = await (0, pool_1.query)(`SELECT id, user_id, token_hash, device, ip, expires_at, created_at
     FROM sessions
     WHERE token_hash = $1`, [tokenHash]);
    const row = result.rows[0];
    return row ? toSession(row) : null;
}
async function remove(id) {
    const result = await (0, pool_1.query)('DELETE FROM sessions WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
}
async function removeAllByUserId(userId) {
    await (0, pool_1.query)('DELETE FROM sessions WHERE user_id = $1', [userId]);
}
exports.sessionRepository = {
    create,
    findByTokenHash,
    remove,
    removeAllByUserId,
};
//# sourceMappingURL=session.repository.js.map