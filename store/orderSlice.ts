import { createSlice } from '@reduxjs/toolkit';
import { Order } from '../util/types';

type OrderState = {
  order: Order[];
};

const initialState: OrderState = {
  order: [],
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {},
});

export default orderSlice;
