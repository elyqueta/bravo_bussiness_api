"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const pool_1 = require("./database/pool");
const server = app_1.default.listen(env_1.env.PORT, () => {
    console.warn(`Bravo Business API rodando em http://localhost:${env_1.env.PORT} [${env_1.env.NODE_ENV}]`);
});
function shutdown(signal) {
    console.warn(`\n${signal} recebido. Encerrando graciosamente...`);
    server.close((err) => {
        if (err) {
            console.error('Erro ao fechar servidor HTTP:', err);
            process.exit(1);
            return;
        }
        (0, pool_1.closePool)()
            .then(() => {
            console.warn('Servidor e pool de conexões encerrados.');
            process.exit(0);
        })
            .catch((closeErr) => {
            console.error('Erro ao fechar pool de conexões:', closeErr);
            process.exit(1);
        });
    });
}
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
//# sourceMappingURL=server.js.map