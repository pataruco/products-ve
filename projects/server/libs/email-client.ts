import {
  FASTMAIL_API_TOKEN,
  FASTMAIL_API_USERNAME,
  WEB_CLIENT_HOST,
} from '../config';
import { createAuthHash, createTokenFromEmail } from './auth';

import logger, { Service } from './logger';

// from https://github.com/fastmail/JMAP-Samples/blob/main/javascript/hello-world.js

interface EmailClient {
  apiUrl: string;
  accountId: string;
  draftId: string;
  identityId: string;
  email: string;
  authHash: string;
}

const authUrl = 'https://api.fastmail.com/.well-known/jmap';
const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${FASTMAIL_API_TOKEN}`,
};

const getSession = async () => {
  const response = await fetch(authUrl, {
    method: 'GET',
    headers,
  });
  return response.json();
};

type QueryInput = Pick<EmailClient, 'apiUrl' | 'accountId'>;

const mailboxQuery = async ({ apiUrl, accountId }: QueryInput) => {
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      using: ['urn:ietf:params:jmap:core', 'urn:ietf:params:jmap:mail'],
      methodCalls: [
        ['Mailbox/query', { accountId, filter: { name: 'Drafts' } }, 'a'],
      ],
    }),
  });
  const data = await response.json();

  return await data['methodResponses'][0][1].ids[0];
};

const identityQuery = async ({ apiUrl, accountId }: QueryInput) => {
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      using: [
        'urn:ietf:params:jmap:core',
        'urn:ietf:params:jmap:mail',
        'urn:ietf:params:jmap:submission',
      ],
      methodCalls: [['Identity/get', { accountId, ids: null }, 'a']],
    }),
  });
  const data = await response.json();

  return data['methodResponses'][0][1].list
    .filter(
      (identity: Record<string, string>) =>
        identity.email === FASTMAIL_API_USERNAME,
    )
    .pop().id;
};

const getMessageBody = ({
  authHash,
  email,
}: Pick<EmailClient, 'authHash' | 'email'>) => {
  const queryParams = new URLSearchParams();
  queryParams.append('authHash', authHash);

  const url = new URL(`${WEB_CLIENT_HOST}/?${queryParams}`);

  return `
  Hola ${email}
  Para iniciar sesión, haz clic en esta direccion: ${url}?
  Saludos

  El Guacal
  `;
};

interface ComposeDraftParams {
  from?: string;
  to: string;
  draftId: string;
  messageBody: string;
}

const composeDraft = ({
  from,
  to,
  draftId,
  messageBody,
}: ComposeDraftParams) => ({
  from: [{ email: from }],
  to: [{ email: to }],
  subject: 'El Guacal: Inicio de sesión',
  keywords: { $draft: true },
  mailboxIds: { [draftId]: true },
  bodyValues: { body: { value: messageBody, charset: 'utf-8' } },
  textBody: [{ partId: 'body', type: 'text/plain' }],
});

const draftResponse = async ({
  accountId,
  apiUrl,
  draftId,
  email,
  identityId,
  authHash,
}: EmailClient) => {
  const draftObject = composeDraft({
    from: FASTMAIL_API_USERNAME,
    to: email,
    draftId,
    messageBody: getMessageBody({ email, authHash }),
  });

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        using: [
          'urn:ietf:params:jmap:core',
          'urn:ietf:params:jmap:mail',
          'urn:ietf:params:jmap:submission',
        ],
        methodCalls: [
          ['Email/set', { accountId, create: { draft: draftObject } }, 'a'],
          [
            'EmailSubmission/set',
            {
              accountId,
              onSuccessDestroyEmail: ['#sendIt'],
              create: { sendIt: { emailId: '#draft', identityId } },
            },
            'b',
          ],
        ],
      }),
    });

    if (response.ok) {
      logger.info({
        message: 'email with token auth hash',
        service: Service.SERVER,
      });
      return;
    }
  } catch (error) {
    throw error;
  }
};

type SendEmailWithTokenToParams = Pick<EmailClient, 'email' | 'authHash'>;

export const sendEmailWithAuthHash = async ({
  email,
  authHash,
}: SendEmailWithTokenToParams) => {
  const { apiUrl, primaryAccounts } = await getSession();

  const accountId = primaryAccounts['urn:ietf:params:jmap:mail'];

  const [draftId, identityId] = await Promise.all([
    mailboxQuery({ apiUrl, accountId }),
    identityQuery({ apiUrl, accountId }),
  ]);

  await draftResponse({
    apiUrl,
    accountId,
    draftId,
    identityId,
    email,
    authHash,
  });
};
