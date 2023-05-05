import { rest } from 'msw';

import { FASTMAIL_API_TOKEN } from '../../config';

const apiUrl = 'https://api.fastmail.com/jmap/api/';

export const handlers = [
  // Get Session
  rest.get(
    'https://api.fastmail.com/.well-known/jmap',
    ({ headers }, res, ctx) => {
      headers.append('Content-Type', 'application/json');
      headers.append('Authorization', `Bearer ${FASTMAIL_API_TOKEN}`);

      return res(
        ctx.status(200),
        ctx.json({
          primaryAccounts: {
            'urn:ietf:params:jmap:mail': 'xxxx',
            'urn:ietf:params:jmap:submission': 'xxxx',
            'urn:ietf:params:jmap:core': 'xxxx',
          },
          apiUrl,
        }),
      );
    },
  ),

  // Mailbox
  rest.post(apiUrl, ({ headers }, res, ctx) => {
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `Bearer ${FASTMAIL_API_TOKEN}`);

    return res(
      ctx.status(200),
      ctx.json({
        methodResponses: [
          [
            'Mailbox/query',
            {
              filter: { name: 'Drafts' },
              canCalculateChanges: true,
              queryState: '17',
              total: 1,
              position: 0,
              accountId: 'xxxx',
              ids: ['draft-id'],
            },
            'a',
          ],
        ],
      }),
    );
  }),
];
