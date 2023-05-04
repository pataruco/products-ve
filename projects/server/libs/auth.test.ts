import { jwtVerify } from 'jose-node-cjs-runtime';

import {
  createAuthHash,
  createTokenFromEmail,
  secretKey,
  verifyToken,
} from './auth';

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

  describe('createAuthHash', () => {
    it('create auth hash containing email and token', async () => {
      const token = await createTokenFromEmail(email);

      const authHash = createAuthHash({ email, token });

      expect(authHash).toBe(
        Buffer.from(
          JSON.stringify({
            email,
            token,
          }),
        ).toString('base64url'),
      );

      const hashObject = JSON.parse(
        Buffer.from(authHash, 'base64').toString('utf8'),
      );

      expect(hashObject.token).toBe(token);
      expect(hashObject.email).toBe(email);
    });
  });
});
