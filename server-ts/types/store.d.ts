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
