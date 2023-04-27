import { GraphQLError } from 'graphql';
import Joi from 'joi';

import { MutationStoreArgs } from '../../__generated__/resolvers-types';
import { query } from '../../db';
import { StoreRow, fromSqlToStore } from './shared';

const createStoreSchema = Joi.object({
  name: Joi.string().required().min(1),
  address: Joi.string().required().min(1),
  coordinates: {
    lat: Joi.number().required(),
    lng: Joi.number().required(),
  },
});

export const createStore = async (
  _parent: unknown,
  {
    store: {
      coordinates: { lat, lng },
      name,
      address,
    },
  }: MutationStoreArgs,
) => {
  const { error } = createStoreSchema.validate({
    name,
    address,
    coordinates: {
      lat,
      lng,
    },
  });

  if (error) {
    throw new GraphQLError('Failed to get store due to validation errors', {
      originalError: error,
      extensions: {
        code: 'VALIDATION_ERROR',
      },
    });
  }

  await query(
    `INSERT INTO
        stores (geog, name, address)
       VALUES
        (
          ST_GeographyFromText('POINT(${lng} ${lat})'),
          '${name}',
          '${address}'
        )`,
  );

  const { rows }: { rows: StoreRow[] } = await query(
    `SELECT
	    *
    FROM
	    stores
    WHERE
      name = '${name}'
      AND address = '${address}'
      AND geog = ST_GeographyFromText('POINT(${lng} ${lat})')
      ORDER BY created_at DESC
  `,
  );

  return fromSqlToStore(rows[0]);
};
