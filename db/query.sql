SELECT
  *
FROM
  stores
WHERE
  ST_DWithin(
    geog,
    -- London
    ST_GeographyFromText('POINT(-0.1275 51.50722)'),
    -- Metres
    10000
  );

SELECT
  -- Avoid duplicates
  DISTINCT ON (store_id) stores.geog,
  stores.name,
  stores.address,
  stores.created_at,
  stores.updated_at
FROM
  stores -- Many to many by joint table
  JOIN stores_products ON stores_products.products_product_id = (
    SELECT
      products.product_id
    FROM
      products
    WHERE
      reference = 'COCOSETTE'
  )
  JOIN products ON stores_products.stores_store_id = store_id
WHERE
  ST_DWithin (
    geog,
    -- LONDON
    ST_GeographyFromText ('POINT(-0.1275 51.50722)'),
    -- METRES
    10000
  );
