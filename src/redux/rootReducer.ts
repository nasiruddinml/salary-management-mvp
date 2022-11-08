import { combineReducers } from "@reduxjs/toolkit";

import settingsReducer from "@features/settings/redux/settings.slice";
import authReducer from "@features/auth/redux/auth.slice";
import usersReducer from "@features/users/redux/users.slice";

const rootReducer = combineReducers({
  settings: settingsReducer,
  auth: authReducer,
  users: usersReducer,
});

export default rootReducer;
