"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.comparePassword = comparePassword;
const bcrypt_1 = __importDefault(require("bcrypt"));
const env_1 = require("../config/env");
/**
 * Gera o hash bcrypt de uma senha em texto simples.
 *
 * `env.BCRYPT_SALT_ROUNDS` (validado no env.ts, padrão 12) controla
 * o custo computacional. O bcrypt já gera e embute o salt sozinho —
 * não precisamos gerar nem guardar um salt separado, ele vem
 * codificado dentro do próprio hash resultante.
 */
async function hashPassword(plainPassword) {
    return bcrypt_1.default.hash(plainPassword, env_1.env.BCRYPT_SALT_ROUNDS);
}
/**
 * Compara uma senha em texto simples com um hash já guardado.
 *
 * NUNCA comparar hashes com `===` ou `hash1 === hash2` — o bcrypt
 * embute o salt de forma que dois hashes da MESMA senha nunca são
 * idênticos entre si. `bcrypt.compare` sabe extrair o salt do hash
 * armazenado e refazer o cálculo corretamente antes de comparar.
 */
async function comparePassword(plainPassword, passwordHash) {
    return bcrypt_1.default.compare(plainPassword, passwordHash);
}
//# sourceMappingURL=password.util.js.map