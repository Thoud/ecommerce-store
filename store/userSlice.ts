import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type UserState = {
  name: string;
  password: string;
};

const initialState: UserState = {
  name: '',
  password: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    changeUserName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    changeUserPassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
    },
  },
});

export const userSliceActions = userSlice.actions;
export default userSlice;
