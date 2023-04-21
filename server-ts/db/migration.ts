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
  } catch (error) {
    console.error(
      `Database migration failed ❌, Error: ${(error as Error).message}`,
    );
  } finally {
    await client.release();
    process.exit();
  }
};

main();
