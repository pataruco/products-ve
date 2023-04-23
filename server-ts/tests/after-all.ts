import { pool, query, poolConfig } from '../db';

afterAll(async () => {
  await query(
    `SELECT pg_terminate_backend(pid) FROM pg_stat_activity
        WHERE datname='${poolConfig.database}';`,
  );
});
