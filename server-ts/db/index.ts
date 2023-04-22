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

const pool = new Pool(poolConfig);

export const getClient = async () => {
  try {
    const client = await pool.connect();
    const query = client.query;
    const release = client.release;
    // set a timeout of 5 seconds, after which we will log this client's last query
    const timeout = setTimeout(() => {
      logger.info({
        message: 'A client has been checked out for more than 5 seconds!',
        service: Service.DATABASE,
      });
    }, 5000);

    client.release = () => {
      // clear our timeout
      clearTimeout(timeout);
      // set the methods back to their old un-monkey-patched version
      client.query = query;
      client.release = release;
      return release.apply(client);
    };

    return client;
  } catch (error) {
    const dbError = new Error(
      `Database error: ${(error as unknown as Error).message}`,
    );
    throw dbError;
  }
};

// rome-ignore lint/suspicious/noExplicitAny: <explanation>
export const query = async (text: string | QueryConfig<any>, params?: any) => {
  try {
    const start = Date.now();
    const client = await getClient();
    const res = await client.query(text, params);
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
