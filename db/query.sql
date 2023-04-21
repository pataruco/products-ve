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
  *
FROM
  stores -- Product
  JOIN products ON products.product_id = (
    SELECT
      products.product_id
    FROM
      products
    WHERE
      name = 'Cocosette'
  )
WHERE
  ST_DWithin (
    geog,
    -- London
    ST_GeographyFromText ('POINT(-0.1275 51.50722)'),
    -- Metres
    3000
  );

SELECT
  *
FROM
  stores -- Product
  JOIN stores_products ON stores_products.products_product_id = (
    SELECT
      products.product_id
    FROM
      products
    WHERE
      reference = 'COCOSETTE'
  )
WHERE
  ST_DWithin (
    geog,
    -- London
    ST_GeographyFromText ('POINT(-0.1275 51.50722)'),
    -- Metres
    3000
  );

---
SELECT
  DISTINCT ON (store_id) *
FROM
  stores -- Product
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
    -- London
    ST_GeographyFromText ('POINT(-0.1275 51.50722)'),
    -- Metres
    10000
  );
