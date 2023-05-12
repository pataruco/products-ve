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

  it('Get stores by distances product is not given', async () => {
    const query = `query Stores($from: StoresFromInput!) {
                        stores(from: $from) {
                          name
                        }
                      }`;

    const variables = {
      from: {
        coordinates,
        distance: 10000,
      },
    };

    const expected = [
      {
        name: 'Brixton Market',
      },
      {
        name: 'Piccolo Bar',
      },
      {
        name: 'El Rincon Quiteno',
      },
      {
        name: 'Arepa & Co',
      },
      {
        name: 'Jeans Deli/Cafe',
      },
      {
        name: 'Sun Food',
      },
      {
        name: 'Casa de Carnes',
      },
      {
        name: 'Rye Lane',
      },
      {
        name: 'Afro Caribbean Asian Store',
      },
      {
        name: 'La Chatica',
      },
      {
        name: 'Latin Stop',
      },
      {
        name: 'Tesco Tottenham',
      },
      {
        name: 'Fulham',
      },
      {
        name: 'Tesco Extra Streatham',
      },
      {
        name: 'Tropical Mini Market',
      },
      {
        name: 'Los Arrieros',
      },
      {
        name: 'M.k. Super Market',
      },
      {
        name: 'K M Butchers',
      },
      {
        name: 'Supermecardo Portugal',
      },
      {
        name: 'La Bodeguita',
      },
      {
        name: 'Tesco',
      },
      {
        name: 'Tahir Halal Meat',
      },
      {
        name: 'Seven Sisters Greengrocers',
      },
      {
        name: 'Tesco Lewisham Superstore',
      },
      {
        name: 'R Garcia and Sons',
      },
      {
        name: 'Gurbet',
      },
      {
        name: 'Donde Carlos',
      },
      {
        name: 'International Cash & Carry',
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

  it('return a stores with a list of products available', async () => {
    const query = `
      query Stores($from: StoresFromInput!) {
        stores(from: $from) {
          name
          products {
            name
          }
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
        name: 'La Bodeguita',
        products: [
          {
            name: 'PAN',
          },
          {
            name: 'COCOSETTE',
          },
        ],
      },
      {
        name: 'Los Arrieros',
        products: [
          {
            name: 'PAN',
          },
          {
            name: 'COCOSETTE',
          },
        ],
      },
      {
        name: 'La Chatica',
        products: [
          {
            name: 'COCOSETTE',
          },
          {
            name: 'PAN',
          },
        ],
      },
      {
        name: 'Arepa & Co',
        products: [
          {
            name: 'PAN',
          },
        ],
      },
    ]
      .sort(sortAlphaByName)
      .map((store) => {
        const orderedProducts = store.products.sort(sortAlphaByName);

        return {
          ...store,
          products: orderedProducts,
        };
      });

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
    expect(
      stores
        .sort(sortAlphaByName)
        .map((store: { products: { name: string }[] }) => {
          const orderedProducts = store.products.sort(sortAlphaByName);
          return {
            ...store,
            products: orderedProducts,
          };
        }),
    ).toEqual(expected);
  });
});
