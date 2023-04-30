import {
  FASTMAIL_API_TOKEN,
  FASTMAIL_API_USERNAME,
  WEB_CLIENT_HOST,
} from '../config';
import logger, { Service } from './logger';

// copy pasta from https://github.com/fastmail/JMAP-Samples/blob/main/javascript/hello-world.js

interface EmailClient {
  apiUrl: string;
  accountId: string;
  draftId: string;
  identityId: string;
  email: string;
  token: string;
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

const getMessageBody = (token: string) => {
  const queryParams = new URLSearchParams();
  queryParams.append('token', token);

  const url = new URL(`/?${queryParams}`, WEB_CLIENT_HOST);
  `Puede hacer login en esta direccion: ${url}?`;
};

const draftResponse = async ({
  accountId,
  apiUrl,
  draftId,
  email,
  identityId,
  token,
}: EmailClient) => {
  const messageBody =
    'Hi! \n\n' +
    'This email may not look like much, but I sent it with JMAP, a protocol \n' +
    'designed to make it easier to manage email, contacts, calendars, and more of \n' +
    'your digital life in general. \n\n' +
    'Pretty cool, right? \n\n' +
    '-- \n' +
    'This email sent from my next-generation email system at Fastmail. \n';

  const draftObject = {
    from: [{ email: FASTMAIL_API_USERNAME }],
    to: [{ email }],
    subject: 'Hello, world!',
    keywords: { $draft: true },
    mailboxIds: { [draftId]: true },
    bodyValues: { body: { value: messageBody, charset: 'utf-8' } },
    textBody: [{ partId: 'body', type: 'text/plain' }],
  };

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
        message: 'email with token sent',
        service: Service.SERVER,
      });
      return;
    }
  } catch (error) {
    throw error;
  }
};

type SendEmailWithTokenToParams = Pick<EmailClient, 'email' | 'token'>;

export const sendEmailWithAuthHash = async ({
  email,
  token,
}: SendEmailWithTokenToParams) => {
  const { apiUrl, primaryAccounts } = await getSession();

  const accountId = primaryAccounts['urn:ietf:params:jmap:mail'];

  const [draftId, identityId] = await Promise.all([
    mailboxQuery({ apiUrl, accountId }),
    identityQuery({ apiUrl, accountId }),
  ]);

  await draftResponse({ apiUrl, accountId, draftId, identityId, email, token });
};
