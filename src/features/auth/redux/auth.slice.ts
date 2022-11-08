import * as sessionHelper from "@helpers/session.helper";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { LoginCredentials } from "@features/auth/types/auth.type";
import { getMeThunk } from "@features/users/redux/users.slice";
import { loginApi } from "@features/auth/api/auth.api";

const initialState = {
  isLogin: false,
};

export const loginThunk = createAsyncThunk(
  "auth/login",
  (credentials: LoginCredentials, { dispatch }) => {
    return (
      loginApi(credentials).then(
        (res) => {
          sessionHelper.seed(res.data, null);
          dispatch(getMeThunk());
          return res.data;
        },
        (err) => err.message
      )
    )
  }
    
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
  },
  // update login state
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(loginThunk.fulfilled, (state, action) => {
      // update state
      state.isLogin = true;
    })
  },
});

export default authSlice.reducer;
