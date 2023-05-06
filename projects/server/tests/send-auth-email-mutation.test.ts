import { ApolloServer } from '@apollo/server';
import gql from 'graphql-tag';
import { readFileSync } from 'node:fs';

import resolvers from '../resolvers';
import { Context } from '../types/context';
import { emailApiServer } from './mocks/email-api-server';

describe('Send Auth email mutation', () => {
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

    emailApiServer.listen();
  });

  afterEach(() => {
    emailApiServer.resetHandlers();
  });

  afterAll(() => emailApiServer.close());

  it('Return a GraphQLError when validation fail', async () => {
    const query = `mutation SendAuthEmail($email: String!) {
        sendAuthEmail(email: $email)
      }`;

    const variables = {
      email: '💥',
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

    expect(error.message).toBe('Failed to send email due to validation errors');
    expect(error.extensions).toEqual({ code: 'VALIDATION_ERROR' });
    expect(data).toEqual({ sendAuthEmail: null });
  });

  it('sends auth emaail', async () => {
    const query = `mutation SendAuthEmail($email: String!) {
        sendAuthEmail(email: $email)
      }`;

    const variables = {
      email: 'test@example.com',
    };

    const response = await server.executeOperation({
      query,
      variables,
    });

    const {
      body: {
        // @ts-ignore
        singleResult: {
          errors,
          data: { sendAuthEmail },
        },
      },
    } = response;

    expect(errors).toBeUndefined();
    expect(sendAuthEmail).toBe(`Email sent to: ${variables.email}`);
  });
});
