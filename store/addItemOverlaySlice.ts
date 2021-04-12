import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type AddItemOverlayState = {
  open: boolean;
};

const initialState: AddItemOverlayState = {
  open: false,
};

const addItemOverlaySlice = createSlice({
  name: 'itemOverlay',
  initialState,
  reducers: {
    toggle: (state, action: PayloadAction<boolean>) => {
      state.open = action.payload;
    },
  },
});

export const addItemOverlayActions = addItemOverlaySlice.actions;
export default addItemOverlaySlice;
