import { createSlice } from '@reduxjs/toolkit';

type ProfileOverlayState = {
  open: boolean;
};

const initialState: ProfileOverlayState = {
  open: false,
};

const profileOverlaySlice = createSlice({
  name: 'profileOverlay',
  initialState,
  reducers: {
    toggle: (state) => {
      state.open = !state.open;
    },
  },
});

export const profileOverlayActions = profileOverlaySlice.actions;
export default profileOverlaySlice;
