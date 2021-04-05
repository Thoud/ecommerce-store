import { configureStore } from '@reduxjs/toolkit';
import addItemOverlaySlice from './addItemOverlaySlice';
import orderSlice from './orderSlice';

const store = configureStore({
  reducer: {
    addItemOverlay: addItemOverlaySlice.reducer,
    order: orderSlice.reducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
