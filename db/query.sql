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

-- Get stores within a radius from a point with products available as an array
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
      products.reference,
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

-- Get stores within a radius from a point where product is with products available as an array
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
      products.reference,
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
  products.reference = '<PRODUCT REFERENCE>' ST_DWithin (
    geog,
    -- LONDON
    ST_GeographyFromText ('POINT(-0.1275 51.50722)'),
    -- METRES
    10000
  )
GROUP BY
  stores.store_id;

-- Get store by ID with an array of products available
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
      products.reference,
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
  stores.store_id = '<STORE ID>'
GROUP BY
  stores.store_id
