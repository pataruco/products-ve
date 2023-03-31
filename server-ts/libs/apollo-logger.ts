import type {
  ApolloServerPlugin,
  GraphQLRequestListener,
} from '@apollo/server';

import { GRAPHQL_PATH } from '../config';
import { Context } from '../types/context';
import logger, { Service } from './logger';

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
  willSendResponse = true,
}: ApolloLoggerOptions): ApolloServerPlugin<Context> => ({
  async serverWillStart(_service) {
    logger.info({
      message: `Server started 📡: ${GRAPHQL_PATH}`,
      service: Service.SERVER,
    });
  },

  async invalidRequestWasReceived({ error }) {
    logger.error({
      error,
      message: 'invalidRequestWasReceived',
      service: Service.SERVER,
    });
  },

  async startupDidFail({ error }) {
    logger.error({
      error,
      message: 'startupDidFail',
      service: Service.SERVER,
    });
  },

  async unexpectedErrorProcessingRequest({ error }) {
    logger.error({
      error,
      message: 'unexpectedErrorProcessingRequest',
      service: Service.SERVER,
    });
  },

  async requestDidStart(_requestContext) {
    const start = Date.now();

    const handlers: GraphQLRequestListener<Context> = {
      async didEncounterErrors({ errors }) {
        didEncounterErrors &&
          logger.error({ event: 'errors', errors, service: Service.SERVER });
      },

      async didResolveOperation({ metrics, operationName }) {
        didResolveOperation &&
          logger.info({
            event: 'didResolveOperation',
            message: 'graphql-query',
            metrics,
            operationName,
            service: Service.SERVER,
          });
      },

      async executionDidStart({ operationName }) {
        executionDidStart &&
          logger.info({
            event: 'executionDidStart',
            message: 'graphql-query',
            operationName,
            service: Service.SERVER,
          });
      },

      async parsingDidStart({ operationName }) {
        parsingDidStart &&
          logger.info({
            event: 'parsingDidStart',
            message: 'graphql-query',
            operationName,
            service: Service.SERVER,
          });
      },

      async responseForOperation({ operationName }) {
        responseForOperation &&
          logger.info({
            event: 'responseForOperation',
            message: 'graphql-query',
            operationName,
            service: Service.SERVER,
          });
        return null;
      },

      async validationDidStart({ operationName }) {
        validationDidStart &&
          logger.info({
            event: 'validationDidStart',
            message: 'graphql-query',
            operationName,
            service: Service.SERVER,
          });
      },

      async willSendResponse(requestContext) {
        const duration = Date.now() - start;
        if (willSendResponse) {
          const ignore = ignoredOps.includes(
            requestContext.operationName || '',
          );
          if (!ignore) {
            const {
              operationName,
              request: { variables },
            } = requestContext;

            logger.info({
              duration,
              event: 'request',
              message: 'graphql-query',
              operationName,
              service: Service.SERVER,
              variables: variables || {},
            });
          }
        }
      },
    };
    return handlers;
  },
});

export default apolloLogger;
