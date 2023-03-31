import { query } from '../db';
import { Store } from '../types/store';
import { Geometry } from 'wkx';

interface StoreRow {
  store_id: string;
  geog: string;
  name: string;
  address: string;
  created_at: Date;
  updatedd_at: Date;
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

export const getStoreById = async (
  _parent: unknown,
  { id }: { id: Store['id'] },
) => {
  const { rows }: { rows: StoreRow[] } = await query(
    `SELECT * from stores WHERE store_id = '${id}'`,
  );

  return fromSqlToStore(rows[0]);
};
