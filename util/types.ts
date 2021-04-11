export type Chocolate = {
  id: number;
  name: string;
  description: string;
  ingredients: string;
  allergens: string;
  imgPath: string;
  urlPath: string;
  price: string;
};

export type Order = {
  id: number;
  quantity: number;
};

export type User = {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  birthday: string;
  address: string;
  city: string;
  zipCode: string;
  phoneNumber: string;
  passwordHash: string;
  profileUrl: string;
};

export type Session = {
  id: number;
  token: string;
  userId: number;
};

export type CheckoutInfo = {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  zipCode: string;
  differentShippingLocation: boolean;
  shippingFirstName: string;
  shippingLastName: string;
  shippingAddress: string;
  shippingCity: string;
  shippingZipCode: string;
  email: string;
  phoneNumber: string;
};

export type RecentOrder = {
  id: number;
  orderInformation: Order[];
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  zipCode: string;
  shippingFirstName: string;
  shippingLastName: string;
  shippingAddress: string;
  shippingCity: string;
  shippingZipCode: string;
  email: string;
  phoneNumber: string;
  userId: number;
};
