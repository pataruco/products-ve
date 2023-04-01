import path from 'path';
import { migrate } from 'postgres-migrations';

import { getClient } from './index';

const migrationFolder = path.resolve('./db/migrations');

const main = async () => {
  const client = await getClient();

  const start = Date.now();
  try {
    console.info('Database migration started 🟢');
    await migrate({ client }, migrationFolder);
    const duration = Date.now() - start;
    console.info(`Database migration finished 🏁, duration: ${duration}ms`);
  } finally {
    await client.release();
    process.exit();
  }
};

main();
