import { inspect } from 'util';

// copy pasta from https://github.com/fastmail/JMAP-Samples/blob/main/javascript/hello-world.js

import { FASTMAIL_API_TOKEN, FASTMAIL_API_USERNAME } from '../config';

const token =
  'fmu1-83294004-0ebe9827420d3720bda313eb160935a7-0-6ca4f2bb3dbe0f1624054e01e42dd200';

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

const mailboxQuery = async (apiUrl: string, accountId: string) => {
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

const identityQuery = async (apiUrl: string, accountId: string) => {
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

const draftResponse = async (
  apiUrl: string,
  accountId: string,
  draftId: string,
  identityId: string,
) => {
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
    to: [{ email: FASTMAIL_API_USERNAME }],
    subject: 'Hello, world!',
    keywords: { $draft: true },
    mailboxIds: { [draftId]: true },
    bodyValues: { body: { value: messageBody, charset: 'utf-8' } },
    textBody: [{ partId: 'body', type: 'text/plain' }],
  };

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

  const data = await response.json();
  console.log(JSON.stringify(data, null, 2));
};

const main = async () => {
  const session = await getSession();

  const { apiUrl, primaryAccounts } = session;

  const accountId = primaryAccounts['urn:ietf:params:jmap:mail'];

  const draftId = await mailboxQuery(apiUrl, accountId);

  const identityId = await identityQuery(apiUrl, accountId);

  await draftResponse(apiUrl, accountId, draftId, identityId);
};

main();
