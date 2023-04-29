import { jwtVerify } from 'jose-node-cjs-runtime';

import { createTokenFromEmail, secretKey, verifyToken } from './auth';

describe('Auth', () => {
  const email = 'luke@rebel-alliance.galaxy';

  describe('createTokenFromEmail', () => {
    it('create a valid taken from an email', async () => {
      const token = await createTokenFromEmail(email);
      const { payload } = await jwtVerify(token, secretKey);
      expect(payload.email).toBe(email);
    });
  });

  describe('verifyToken', () => {
    it('return false when token is invalid', async () => {
      const token = 'in-a-galaxy-far-far-away';
      const isAValidToken = await verifyToken(token);
      expect(isAValidToken).toBeFalsy();
    });

    it('return true when token is valid', async () => {
      const token = await createTokenFromEmail(email);
      const isAValidToken = await verifyToken(token);
      expect(isAValidToken).toBeTruthy();
    });
  });
});
