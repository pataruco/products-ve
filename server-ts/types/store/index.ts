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
  type Coordinates {
    lat: Float
    lng: Float
  }

  type Store {
    id: ID
    coordinates: Coordinates
    address: String
    name: String
    createdAt: String
    updatedAt: String
  }

  type Query {
    store(id: String!): Store
  }
`;
