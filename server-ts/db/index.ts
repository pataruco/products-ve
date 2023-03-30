import type { ClientConfig, QueryConfig } from 'pg';
import pg from 'pg';

const { Pool } = pg;

const dbConfig: ClientConfig = {
  host: '127.0.0.1',
  user: 'pataruco',
  password: 'pataruco',
  database: 'productsdb',
};

const pool = new Pool(dbConfig);

export const getClient = async () => {
  try {
    const client = await pool.connect();
    const query = client.query;
    const release = client.release;
    // set a timeout of 5 seconds, after which we will log this client's last query
    const timeout = setTimeout(() => {
      console.error('A client has been checked out for more than 5 seconds!');
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

export const query = async (text: string | QueryConfig<any>, params?: any) => {
  try {
    const start = Date.now();
    const client = await getClient();
    const res = await client.query(text, params);
    const duration = Date.now() - start;
    console.log('executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    const dbError = new Error(
      `Database error: ${(error as unknown as Error).message}`,
    );
    throw dbError;
  }
};
