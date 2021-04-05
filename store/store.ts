import { configureStore } from '@reduxjs/toolkit';
import addItemOverlaySlice from './addItemOverlaySlice';

const store = configureStore({
  reducer: {
    addItemOverlay: addItemOverlaySlice.reducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
