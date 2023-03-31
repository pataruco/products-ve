import { getStoreById, getStoresFrom } from '../models/store';

const resolvers = {
  Query: {
    store: getStoreById,
    stores: getStoresFrom,
  },
};

export default resolvers;
