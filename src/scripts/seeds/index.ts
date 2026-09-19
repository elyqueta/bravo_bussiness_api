import { closePool } from '../../database/pool';
import { seedAdmin } from './seedAdmin';
import { seedCategories, seedProducts } from './seedCatalog';

async function runSeeds(): Promise<void> {
  console.warn('\n=== A iniciar seeds ===\n');

  console.warn('--- Admin ---');
  await seedAdmin();

  console.warn('\n--- Categorias ---');
  const categoryLabels = await seedCategories();

  console.warn('\n--- Produtos ---');
  await seedProducts(categoryLabels);

  console.warn('\n=== Seeds concluídos com sucesso ===\n');
}

runSeeds()
  .catch((err: unknown) => {
    console.error('Erro ao executar seeds:', err);
    process.exit(1);
  })
  .finally(async () => {
    await closePool();
  });
