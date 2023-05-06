import { GraphQLError } from 'graphql';
import Joi from 'joi';

import { MutationSendAuthEmailArgs } from '../../__generated__/resolvers-types';
import { createAuthHash, createTokenFromEmail } from '../../libs/auth';
import { sendEmailWithAuthHash } from '../../libs/email-client';

const sendAuthEmailSchema = Joi.string().email().required();

export const sendAuthEmail = async (
  _parent: unknown,
  { email }: MutationSendAuthEmailArgs,
) => {
  const { error } = sendAuthEmailSchema.validate(email);

  if (error) {
    throw new GraphQLError('Failed to send email due to validation errors', {
      originalError: error,
      extensions: {
        code: 'VALIDATION_ERROR',
      },
    });
  }

  try {
    const token = await createTokenFromEmail(email);
    const authHash = createAuthHash({ email, token });
    await sendEmailWithAuthHash({
      email,
      authHash,
    });
    return `Email sent to: ${email}`;
  } catch (error) {
    throw new GraphQLError('Failed to send email.', {
      originalError: error as unknown as Error,
    });
  }
};
