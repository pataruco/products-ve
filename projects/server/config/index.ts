import dotenv from 'dotenv';

dotenv.config();

export const HOST = process.env.HOST || '127.0.0.1';
export const PORT = process.env.PORT || 4000;
export const GRAPHQL_PATH = `http://${HOST}:${PORT}`;
export const POSTGRES_HOST = process.env.POSTGRES_HOST || '127.0.0.1';
export const POSTGRES_PORT = process.env.POSTGRES_PORT || 5432;
export const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD || 'pataruco';
export const POSTGRES_USER = process.env.POSTGRES_USER || 'pataruco';
export const POSTGRES_DB = process.env.POSTGRES_DB || 'productsdb';
export const FASTMAIL_API_TOKEN = process.env.FASTMAIL_API_TOKEN;
export const FASTMAIL_API_USERNAME = process.env.FASTMAIL_API_USERNAME;
export const JWT_SECRET =
  process.env.JWT_SECRET || 'ana-pedro-peter-miranda-martin-blanco';
export const WEB_CLIENT_HOST = process.env.WEB_CLIENT_HOST || 'localhost:3000';
