import path from 'path';
import { migrate } from 'postgres-migrations';

import { pool } from './index';

const migrationFolder = path.resolve('./db/migrations');

const main = async () => {
  const start = Date.now();
  const client = await pool.connect();
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
