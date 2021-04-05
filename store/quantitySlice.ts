import { createSlice } from '@reduxjs/toolkit';

type QuantityState = {
  quantity: number;
};

const initialState: QuantityState = {
  quantity: 1,
};

const quantitySlice = createSlice({
  name: 'quantity',
  initialState,
  reducers: {
    increment: (state) => {
      state.quantity += 1;
    },
    decrement: (state) => {
      state.quantity -= 1;
    },
    reset: (state) => {
      state.quantity = 1;
    },
  },
});

export const quantityActions = quantitySlice.actions;
export default quantitySlice;
