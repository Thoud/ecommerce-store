import { configureStore } from '@reduxjs/toolkit';
import addItemOverlaySlice from './addItemOverlaySlice';
import errorMessageSlice from './errorMessageSlice';
import orderSlice from './orderSlice';
import profileOverlaySlice from './profileOverlaySlice';
import quantitySlice from './quantitySlice';
import userSlice from './userSlice';

const store = configureStore({
  reducer: {
    itemOverlay: addItemOverlaySlice.reducer,
    order: orderSlice.reducer,
    quantity: quantitySlice.reducer,
    user: userSlice.reducer,
    errorMessage: errorMessageSlice.reducer,
    profileOverlay: profileOverlaySlice.reducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
