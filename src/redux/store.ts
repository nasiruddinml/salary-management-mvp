import { useMemo } from "react";
import {
  configureStore,
  ThunkAction,
  Action,
  EnhancedStore,
} from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import thunk from "redux-thunk";
import { persistReducer } from "redux-persist";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import rootReducer from "./rootReducer";
import { getCurrentEnvironment } from "@helpers/util.helper";

// eslint-disable-next-line
let store: any;

const persistConfig = {
  key: "salary-management-mvp",
  whitelist: ["settings"], // only these items will be persisted, add other reducers if needed
  storage, // if needed, use a safer storage
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

function makeStore(initialState = {}): EnhancedStore {
  return configureStore({
    preloadedState: initialState,
    reducer: persistedReducer,
    middleware: [thunk],
    devTools: getCurrentEnvironment() !== "PROD",
  });
}

export const initializeStore = (preloadedState: RootState): EnhancedStore => {
  let newStore = store ?? makeStore(preloadedState);

  // After navigating to a page with an initial Redux state, merge that state
  // with the current state in the store, and create a new store
  if (preloadedState && store) {
    newStore = makeStore({
      ...store.getState(),
      ...preloadedState,
    });
    // Reset the current store
    store = undefined;
  }

  // For SSG and SSR always create a new store
  if (typeof window === "undefined") return newStore;
  // Create the store once in the client
  if (!store) store = newStore;

  return newStore;
};

export function useStore(initialState: RootState): EnhancedStore {
  return useMemo(() => initializeStore(initialState), [initialState]);
}

export type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof store.getState>;

// eslint-disable-next-line
export const useAppDispatch = (): any => useDispatch<AppDispatch>();

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export default makeStore({});
