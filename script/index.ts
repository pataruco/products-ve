import { readFile } from 'node:fs/promises';

const main = async () => {
  try {
    const filePath = new URL('./locations.csv', import.meta.url);
    const contents = await readFile(filePath, { encoding: 'utf8' });
    console.log(contents);
  } catch (error) {
    console.error((error as Error).message);
  }
};

main();
