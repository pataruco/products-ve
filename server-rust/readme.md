# Server Rust 🦀

## What is it?

Is my attempt to create a GraphQL server using `postgres_tokio` and create custom `postgres_types` that match [PostGis][postgis] [geography](https://postgis.net/docs/geography.html) types

## How to run it.

A PostgreSQL with [PostGis][postgis] is contanieraised in this repo.

Please, follow these steps:

- Open a termminal tab and on the root of this monorepo run

  ```sh
  docker compose build
  docker compose up
  ```

- Open another terminal tab and on `server-rust` folder run
  ```sh
  cargo build
  cargo run
  ```
- In your browser go to GraphQl playground http://localhost:8000/graphiql

[postgis]: https://postgis.net
