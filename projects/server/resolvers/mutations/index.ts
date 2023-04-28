import { MutationResolvers } from '../../__generated__/resolvers-types';
import { createStore } from '../../models/store/create-store';
import { sendAuthEmail } from './send-auth-email';

const mutations: MutationResolvers = {
  Mutation: {
    store: createStore,
    sendAuthEmail,
  },
};

export default mutations;
