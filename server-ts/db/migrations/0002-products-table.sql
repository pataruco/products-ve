CREATE TABLE products (
  product_id uuid PRIMARY KEY DEFAULT (uuid_generate_v4 ()),
  name varchar(255) NOT NULL,
  brand varchar(255),
  created_at timestamp NOT NULL DEFAULT (now()),
  updated timestamp NOT NULL DEFAULT (current_timestamp)
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
  products(name, brand)
VALUES
  ('Cocosette', 'Nestlé'),
  ('Harina P.A.N.', 'Alimentos Polar');

INSERT INTO
  stores_products (stores_store_id, products_product_id)
SELECT
  store_id,
  product_id
FROM
  stores,
  products
WHERE
  products.name = 'Harina P.A.N.';
