"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedAdmin = seedAdmin;
const user_repository_1 = require("../../repositories/user.repository");
const password_util_1 = require("../../utils/password.util");
const data_1 = require("./data");
async function seedAdmin() {
    const existing = await user_repository_1.userRepository.findByEmail('admin@bravo.co.ao');
    if (existing) {
        console.warn(`Admin "admin@bravo.co.ao" já existe (id: ${existing.id}). Nada a fazer.`);
        return;
    }
    const passwordHash = await (0, password_util_1.hashPassword)(data_1.SEED_PASSWORD);
    const created = await user_repository_1.userRepository.create({
        fullName: 'Admin Bravo',
        email: 'admin@bravo.co.ao',
        passwordHash,
        phone: '923000000',
        role: 'admin',
    });
    console.warn(`Admin criado: ${created.email} (id: ${created.id})`);
    console.warn(`Senha: ${data_1.SEED_PASSWORD}`);
}
//# sourceMappingURL=seedAdmin.js.map