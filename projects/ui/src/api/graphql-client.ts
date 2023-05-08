import { ApolloClient, InMemoryCache } from '@apollo/client';

export const client = new ApolloClient({
  uri: 'http://127.0.0.1:4000/',
  cache: new InMemoryCache(),
});
