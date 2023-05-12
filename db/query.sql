-- Get stores within a radius from a point
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

-- Get stores within a radius from a point with products available as JSON array
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
  ) AS products
FROM
  stores
  JOIN stores_products ON stores_products.stores_store_id = stores.store_id
  JOIN products ON stores_products.products_product_id = products.product_id
WHERE
  ST_DWithin (
    geog,
    -- LONDON
    ST_GeographyFromText ('POINT(-0.1275 51.50722)'),
    -- METRES
    10000
  )
GROUP BY
  stores.store_id;

-- Get stores within a radius from a point and product name
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

-- Get store with products as JSON array
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

-- Select store by ID and returns an array of products
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
  ) AS products
FROM
  stores
  JOIN stores_products ON stores_products.stores_store_id = stores.store_id
  JOIN products ON stores_products.products_product_id = products.product_id
WHERE
  stores.store_id = '7956e435-df1b-465b-a052-6004ed14fe08'
GROUP BY
  stores.store_id;

-- Select all stores and return an array of products
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
  ) AS products
FROM
  stores
  JOIN stores_products ON stores_products.stores_store_id = stores.store_id
  JOIN products ON stores_products.products_product_id = products.product_id
GROUP BY
  stores.store_id;

-- 
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
  ) AS products
FROM
  stores
  JOIN stores_products ON stores_products.stores_store_id = stores.store_id
  JOIN products ON stores_products.products_product_id = products.product_id
WHERE
  products.reference = 'PAN'
  AND ST_DWithin (
    geog,
    -- LONDON
    ST_GeographyFromText ('POINT(-0.1275 51.50722)'),
    -- METRES
    5000
  )
GROUP BY
  stores.store_id;
