import { query } from '../../db/index.js';
import { Store } from '../../types/store/index.js';
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

export const getStoreById = async (
  _parent: unknown,
  { id }: { id: Store['id'] },
) => {
  const { rows }: { rows: StoreRow[] } = await query(
    `SELECT * from stores WHERE store_id = '${id}'`,
  );

  const { store_id, geog, name, address, created_at, updatedd_at } = rows[0];

  const { coordinates } = Geometry.parse(
    Buffer.from(geog, 'hex'),
  ).toGeoJSON() as GeoJson;

  const [lng, lat] = coordinates;

  const store: Store = {
    id: store_id,
    name,
    address,
    coordinates: {
      lat,
      lng,
    },
    createdAt: created_at,
    updatedAt: updatedd_at,
  };

  return store;
};

// export const createStore = async ({ name, address, coordinates }: Store) => {
//   const { lat, lng } = coordinates;

//   const { rows } = await query(`SELECT * from stores WHERE store_id = $1`);
// };
