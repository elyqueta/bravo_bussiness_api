"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pool_1 = require("../../database/pool");
const seedAdmin_1 = require("./seedAdmin");
const seedCatalog_1 = require("./seedCatalog");
async function runSeeds() {
    console.warn('\n=== A iniciar seeds ===\n');
    console.warn('--- Admin ---');
    await (0, seedAdmin_1.seedAdmin)();
    console.warn('\n--- Categorias ---');
    const categoryLabels = await (0, seedCatalog_1.seedCategories)();
    console.warn('\n--- Produtos ---');
    await (0, seedCatalog_1.seedProducts)(categoryLabels);
    console.warn('\n=== Seeds concluídos com sucesso ===\n');
}
runSeeds()
    .catch((err) => {
    console.error('Erro ao executar seeds:', err);
    process.exit(1);
})
    .finally(async () => {
    await (0, pool_1.closePool)();
});
//# sourceMappingURL=index.js.map