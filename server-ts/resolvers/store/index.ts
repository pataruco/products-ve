import { getStoreById } from '../../models/store/index.js';

const resolvers = {
  Query: {
    store: getStoreById,
  },
};

export default resolvers;
