import { GraphQLError } from 'graphql';
import Joi from 'joi';

import {
  ProductName,
  StoresFromInput,
} from '../../__generated__/resolvers-types';
import { query } from '../../db';
import { StoreRow, fromSqlToStore } from './shared';

interface GetStoresFromArgs {
  from: {
    distance: StoresFromInput['distance'];
    coordinates: StoresFromInput['coordinates'];
    product: StoresFromInput['product'];
  };
}

const getStoresFromSchema = Joi.object({
  distance: Joi.number().integer().required(),
  coordinates: {
    lat: Joi.number().required(),
    lng: Joi.number().required(),
  },
  product: Joi.string().valid(ProductName.Pan, ProductName.Cocosette),
});

export const getStoresFrom = async (
  _parent: unknown,
  { from: { distance, coordinates, product } }: GetStoresFromArgs,
) => {
  const { lat, lng } = coordinates;

  const { error } = getStoresFromSchema.validate({
    distance,
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

  if (!product) {
    const { rows }: { rows: StoreRow[] } = await query(
      `SELECT
        *
      FROM
        stores
      WHERE
        ST_DWithin(
          geog,
          ST_GeographyFromText('POINT(${lng} ${lat})'),
          ${distance}
        )`,
    );

    return rows.map(fromSqlToStore);
  }

  const { rows }: { rows: StoreRow[] } = await query(
    `SELECT DISTINCT ON (store_id)
        stores.geog,
        stores.name,
        stores.address,
        stores.created_at,
        stores.updated_at,
        stores.store_id
      FROM
        stores
        JOIN stores_products ON stores_products.products_product_id = (
          SELECT
            products.product_id
          FROM
            products
          WHERE
            reference = '${product}')
          JOIN products ON stores_products.stores_store_id = store_id
        WHERE
          ST_DWithin (geog, ST_GeographyFromText ('POINT(${lng} ${lat})'), ${distance})
        ORDER BY
          stores.store_id, stores.name ASC
          `,
  );

  return rows.map(fromSqlToStore);
};
//
