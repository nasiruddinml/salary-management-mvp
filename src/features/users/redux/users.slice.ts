import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { meApi } from "@features/users/api/users.api";
import * as sessionHelper from "@helpers/session.helper";
import Router from "next/router";

const initialState = {};

export const getMeThunk = createAsyncThunk("users/me", () =>
  meApi().then(
    (res) => res.data,
    (err) => err.message
  )
);

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: {
    [getMeThunk.fulfilled.toString()]: (state, action) => {
      sessionHelper.saveUser(action.payload);
      Router.push("/dashboard");
      return state;
    },
  },
});

export default usersSlice.reducer;
