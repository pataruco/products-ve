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
    `SELECT
      stores.store_id,
      stores.name,
      stores.address,
      stores.geog,
      stores.created_at,
      stores.updated_at,
      ARRAY_AGG(
        JSON_BUILD_OBJECT(
          'name',
          products.reference,
          'id',
          products.product_id,
          'brand',
          products.brand,
          'createdAt',
          products.created_at,
          'updatedAt',
          products.updated
        )
      ) AS products
    FROM
      stores
      JOIN stores_products ON stores_products.stores_store_id = stores.store_id
      JOIN products ON stores_products.products_product_id = products.product_id
    WHERE
      stores.store_id = '${id}'
    GROUP BY
        stores.store_id`,
  );

  return fromSqlToStore(rows[0]);
};
