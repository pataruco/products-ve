# Database

## Connection

Connection is managed by [`index.ts`](./index.ts) file and is exporting a `query` method to handle queries by models

## Migrations

Migrations are set by an ordered named convention `*.sql` files inside [`./migrations`](./migrations/) folder.

We created a migration command in the [package.json](../../package.json) called `migrate`.

We are using [postgres-migrations](https://github.com/thomwright/postgres-migrations) library to run it

```sh
pnpm migrate
```

## Modeling

To better understand data modelling we are using [**Database markup language (DBML)**](https://www.dbml.org/home/#intro)

Database model definition is defined in [`schema.dbml`](db-file) file.

To see a visual representation you can go to https://dbdiagram.io/ and paste the contents of [`schema.dbml`](db-file)

[`db-file`]: ./schema.dbml

## Current schema 03/04/2023

![schema](./schema.png)
