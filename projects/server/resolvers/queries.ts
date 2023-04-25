import type { QueryResolvers } from '../__generated__/resolvers-types';
import { getStoreById, getStoresFrom } from '../models/store';

const queries: QueryResolvers = {
  Query: {
    store: getStoreById,
    stores: getStoresFrom,
  },
};

export default queries;
