CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create table with spatial column
CREATE TABLE locations (
  location_id uuid DEFAULT uuid_generate_v4 (),
  geog GEOGRAPHY(Point) NOT NULL,
  name varchar(255) NOT NULL,
  address TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updatedd_at TIMESTAMPTZ NOT NULL DEFAULT current_timestamp,
  PRIMARY KEY (location_id)
);

-- Add a spatial index
CREATE INDEX locations_gix ON locations USING GIST (geog);
