import { createSecretKey } from 'crypto';
import { SignJWT, jwtVerify } from 'jose-node-cjs-runtime';

import { JWT_SECRET } from '../config';

export const secretKey = createSecretKey(JWT_SECRET, 'utf-8');

export const getTokenFromEmail = async (email: string) => {
  const token = await new SignJWT({ email })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('90days')
    .sign(secretKey);

  return token;
};

export const verifyToken = async (token: string) => {
  try {
    // verify token
    // TODO: Something with the email
    // const { payload } = await jwtVerify(token, secretKey);
    await jwtVerify(token, secretKey);
    return true;
  } catch {
    return false;
  }
};
