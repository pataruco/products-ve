import { MutationResolvers } from '../__generated__/resolvers-types';
import { createStore } from '../models/store/create-store';

const mutations: MutationResolvers = {
  Mutation: {
    store: createStore,
  },
};

export default mutations;
