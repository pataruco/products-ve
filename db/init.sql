CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create table with spatial column
CREATE TABLE locations (
  location_id uuid DEFAULT uuid_generate_v4 (),
  geom GEOMETRY(Point, 4326) NOT NULL,
  name varchar(255) NOT NULL,
  address TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updatedd_at TIMESTAMPTZ NOT NULL DEFAULT current_timestamp,
  PRIMARY KEY (location_id)
);

-- Add a spatial index
CREATE INDEX locations_gix ON locations USING GIST (geom);

-- Seed
INSERT INTO
  locations (geom, name, address)
VALUES
  (
    ST_GeomFromText('POINT(51.4621946 -0.1140153)', 4326),
    'Brixton Market',
    'Electric Avenue Brixton,
London SW9 8JX'
  );
