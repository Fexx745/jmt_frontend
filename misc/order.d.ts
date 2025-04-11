export type Order = {
  order_id: string,
  order_name: string,
  order_price: number,
  order_date: string | Date,
  order_amount: number,
  order_detail: string,
  [key: string]: string | number | undefined | Date;
};
