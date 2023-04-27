import { ApolloServer } from '@apollo/server';
import { readFileSync } from 'fs';
import gql from 'graphql-tag';

import resolvers from '../resolvers';
import { Context } from '../types/context';

describe('Query store by id', () => {
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
    const query = `query Store($storeId: String!) {
                    store(id: $storeId) {
                      name
                    }
                  }`;

    const variables = {
      storeId: '123',
    };

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

    const [error] = errors;

    expect(error.message).toBe('Failed to get store due to validation errors');
    expect(error.extensions).toEqual({ code: 'VALIDATION_ERROR' });
    expect(data).toEqual({ store: null });
  });

  it('return a store', async () => {
    const storesQuery = `
    query Stores($from: StoresFromInput!) {
      stores(from: $from) {
        id
      }
    }`;

    const storesQueryVariable = {
      from: {
        coordinates: {
          lat: 51.50722,
          lng: -0.1275,
        },
        distance: 2500,
      },
    };

    const storesResponse = await server.executeOperation({
      query: storesQuery,
      variables: storesQueryVariable,
    });

    const {
      body: {
        // @ts-ignore
        singleResult: {
          data: { stores },
          errors: storesErrors,
        },
      },
    } = storesResponse;

    const storeId = stores[0].id;

    expect(storesErrors).toBeUndefined();

    const storeQuery = `
    query Store($storeId: String!) {
      store(id: $storeId) {
        name
        id
        address
        coordinates {
          lat
          lng
        }
      }
    }`;

    const storeVariable = {
      storeId,
    };

    const storeResponse = await server.executeOperation({
      query: storeQuery,
      variables: storeVariable,
    });

    const {
      body: {
        // @ts-ignore
        singleResult: {
          data: { store },
          errors,
        },
      },
    } = storeResponse;

    expect(errors).toBeUndefined();
    expect(store).toEqual({
      name: 'La Bodeguita',
      id: storeId,
      address: 'La Bodeguita Elephant and Castle London SE1 6TE United Kingdom',
      coordinates: {
        lat: 51.4959129,
        lng: -0.1004748,
      },
    });
  });
});
