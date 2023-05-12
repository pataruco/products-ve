import { ProductName } from '../api/types.generated';

const productsMap = {
  [ProductName.Cocosette]: 'Cocosette',
  [ProductName.Pan]: 'Harina P.A.N.',
};

export const getProductName = (productRefence: ProductName) =>
  productsMap[productRefence];
