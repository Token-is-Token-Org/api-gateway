import { buildApp } from './app.js';
import { PORT } from './config/index.js';

async function start() {
  const app = await buildApp();

  try {
    await app.listen({ port: PORT, host: '0.0.0.0' });
    
    const signals = ['SIGINT', 'SIGTERM'];
    for (const signal of signals) {
      process.on(signal, async () => {
        app.log.info(`Received ${signal}, closing server...`);
        await app.close();
        app.log.info('Server closed');
        process.exit(0);
      });
    }
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();
