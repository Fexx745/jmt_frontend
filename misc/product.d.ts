export type Product = {
  product_id: string,
  product_name: string,
  product_moo: string,
  product_type: string,
  product_mxp: string | Date,
  product_exp: string | Date,
  product_price: number,
  [key: string]: string | number | Date;
};
