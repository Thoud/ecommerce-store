export type Chocolate = {
  id: number;
  name: string;
  description: string;
  ingredients: string;
  allergens: string;
  imgPath: string;
  price: number;
};

export type Order = {
  id: number;
  quantity: number;
};
