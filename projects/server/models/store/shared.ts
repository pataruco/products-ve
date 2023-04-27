import { Store } from '../../__generated__/resolvers-types';
import { Geometry } from 'wkx';

export interface GeoJson {
  coordinates: [number, number];
}

export interface StoreRow {
  store_id: string;
  geog: string;
  name: string;
  address: string;
  created_at: string;
  updated_at: string;
}

export const fromSqlToStore = ({
  store_id: id,
  geog,
  name,
  address,
  created_at: createdAt,
  updated_at: updatedAt,
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
