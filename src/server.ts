import app from './app';
import { env } from './config/env';
import { closePool } from './database/pool';

const server = app.listen(env.PORT, () => {
  console.warn(`Bravo Business API rodando em http://localhost:${env.PORT} [${env.NODE_ENV}]`);
});

function shutdown(signal: string): void {
  console.warn(`\n${signal} recebido. Encerrando graciosamente...`);

  server.close((err) => {
    if (err) {
      console.error('Erro ao fechar servidor HTTP:', err);
      process.exit(1);
      return;
    }

    closePool()
      .then(() => {
        console.warn('Servidor e pool de conexões encerrados.');
        process.exit(0);
      })
      .catch((closeErr: unknown) => {
        console.error('Erro ao fechar pool de conexões:', closeErr);
        process.exit(1);
      });
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
