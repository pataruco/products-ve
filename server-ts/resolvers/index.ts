import { createStore, getStoreById, getStoresFrom } from '../models/store';

const resolvers = {
  Query: {
    store: getStoreById,
    stores: getStoresFrom,
  },
  Mutation: {
    store: createStore,
  },
};

export default resolvers;
