import { query } from '../../db/index.js';

export const getStoreById = async (id: string) => {
  const { rows } = await query(`SELECT * from stores WHERE store_id = $1`, [
    id,
  ]);

  return rows[0];
};

// export const createStore = async ({ name, address, coordinates }: Store) => {
//   const { lat, lng } = coordinates;

//   const { rows } = await query(`SELECT * from stores WHERE store_id = $1`);
// };
