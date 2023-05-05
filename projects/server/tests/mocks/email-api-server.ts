import { handlers } from './email-api-handlers';
import { setupServer } from 'msw/node';

export const emailApiServer = setupServer(...handlers);
