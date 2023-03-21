import { writeFile } from 'node:fs/promises';

import allLocations from './locations.json' assert { type: 'json' };
import type { LocationWithCoordinates } from './get-locations';

let seedTemplate = `
INSERT INTO
  locations (geog, name, address)
VALUES
`;

const main = async () => {
  allLocations.forEach(
    (
      { address, name, lat, lng }: LocationWithCoordinates,
      index,
      { length },
    ) => {
      const endOfTheline = index + 1 === length ? ';' : ',';

      const value = `(ST_GeographyFromText('POINT(${lng} ${lat})'), '${name}', '${address}')${endOfTheline}`;

      seedTemplate = seedTemplate + value;
    },
  );

  try {
    const filePath = new URL('../db/seed.sql', import.meta.url);
    await writeFile(filePath, seedTemplate, {
      encoding: 'utf8',
    });
  } catch (err) {
    throw err;
  }
};

main();
