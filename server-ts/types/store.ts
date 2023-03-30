import gql from 'graphql-tag';

export interface Store {
  id?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  address?: string;
  name?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const StoreTypeDef = gql`
  type Store {
    id: ID
    coordinates: {
      lat: Float
      lng: Float
    }
    address: String
    name: String
    createdAt: String
    updatedAt: String
  }
`;
