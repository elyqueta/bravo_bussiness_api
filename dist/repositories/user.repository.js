"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRepository = void 0;
const pool_1 = require("../database/pool");
const errors_1 = require("../errors");
const PG_UNIQUE_VIOLATION = '23505';
function isPgError(err) {
    return typeof err === 'object' && err !== null && 'code' in err;
}
function toUser(row) {
    return {
        id: row.id,
        fullName: row.full_name,
        email: row.email,
        phone: row.phone,
        role: row.role,
        status: row.status,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}
function toUserWithPasswordHash(row) {
    return {
        ...toUser(row),
        passwordHash: row.password_hash,
    };
}
async function create(data) {
    try {
        const result = await (0, pool_1.query)(`INSERT INTO users (full_name, email, password_hash, phone, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, full_name, email, password_hash, phone, role,
                 status, created_at, updated_at`, [
            data.fullName,
            data.email,
            data.passwordHash,
            data.phone,
            data.role ?? 'admin',
        ]);
        return toUser(result.rows[0]);
    }
    catch (err) {
        if (isPgError(err) && err.code === PG_UNIQUE_VIOLATION) {
            throw new errors_1.ConflictError(`Já existe uma conta com o email "${data.email}".`);
        }
        throw err;
    }
}
async function findByEmail(email) {
    const result = await (0, pool_1.query)(`SELECT id, full_name, email, password_hash, phone, role,
            status, created_at, updated_at
     FROM users
     WHERE email = $1`, [email]);
    const row = result.rows[0];
    return row ? toUserWithPasswordHash(row) : null;
}
async function findById(id) {
    const result = await (0, pool_1.query)(`SELECT id, full_name, email, password_hash, phone, role,
            status, created_at, updated_at
     FROM users
     WHERE id = $1`, [id]);
    const row = result.rows[0];
    return row ? toUser(row) : null;
}
exports.userRepository = {
    create,
    findByEmail,
    findById,
};
//# sourceMappingURL=user.repository.js.map