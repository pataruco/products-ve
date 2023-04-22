import { MutationResolvers } from '../__generated__/resolvers-types';
import { createStore } from '../models/store';

const mutations: MutationResolvers = {
  Mutation: {
    store: createStore,
  },
};

export default mutations;
