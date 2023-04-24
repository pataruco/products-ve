import { ApolloServer } from '@apollo/server';
import { readFileSync } from 'fs';
import gql from 'graphql-tag';

import resolvers from '../resolvers';
import { Context } from '../types/context';

describe('Query store by id', async () => {
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
    const query = `query Store($id: String!) {
                      store(id: $String!) {
                        name
                      }
                  }`;
    const variables = {
      id: '123',
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

    expect(data).toBeUndefined();
  });
});
