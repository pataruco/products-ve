import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: '../server/schema.graphql',
  // documents: ['src/**/*.tsx'],
  documents: ['src/api/operations.graphql'],
  generates: {
    './src/api/types.ts': {
      preset: 'import-types',
      plugins: ['typescript'],
      presetConfig: {
        typesPath: 'types.ts',
      },
    },
    './src/api/': {
      preset: 'near-operation-file',
      presetConfig: {
        extension: '.generated.tsx',
        baseTypesPath: 'types.ts',
      },
      plugins: ['typescript-react-apollo', 'typescript-operations'],
    },
  },
  ignoreNoDocuments: true,
};

export default config;
