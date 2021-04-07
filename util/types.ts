export type Chocolate = {
  id: number;
  name: string;
  description: string;
  ingredients: string;
  allergens: string;
  imgPath: string;
  price: string;
};

export type Order = {
  id: number;
  quantity: number;
};

export type User = {
  id: number;
  username: string;
  passwordHash: string;
};

export type Session = {
  id: number;
  token: string;
  userId: number;
};
