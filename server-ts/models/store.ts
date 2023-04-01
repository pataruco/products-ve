import { GraphQLError } from 'graphql';
import Joi from 'joi';
import { Geometry } from 'wkx';

import {
  MutationStoreArgs,
  Store,
  StoresFromInput,
} from '../__generated__/resolvers-types';
import { query } from '../db';

interface StoreRow {
  store_id: string;
  geog: string;
  name: string;
  address: string;
  created_at: string;
  updatedd_at: string;
}

interface GeoJson {
  coordinates: [number, number];
}

const fromSqlToStore = ({
  store_id: id,
  geog,
  name,
  address,
  created_at: createdAt,
  updatedd_at: updatedAt,
}: StoreRow) => {
  const { coordinates } = Geometry.parse(
    Buffer.from(geog, 'hex'),
  ).toGeoJSON() as GeoJson;

  const [lng, lat] = coordinates;

  const store: Store = {
    id,
    name,
    address,
    coordinates: {
      lat,
      lng,
    },
    createdAt,
    updatedAt,
  };

  return store;
};

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

interface GetStoresFromArgs {
  from: {
    distance: StoresFromInput['distance'];
    coordinates: StoresFromInput['coordinates'];
  };
}

const getStoresFromSchema = Joi.object({
  distance: Joi.number().integer().required(),
  coordinates: {
    lat: Joi.number().required(),
    lng: Joi.number().required(),
  },
});

export const getStoresFrom = async (
  _parent: unknown,
  { from: { distance, coordinates } }: GetStoresFromArgs,
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

  const { rows }: { rows: StoreRow[] } = await query(
    `SELECT
          *
        FROM
          stores
        WHERE
          ST_DWithin (geog,
            ST_GeographyFromText ('POINT(${lng} ${lat})'),
            ${distance})`,
  );

  return rows.map(fromSqlToStore);
};

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
