export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Coordinates = {
  __typename?: 'Coordinates';
  lat?: Maybe<Scalars['Float']>;
  lng?: Maybe<Scalars['Float']>;
};

export type CoordinatesInput = {
  lat?: InputMaybe<Scalars['Float']>;
  lng?: InputMaybe<Scalars['Float']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  sendAuthEmail?: Maybe<Scalars['String']>;
  store?: Maybe<Store>;
};

export type MutationSendAuthEmailArgs = {
  email: Scalars['String'];
};

export type MutationStoreArgs = {
  store: StoreInput;
};

export type Product = {
  __typename?: 'Product';
  brand: Scalars['String'];
  createdAt?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  name: ProductName;
  updatedAt?: Maybe<Scalars['String']>;
};

export enum ProductName {
  Cocosette = 'COCOSETTE',
  Pan = 'PAN',
}

export type Query = {
  __typename?: 'Query';
  store?: Maybe<Store>;
  stores?: Maybe<Array<Maybe<Store>>>;
};

export type QueryStoreArgs = {
  id: Scalars['String'];
};

export type QueryStoresArgs = {
  from: StoresFromInput;
};

export type Store = {
  __typename?: 'Store';
  address?: Maybe<Scalars['String']>;
  coordinates?: Maybe<Coordinates>;
  createdAt?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  name?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['String']>;
};

export type StoreInput = {
  address?: InputMaybe<Scalars['String']>;
  coordinates: CoordinatesInput;
  name: Scalars['String'];
};

export type StoresFromInput = {
  coordinates: CoordinatesInput;
  distance: Scalars['Int'];
  product?: InputMaybe<ProductName>;
};
