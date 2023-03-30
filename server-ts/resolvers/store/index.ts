import { getStoreById } from '../../models/store';

const resolvers = {
  Query: {
    store: getStoreById,
  },
};

export default resolvers;
