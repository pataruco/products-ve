import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: '../server/schema.graphql',
  documents: ['src/api/operations.graphql'],
  generates: {
    './src/api/types.generated.ts': {
      preset: 'import-types',
      plugins: ['typescript'],
      presetConfig: {
        typesPath: 'types.generated.ts',
      },
    },
    './src/api/': {
      preset: 'near-operation-file',
      presetConfig: {
        extension: '.generated.ts',
        baseTypesPath: 'types.generated.ts',
      },
      plugins: ['typescript-react-apollo', 'typescript-operations'],
    },
  },
  ignoreNoDocuments: true,
};

export default config;
