import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import { changeOrder, removeItemFromOrder } from '../util/cookies';
import { Order } from '../util/types';

type ChangeItemAction = {
  chocolateId: number;
  quantity: number;
};

const cookie = Cookies.get('order');
const parsedCookie: Order[] = cookie ? JSON.parse(cookie) : [];

const initialState = {
  order: parsedCookie,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    changeItem: (state, action: PayloadAction<ChangeItemAction>) => {
      state.order = changeOrder(
        state.order,
        action.payload.chocolateId,
        action.payload.quantity,
      );
      Cookies.set('order', state.order, { expires: 7 });
    },
    removeItem: (state, action: PayloadAction<number>) => {
      state.order = removeItemFromOrder(state.order, action.payload);
      Cookies.set('order', state.order, { expires: 7 });
    },
    placeOrder: (state) => {
      state.order = [];
      Cookies.remove('order');
    },
  },
});

export const orderSliceActions = orderSlice.actions;
export default orderSlice;
