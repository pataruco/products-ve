import {
  Store,
  StoresFromInput,
  StoreInput,
} from '../__generated__/resolvers-types';
import { query } from '../db';
import { Geometry } from 'wkx';

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

export const getStoreById = async (
  _parent: unknown,
  { id }: GetStoreByIdArgs,
) => {
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

export const getStoresFrom = async (
  _parent: unknown,
  { from: { distance, coordinates } }: GetStoresFromArgs,
) => {
  const { lat, lng } = coordinates;

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

export const createStore = async (
  _parent: unknown,
  { coordinates, name, address }: StoreInput,
) => {
  const { lat, lng } = coordinates;

  const { rows }: { rows: StoreRow[] } = await query(
    `INSERT INTO
        stores (geog, name, address)
       VALUES
        (
          ST_GeographyFromText('POINT(${lng} ${lat})'),
          '${name}',
          '${address}'
        )`,
  );

  return fromSqlToStore(rows[0]);
};
