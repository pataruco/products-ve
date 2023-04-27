import { GraphQLError } from 'graphql';
import Joi from 'joi';

import { Store } from '../../__generated__/resolvers-types';
import { query } from '../../db';
import { StoreRow, fromSqlToStore } from './shared';

interface GetStoreByIdArgs {
  id: Store['id'];
}

const getStoreByIdSchema = Joi.object({
  id: Joi.string()
    .guid({
      version: ['uuidv4', 'uuidv5'],
    })
    .required(),
});

export const getStoreById = async (
  _parent: unknown,
  { id }: GetStoreByIdArgs,
) => {
  const { error } = getStoreByIdSchema.validate({ id });

  if (error) {
    throw new GraphQLError('Failed to get store due to validation errors', {
      originalError: error,
      extensions: {
        code: 'VALIDATION_ERROR',
      },
    });
  }

  const { rows }: { rows: StoreRow[] } = await query(
    `SELECT * from stores WHERE store_id = '${id}'`,
  );

  return fromSqlToStore(rows[0]);
};
