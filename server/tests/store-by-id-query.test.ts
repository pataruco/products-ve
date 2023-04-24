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
});
