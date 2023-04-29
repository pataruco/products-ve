import { GraphQLError } from 'graphql';
import Joi from 'joi';

import { createAuthHash, createTokenFromEmail } from '../../libs/auth';

const sendAuthEmailSchema = Joi.string().email().required();

export const sendAuthEmail = async (email: string) => {
  const { error } = sendAuthEmailSchema.validate(email);

  if (error) {
    throw new GraphQLError('Failed to send email due to validation errors', {
      originalError: error,
      extensions: {
        code: 'VALIDATION_ERROR',
      },
    });
  }

  // TODO: send email with token
  try {
    const token = await createTokenFromEmail(email);
    const authHash = createAuthHash({ email, token });
  } catch (error) {}
};
