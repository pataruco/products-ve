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

-- Get stores with products as JSON array
SELECT
  stores.store_id,
  stores.name,
  stores.address,
  stores.geog,
  stores.created_at,
  stores.updated_at,
  ARRAY_AGG(
    JSON_BUILD_OBJECT(
      'name',
      products.name,
      'id',
      products.product_id,
      'brand',
      products.brand,
      'createdAt',
      products.created_at,
      'updatedAt',
      products.updated
    )
  ) products
FROM
  stores
  JOIN stores_products ON stores_products.stores_store_id = '<STORE_ID>'
  JOIN products ON stores_products.stores_store_id = '<STORE_ID>'
WHERE
  stores.store_id = '<STORE_ID>'
GROUP BY
  stores.store_id;
