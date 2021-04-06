import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ErrorMessageState = {
  message: string;
};

const initialState: ErrorMessageState = {
  message: '',
};

const errorMessageSlice = createSlice({
  name: 'errorMessage',
  initialState,
  reducers: {
    addErrorMessage: (state, action: PayloadAction<string>) => {
      state.message = action.payload;
    },
  },
});

export const errorMessageActions = errorMessageSlice.actions;
export default errorMessageSlice;
