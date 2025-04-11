export type Stock = {
  stock_id: string,
  stock_inventories: number,
  stock_productall: number,
  stock_productname: string,
  [key: string]: string | undefined | number;
};
