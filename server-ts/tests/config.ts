import { pool } from '../db';
import logger from '../libs/logger';

beforeAll(() => {
  logger.silent = true;
});

afterAll(async () => {
  await pool.end();
});
