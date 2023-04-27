import type { QueryResolvers } from '../__generated__/resolvers-types';
import { getStoreById } from '../models/store/get-store-by-id';
import { getStoresFrom } from '../models/store/get-stores-from';

const queries: QueryResolvers = {
  Query: {
    store: getStoreById,
    stores: getStoresFrom,
  },
};

export default queries;
