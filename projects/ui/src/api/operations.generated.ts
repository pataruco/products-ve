import * as Types from './types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;

export const StoresDocument = gql`
    query Stores($from: StoresFromInput!) {
  stores(from: $from) {
    id
    name
    address
    coordinates {
      lat
      lng
    }
  }
}
    `;

/**
 * __useStoresQuery__
 *
 * To run a query within a React component, call `useStoresQuery` and pass it any options that fit your needs.
 * When your component renders, `useStoresQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStoresQuery({
 *   variables: {
 *      from: // value for 'from'
 *   },
 * });
 */
export function useStoresQuery(baseOptions: Apollo.QueryHookOptions<StoresQuery, StoresQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<StoresQuery, StoresQueryVariables>(StoresDocument, options);
      }
export function useStoresLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<StoresQuery, StoresQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<StoresQuery, StoresQueryVariables>(StoresDocument, options);
        }
export type StoresQueryHookResult = ReturnType<typeof useStoresQuery>;
export type StoresLazyQueryHookResult = ReturnType<typeof useStoresLazyQuery>;
export type StoresQueryResult = Apollo.QueryResult<StoresQuery, StoresQueryVariables>;
export const StoreDocument = gql`
    query Store($storeId: String!) {
  store(id: $storeId) {
    name
    id
    address
    coordinates {
      lat
      lng
    }
    products {
      name
      id
    }
  }
}
    `;

/**
 * __useStoreQuery__
 *
 * To run a query within a React component, call `useStoreQuery` and pass it any options that fit your needs.
 * When your component renders, `useStoreQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStoreQuery({
 *   variables: {
 *      storeId: // value for 'storeId'
 *   },
 * });
 */
export function useStoreQuery(baseOptions: Apollo.QueryHookOptions<StoreQuery, StoreQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<StoreQuery, StoreQueryVariables>(StoreDocument, options);
      }
export function useStoreLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<StoreQuery, StoreQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<StoreQuery, StoreQueryVariables>(StoreDocument, options);
        }
export type StoreQueryHookResult = ReturnType<typeof useStoreQuery>;
export type StoreLazyQueryHookResult = ReturnType<typeof useStoreLazyQuery>;
export type StoreQueryResult = Apollo.QueryResult<StoreQuery, StoreQueryVariables>;
export type StoresQueryVariables = Types.Exact<{
  from: Types.StoresFromInput;
}>;


export type StoresQuery = { __typename?: 'Query', stores?: Array<{ __typename?: 'Store', id?: string | null, name?: string | null, address?: string | null, coordinates?: { __typename?: 'Coordinates', lat?: number | null, lng?: number | null } | null } | null> | null };

export type StoreQueryVariables = Types.Exact<{
  storeId: Types.Scalars['String'];
}>;


export type StoreQuery = { __typename?: 'Query', store?: { __typename?: 'Store', name?: string | null, id?: string | null, address?: string | null, coordinates?: { __typename?: 'Coordinates', lat?: number | null, lng?: number | null } | null, products?: Array<{ __typename?: 'Product', name: Types.ProductName, id?: string | null }> | null } | null };
