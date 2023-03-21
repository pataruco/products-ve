import { readFile, writeFile } from 'node:fs/promises';

interface Location {
  name: string;
  address: string;
}

interface GeoCoding {
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

interface GeoCodingResults {
  results: GeoCoding[];
}

export interface LocationWithCoordinates extends Location {
  lat: number;
  lng: number;
}

const API_KEY = process.env.API_KEY ?? '';

const getFileContents = async () => {
  try {
    const filePath = new URL('./locations.csv', import.meta.url);
    return readFile(filePath, { encoding: 'utf8' });
  } catch (error) {
    throw error;
  }
};

const getLocationAddress = (
  contents: string | undefined,
): Location[] | undefined => {
  const contentByLine = contents?.split('\n');
  const locations = contentByLine?.map((line) => {
    const [name, ...address] = line.split(',');
    return {
      name,
      address: address.join(','),
    };
  });

  locations?.pop();
  locations?.shift();
  return locations;
};

const getLocationsWithCoordinates = async (locations: Location[]) => {
  try {
    const locationsWithCoordinates = await Promise.all(
      locations.map(async (location) => {
        const addressFormatted = location.address
          .split(',')
          .join('+,')
          .split(' ')
          .join('+');

        // console.log({ location, addressFormatted });

        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${addressFormatted}&key=${API_KEY}`,
        );

        const { results }: GeoCodingResults = await response.json();

        const [result] = results;

        if (result) {
          const {
            geometry: {
              location: { lat, lng },
            },
          } = result;

          return { ...location, lat, lng };
        }
      }),
    );

    return locationsWithCoordinates;
  } catch (error) {
    throw error;
  }
};

const createJsonFrom = async (
  allLocations: (LocationWithCoordinates | undefined)[],
) => {
  try {
    const filePath = new URL('./locations.json', import.meta.url);
    await writeFile(filePath, JSON.stringify(allLocations), {
      encoding: 'utf8',
    });
  } catch (err) {
    throw err;
  }
};

const main = async () => {
  try {
    const contents = await getFileContents();
    const locations = getLocationAddress(contents);
    if (locations) {
      const locationsWithCoordinates = await getLocationsWithCoordinates(
        locations,
      );

      const allLocations: (LocationWithCoordinates | undefined)[] =
        locationsWithCoordinates.filter((location) => location !== undefined);

      await createJsonFrom(allLocations);
    }
  } catch (error) {
    console.error((error as Error).message);
  }
};

main();
