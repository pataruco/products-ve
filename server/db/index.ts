import type { PoolConfig, QueryConfig } from 'pg';
import pg from 'pg';

import { POSTGRES_HOST, POSTGRES_PASSWORD, POSTGRES_USER } from '../config';
import logger, { Service } from '../libs/logger';

const { Pool } = pg;

const poolConfig: PoolConfig = {
  host: POSTGRES_HOST,
  user: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  database: 'productsdb',
  idleTimeoutMillis: 30000,
  max: 20,
};

export const pool = new Pool(poolConfig);

// rome-ignore lint/suspicious/noExplicitAny: <explanation>
export const query = async (text: string | QueryConfig<any>, params?: any) => {
  try {
    const start = Date.now();
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    logger.info({
      message: 'database-query',
      service: Service.DATABASE,
      text,
      duration,
      rows: res.rowCount,
    });

    return res;
  } catch (error) {
    const dbError = new Error(
      `Database error: ${(error as unknown as Error).message}`,
    );
    throw dbError;
  }
};
