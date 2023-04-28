// library for generating symmetric key for jwt
import { createSecretKey } from 'crypto';
// library for signing jwt
// import { SignJWT } from 'jose-node-cjs-runtime/jwt/sign';
// library for verifying jwt
// import { jwtVerify } from 'jose-node-cjs-runtime/jwt/verify';

import { JWT_SECRET } from '../config';
import { SignJWT, jwtVerify } from 'jose-node-cjs-runtime';

const secretKey = createSecretKey(JWT_SECRET, 'utf-8');

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
    const { payload } = await jwtVerify(token, secretKey);

    return true;
    // TODO: Something with the email
  } catch (e) {
    return false;
  }
};
