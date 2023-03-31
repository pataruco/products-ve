import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { expressMiddleware } from '@apollo/server/express4';
import { readFileSync } from 'fs';
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import gql from 'graphql-tag';
import http from 'http';

import resolvers from './resolvers';
import { Context } from './types/context';
import apolloLogger from './libs/apollo-logger';
import { PORT } from './config';

const app = express();
// Required logic for integrating with Express
// httpServer handles incoming requests to our Express app.
// Below, we tell Apollo Server to "drain" this httpServer,
// enabling our servers to shut down gracefully.
const httpServer = http.createServer(app);

const main = async () => {
  let typeDefs = gql(
    readFileSync('schema.graphql', {
      encoding: 'utf-8',
    }),
  );
  // Same ApolloServer initialization as before, plus the drain plugin
  // for our httpServer.
  const server = new ApolloServer<Context>({
    typeDefs,
    resolvers,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      apolloLogger({}),
    ],
  });
  // Ensure we wait for our server to start
  await server.start();
  // Set up our Express middleware to handle CORS, body parsing,
  // and our expressMiddleware function.
  app.use(
    '/',
    cors<cors.CorsRequest>(),
    bodyParser.json(),
    // expressMiddleware accepts the same arguments:
    // an Apollo Server instance and optional configuration options
    expressMiddleware(server, {
      context: async ({ req }) => ({ token: req.headers.token }),
    }),
  );
  // Modified server startup

  await httpServer.listen({ port: PORT });
};

main();
