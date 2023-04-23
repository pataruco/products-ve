import { ApolloServer } from '@apollo/server';
import { readFileSync } from 'fs';
import gql from 'graphql-tag';

import resolvers from '../resolvers';
import { Context } from '../types/context';

const sortAlphaByName = (a: { name: string }, b: { name: string }) =>
  a.name.localeCompare(b.name);

describe('server', () => {
  let server: ApolloServer<Context>;

  beforeAll(async () => {
    server = new ApolloServer({
      typeDefs: gql(
        readFileSync('schema.graphql', {
          encoding: 'utf-8',
        }),
      ),
      resolvers,
      nodeEnv: 'test',
    });
  });

  describe('Query stores', () => {
    it('Get stores by distance and product', async () => {
      const query = `query Stores($from: StoresFromInput!) {
                        stores(from: $from) {
                          name
                        }
                      }`;

      const variables = {
        from: {
          coordinates: {
            lat: 51.50722,
            lng: -0.1275,
          },
          distance: 10000,
          product: 'COCOSETTE',
        },
      };

      const expected = [
        {
          name: 'Los Arrieros',
        },
        {
          name: 'La Bodeguita',
        },
        {
          name: 'La Chatica',
        },
      ].sort(sortAlphaByName);

      const response = await server.executeOperation({
        query,
        variables,
      });

      const {
        body: {
          // @ts-ignore
          singleResult: {
            errors,
            data: { stores },
          },
        },
      } = response;

      expect(errors).toBeUndefined();
      expect(stores.sort(sortAlphaByName)).toEqual(expected);
    });

    it('Get stores by distances and product PAN when product is not given', async () => {
      const query = `query Stores($from: StoresFromInput!) {
                        stores(from: $from) {
                          name
                        }
                      }`;

      const variables = {
        from: {
          coordinates: {
            lat: 51.50722,
            lng: -0.1275,
          },
          distance: 5000,
        },
      };

      const expected = [
        {
          name: 'Arepa & Co',
        },
        {
          name: 'Los Arrieros',
        },
        {
          name: 'La Bodeguita',
        },
        {
          name: 'La Chatica',
        },
      ].sort(sortAlphaByName);

      const response = await server.executeOperation({
        query,
        variables,
      });

      const {
        body: {
          // @ts-ignore
          singleResult: {
            errors,
            data: { stores },
          },
        },
      } = response;

      expect(errors).toBeUndefined();
      expect(stores.sort(sortAlphaByName)).toEqual(expected);
    });
  });
});
