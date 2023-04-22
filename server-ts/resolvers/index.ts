import { Resolvers } from '../__generated__/resolvers-types';
import mutations from './mutations';
import queries from './queries';

const resolvers: Resolvers = {
  ...queries,
  ...mutations,
};

export default resolvers;
