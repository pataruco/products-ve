import { setupWorker, rest } from 'msw';

export const handlers = [
  // Handles a POST /login request

  rest.post('/login', null),

  // Handles a GET /user request

  rest.get('/user', null),
];

describe('Email client', () => {
  describe('getSession', () => {});
});
