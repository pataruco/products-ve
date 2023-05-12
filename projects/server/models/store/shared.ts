import { Geometry } from 'wkx';
import {
  Product,
  ProductName,
  Store,
} from '../../__generated__/resolvers-types';

export interface GeoJson {
  coordinates: [number, number];
}

interface ProductFromStoreRow {
  id: string;
  name: string;
  brand: string;
  createdAt: string;
  updatedAt: string;
}

export interface StoreRow {
  store_id: string;
  geog: string;
  name: string;
  address: string;
  created_at: string;
  updated_at: string;
  products: ProductFromStoreRow[];
}

export const fromSqlToStore = ({
  store_id: id,
  geog,
  name,
  address,
  created_at: createdAt,
  updated_at: updatedAt,
  products,
}: StoreRow) => {
  const { coordinates } = Geometry.parse(
    Buffer.from(geog, 'hex'),
  ).toGeoJSON() as GeoJson;

  const [lng, lat] = coordinates;

  const productSerialised: Product[] = products.map((product) => {
    const {
      id: productId,
      brand,
      name,
      createdAt: productCreatedAt,
      updatedAt: productUpdatedAt,
    } = product;

    return {
      id: productId,
      name: name as ProductName,
      brand,
      createdAt: new Date(productCreatedAt).valueOf().toString(),
      updatedAt: new Date(productUpdatedAt).valueOf().toString(),
    };
  });

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
    products: productSerialised,
  };

  return store;
};
