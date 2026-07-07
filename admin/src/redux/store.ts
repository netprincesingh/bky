import { configureStore } from "@reduxjs/toolkit";
import { api } from "../api/Api";
import authReducer from "./AuthSlice";

export const store = configureStore({
  reducer: {
    // Auth state (token, user info)
    auth: authReducer,

    // RTK Query API cache (all injected endpoints live here)
    [api.reducerPath]: api.reducer,
  },

  // Required: adds RTK Query middleware for caching, invalidation, polling
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

// ─── Types (same pattern as React Native) ─────────────────────────────────────
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
