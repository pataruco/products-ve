import type {
  ApolloServerPlugin,
  GraphQLRequestListener,
} from '@apollo/server';
import { Context } from '../types/context';
import logger from './logger';
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
  willSendResponse = true,
}: ApolloLoggerOptions): ApolloServerPlugin<Context> => ({
  async serverWillStart(_service) {
    logger.info(`Server started 📡: ${GRAPHQL_PATH}`);
  },

  async invalidRequestWasReceived({ error }) {
    logger.error(`Server invalidRequestWasReceived, Error: ${error.message}`);
  },

  async startupDidFail({ error }) {
    logger.error(`Server startupDidFail, Error: ${error.message}`);
  },

  async unexpectedErrorProcessingRequest({ requestContext, error }) {
    logger.error(
      `Server unexpectedErrorProcessingRequest : ${requestContext.request}, Error: ${error.message}`,
    );
  },

  async requestDidStart(_requestContext) {
    const start = Date.now();

    const handlers: GraphQLRequestListener<Context> = {
      async didEncounterErrors({ errors }) {
        didEncounterErrors && logger.error({ event: 'errors', errors });
      },

      async didResolveOperation({ metrics, operationName }) {
        didResolveOperation &&
          logger.info({
            event: 'didResolveOperation',
            metrics,
            operationName,
          });
      },

      async executionDidStart({ operationName }) {
        executionDidStart &&
          logger.info({
            event: 'executionDidStart',
            operationName,
          });
      },

      async parsingDidStart({ metrics }) {
        parsingDidStart && logger.info({ event: 'parsingDidStart', metrics });
      },

      async responseForOperation({ operationName }) {
        responseForOperation &&
          logger.info({
            event: 'responseForOperation',
            operationName,
          });
        return null;
      },

      async validationDidStart({ operationName }) {
        validationDidStart &&
          logger.info({ event: 'validationDidStart', operationName });
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
              event: 'request',
              operationName,
              variables: variables || {},
              duration,
            });
          }
        }
      },
    };
    return handlers;
  },
});

export default apolloLogger;
