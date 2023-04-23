import { pool } from '../db';

afterAll(() => {
  setTimeout(async () => {
    await pool.end();
  }, 2000);
});
