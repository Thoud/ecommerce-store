import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type UserState = {
  info: {
    username: string;
    firstName: string;
    lastName: string;
    password: string;
    reEnteredPassword: string;
    profileUrl: string;
    isSessionValid: boolean;
  };
};

type UserInfo = {
  username: string;
  firstName: string;
  lastName: string;
  profileUrl: string;
};

const initialState: UserState = {
  info: {
    username: '',
    firstName: '',
    lastName: '',
    password: '',
    reEnteredPassword: '',
    profileUrl: '',
    isSessionValid: false,
  },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<UserInfo>) => {
      state.info.username = action.payload.username;
      state.info.firstName = action.payload.firstName;
      state.info.lastName = action.payload.lastName;
      state.info.profileUrl = action.payload.profileUrl;
      state.info.isSessionValid = true;
    },
    changeUserName: (state, action: PayloadAction<string>) => {
      state.info.username = action.payload;
    },
    changeUserPassword: (state, action: PayloadAction<string>) => {
      state.info.password = action.payload;
    },
    changeReEnteredPassword: (state, action: PayloadAction<string>) => {
      state.info.reEnteredPassword = action.payload;
    },
    changeFirstName: (state, action: PayloadAction<string>) => {
      state.info.firstName = action.payload;
    },
    changeLastName: (state, action: PayloadAction<string>) => {
      state.info.lastName = action.payload;
    },
    changeIsSessionValid: (state, action: PayloadAction<boolean>) => {
      state.info.isSessionValid = action.payload;
    },
    resetUserInfo: (state) => {
      state.info.username = '';
      state.info.firstName = '';
      state.info.lastName = '';
      state.info.password = '';
      state.info.reEnteredPassword = '';
      state.info.profileUrl = '';
      state.info.isSessionValid = false;
    },
    unsetPasswords: (state) => {
      state.info.password = '';
      state.info.reEnteredPassword = '';
    },
  },
});

export const userSliceActions = userSlice.actions;
export default userSlice;
