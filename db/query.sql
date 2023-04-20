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
