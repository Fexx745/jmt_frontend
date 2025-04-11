export type Promotion = {
  promotion_id: string;
  promotion_name: string;
  promotion_date: string | Date;
  promotion_end: string | Date;
  promotion_condition: string;
  promotion_description: string;
  [key: string]: string | Date | undefined;
};
