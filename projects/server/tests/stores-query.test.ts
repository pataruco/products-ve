import { ApolloServer } from '@apollo/server';
import { readFileSync } from 'fs';
import gql from 'graphql-tag';

import resolvers from '../resolvers';
import { Context } from '../types/context';

const sortAlphaByName = (a: { name: string }, b: { name: string }) =>
  a.name.localeCompare(b.name);

const coordinates = {
  lat: 51.50722,
  lng: -0.1275,
};

describe('Query stores', () => {
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

  it('Return a GraphQLError when validation fail', async () => {
    const query = `query Stores($from: StoresFromInput!) {
                        stores(from: $from) {
                          name
                        }
                      }`;

    const variables = {
      from: {},
    };

    const extensions = { code: 'BAD_USER_INPUT' };

    const expected = [
      {
        message:
          'Variable "$from" got invalid value {}; Field "distance" of required type "Int!" was not provided.',
      },
      {
        message:
          'Variable "$from" got invalid value {}; Field "coordinates" of required type "CoordinatesInput!" was not provided.',
      },
    ];

    const response = await server.executeOperation({
      query,
      variables,
    });

    const {
      body: {
        // @ts-ignore
        singleResult: { errors, data },
      },
    } = response;

    expect.assertions(5);
    expect(data).toBeUndefined();
    errors.map(
      (
        error: { message: string; extensions: Record<string, string> },
        i: number,
      ) => {
        expect(error.message).toBe(expected[i].message);
        expect(error.extensions).toEqual(extensions);
      },
    );
  });

  it('Get stores by distance and product', async () => {
    const query = `query Stores($from: StoresFromInput!) {
                        stores(from: $from) {
                          name
                        }
                      }`;

    const variables = {
      from: {
        coordinates,
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
        coordinates,
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
