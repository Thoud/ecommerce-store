import { createSlice } from '@reduxjs/toolkit';

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
    toggle: (state) => {
      state.open = !state.open;
    },
  },
});

export const addItemOverlayActions = addItemOverlaySlice.actions;
export default addItemOverlaySlice;
