# Location exporter

## What is it

From a CSV with location name and address, is using Google Maps geocoding API to get latitude and longitude from address and then creating a SQL file with PostGIS coordinates

## How to run it

- Install dependencies
  ```sh
  pnpm i
  ```
- Create an `.env` file
  ```sh
  cat .env.example > .env
  ```
- Set the Google Maps geocoding API in the `.env` file
- Run the script to get coordinates
  ```sh
  pnpm get-coordinates
  ```
- Run the script to create a SQL file with all locations
  ```sh
  pnpm create-seed-file
  ```
