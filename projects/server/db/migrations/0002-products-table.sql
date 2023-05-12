CREATE TABLE products (
  product_id uuid PRIMARY KEY DEFAULT (uuid_generate_v4 ()),
  name varchar(255) NOT NULL,
  reference varchar(255) NOT NULL UNIQUE,
  brand varchar(255),
  created_at timestamp NOT NULL DEFAULT (now()),
  updated_at timestamp NOT NULL DEFAULT (current_timestamp)
);

COMMENT ON TABLE stores IS 'Stores stores locations';

CREATE TABLE stores_products (
  stores_store_id uuid,
  products_product_id uuid,
  PRIMARY KEY (stores_store_id, products_product_id)
);

ALTER TABLE
  stores_products
ADD
  FOREIGN KEY (stores_store_id) REFERENCES stores (store_id);

ALTER TABLE
  stores_products
ADD
  FOREIGN KEY (products_product_id) REFERENCES products (product_id);

INSERT INTO
  products(name, brand, reference)
VALUES
  ('Cocosette', 'Nestlé', 'COCOSETTE'),
  ('Harina P.A.N.', 'Alimentos Polar', 'PAN');

-- Insert Harina PAN in all
INSERT INTO
  stores_products (stores_store_id, products_product_id)
SELECT
  store_id,
  product_id
FROM
  stores,
  products
WHERE
  products.reference = 'PAN';

-- Insert Cocosette in just few
INSERT INTO
  stores_products (stores_store_id, products_product_id)
SELECT
  store_id,
  product_id
FROM
  stores,
  products
WHERE
  products.reference = 'COCOSETTE'
  AND ST_DWithin(
    stores.geog,
    -- London
    ST_GeographyFromText('POINT(-0.1275 51.50722)'),
    -- Metres
    3000
  );
