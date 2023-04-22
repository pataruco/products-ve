import { ApolloServer } from '@apollo/server';
import { readFileSync } from 'fs';
import gql from 'graphql-tag';
import { inspect } from 'util';

import resolvers from '../resolvers';
import { GraphQLResponseBody } from '@apollo/server/dist/esm/externalTypes/graphql';

describe('Repository Template Functionality', () => {
  const server = new ApolloServer({
    typeDefs: gql(
      readFileSync('schema.graphql', {
        encoding: 'utf-8',
      }),
    ),
    resolvers,
  });

  it('Executes Location Entity Resolver', async () => {
    //Arrange
    const query = `query Stores($from: StoresFromInput!) {
                      stores(from: $from) {
                        name
                        address
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

    const expected = {
      stores: [
        {
          name: 'Los Arrieros',
          address: 'Walworth Rd London SE1 6SW',
        },
        {
          name: 'La Chatica',
          address:
            'La Chatica Café 2 Elephant Rd London SE17 1LB United Kingdom',
        },
        {
          name: 'La Bodeguita',
          address:
            'La Bodeguita Elephant and Castle London SE1 6TE United Kingdom',
        },
      ],
    };
    //Act
    const res = await server.executeOperation({
      query,
      variables,
    });
    //Assert
    expect(res.body.kind).toEqual('single');
    // rome-ignore lint/suspicious/noExplicitAny: <explanation>
    expect((res.body as any).singleResult.errors).toBeUndefined();

    // rome-ignore lint/suspicious/noExplicitAny: <explanation>
    expect((res.body as any).singleResult.data).toEqual(expected);
  });
});
