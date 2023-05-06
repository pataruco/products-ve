import { createSecretKey } from 'crypto';
import { SignJWT, jwtVerify } from 'jose-node-cjs-runtime';

import { JWT_SECRET } from '../config';

export const secretKey = createSecretKey(JWT_SECRET, 'utf-8');

export const createTokenFromEmail = async (email: string) => {
  const token = await new SignJWT({ email })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('90days')
    .sign(secretKey);

  return token;
};

export const verifyToken = async (token: string) => {
  try {
    await jwtVerify(token, secretKey);
    return true;
  } catch {
    return false;
  }
};

interface CreateAuthHashParams {
  email: string;
  token: string;
}

export const createAuthHash = ({ email, token }: CreateAuthHashParams) =>
  Buffer.from(
    JSON.stringify({
      email,
      token,
    }),
  ).toString('base64url');
