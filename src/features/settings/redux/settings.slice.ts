import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SettingsState } from "../types/settings.types";

const initialState: SettingsState = {
  backgroundColor: "light",
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setBackgroundColor: (state, action: PayloadAction<string>) => {
      state.backgroundColor = action.payload;
    },
  },
});

export const { setBackgroundColor } = settingsSlice.actions;

export default settingsSlice.reducer;
