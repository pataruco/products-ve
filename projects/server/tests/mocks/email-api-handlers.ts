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

  rest.post(apiUrl, ({ headers, body }, res, ctx) => {
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `Bearer ${FASTMAIL_API_TOKEN}`);

    // @ts-ignore
    const method = body.methodCalls[0][0];

    switch (method) {
      // Mailbox
      case 'Mailbox/query':
        return res(
          ctx.status(200),
          ctx.json({
            methodResponses: [
              [
                'Mailbox/query',
                {
                  ids: ['draft-id'],
                },
              ],
            ],
          }),
        );
      case 'Identity/get':
        return res(
          ctx.status(200),
          ctx.json({
            methodResponses: [
              [
                'Identity/get',
                {
                  list: [
                    { email: 'darth.vader@empire.galaxy', id: 'order-66' },
                  ],
                },
              ],
            ],
          }),
        );

      case 'Email/set':
        return res(ctx.status(200));
    }
  }),
];
