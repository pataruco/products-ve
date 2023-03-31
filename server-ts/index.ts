import { ApolloServer } from '@apollo/server';
import { readFileSync } from 'fs';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import { StoreTypeDef } from './types/store';
import resolvers from './resolvers';
import gql from 'graphql-tag';

interface MyContext {
  token?: string;
}

// Required logic for integrating with Express
const app = express();
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
  const server = new ApolloServer<MyContext>({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
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

  await httpServer.listen({ port: 4000 });
  console.log(`🚀 Server ready at http://localhost:4000/`);
};

main();
