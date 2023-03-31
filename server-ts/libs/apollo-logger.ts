import type {
  ApolloServerPlugin,
  GraphQLRequestListener,
} from '@apollo/server';
import { Context } from '../types/context';
import logger, { Tag } from './logger';
import { GRAPHQL_PATH } from '../config';

const ignoredOps = ['IntrospectionQuery'];

interface ApolloLoggerOptions {
  didEncounterErrors?: boolean;
  didResolveOperation?: boolean;
  executionDidStart?: boolean;
  parsingDidStart?: boolean;
  responseForOperation?: boolean;
  validationDidStart?: boolean;
  willSendResponse?: boolean;
}

const apolloLogger = ({
  didEncounterErrors = false,
  didResolveOperation = false,
  executionDidStart = false,
  parsingDidStart = false,
  responseForOperation = false,
  validationDidStart = false,
  willSendResponse = false,
}: ApolloLoggerOptions): ApolloServerPlugin<Context> => ({
  async serverWillStart(_service) {
    logger.info({
      message: `Server started 📡: ${GRAPHQL_PATH}`,
      label: Tag.SERVER,
    });
  },

  async unexpectedErrorProcessingRequest({ requestContext, error }) {
    logger.error(
      `Server unexpectedErrorProcessingRequest : ${requestContext.request}, Error: ${error.message}`,
    );
  },

  // async requestDidStart(requestContext) {
  //   const ignore = ignoredOps.includes(requestContext.operationName || '');
  //   if (!ignore) {
  //     const query = requestContext.request.query?.replace(/\n/g, '');
  //     const variables = Object.keys(requestContext.request.variables || {});
  //     logger.info({
  //       event: 'request',
  //       operationName: requestContext.operationName,
  //       query,
  //       variables,
  //     });
  //   }
  //   const handlers: GraphQLRequestListener<Context> = {
  //     async didEncounterErrors({ errors }) {
  //       didEncounterErrors && logger.error({ event: 'errors', errors });
  //     },

  //     async didResolveOperation({ metrics, operationName }) {
  //       didResolveOperation &&
  //         logger.info({
  //           event: 'didResolveOperation',
  //           metrics,
  //           operationName,
  //         });
  //     },

  //     async executionDidStart({ metrics }) {
  //       executionDidStart &&
  //         logger.info({
  //           event: 'executionDidStart',
  //           metrics,
  //         });
  //     },

  //     async parsingDidStart({ metrics }) {
  //       parsingDidStart && logger.info({ event: 'parsingDidStart', metrics });
  //     },

  //     async responseForOperation({ metrics, operationName }) {
  //       responseForOperation &&
  //         logger.info({
  //           event: 'responseForOperation',
  //           metrics,
  //           operationName,
  //         });
  //       return null;
  //     },

  //     async validationDidStart({ metrics }) {
  //       validationDidStart && logger.info({ event: '', metrics });
  //     },

  //     async willSendResponse({ metrics, response }) {
  //       willSendResponse &&
  //         logger.info({
  //           event: 'response',
  //           metrics,
  //           response,
  //         });
  //     },
  //   };
  //   return handlers;
  // },
});

export default apolloLogger;
