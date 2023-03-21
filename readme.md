# Products 🇻🇪

## What is it ?

Is a proof of concept, utilising [PostGIS][postgis] plugin for [PostgreSQL][postgres] that enables querying locations by location.

## How to run it

We are using [docker compose](https://docs.docker.com/compose/) to easily spin services.

To run you must have Docker installed in your machine.

> **Note** you can download Colima (a container runtime for macOS) following these [instructions](https://github.com/abiosoft/colima#installation)

- Start Colima

  ```sh
  colima start
  ```

- From the root of the project
  ```sh
  docker compose build
  ```
- To run services

  ```sh
  docker compose up
  ```

- Once services are up and running you can stop it by pressing <kbd>ctrl</kbd> + <kbd>C</kbd>

- And to bring the services down
  ```sh
  docker compose down
  ```

[postgis]: http://postgis.net/
[postgres]: https://www.postgresql.org/
