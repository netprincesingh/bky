import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuthState {
  token: string | null;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  } | null;
  isAuthenticated: boolean;
}

// ─── Web Token Storage (replaces AsyncStorage from React Native) ──────────────
//
//  In React Native  →  AsyncStorage.setItem("token", token)
//  In Web           →  localStorage.setItem("token", token)
//
//  localStorage persists even after the browser is closed (like AsyncStorage).
//  The token is automatically restored when the app loads (see initialState below).

const TOKEN_KEY = "bky_admin_token";
const USER_KEY = "bky_admin_user";

const storage = {
  saveToken: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  getToken: (): string | null => localStorage.getItem(TOKEN_KEY),
  removeToken: () => localStorage.removeItem(TOKEN_KEY),

  saveUser: (user: AuthState["user"]) =>
    localStorage.setItem(USER_KEY, JSON.stringify(user)),
  getUser: (): AuthState["user"] => {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  removeUser: () => localStorage.removeItem(USER_KEY),
};

// ─── Initial State ─────────────────────────────────────────────────────────────
// On page load/refresh, we rehydrate from localStorage automatically.
// (In React Native you'd do this in a splash screen with AsyncStorage.getItem)

const savedToken = storage.getToken();
const savedUser = storage.getUser();

const initialState: AuthState = {
  token: savedToken,
  user: savedUser,
  isAuthenticated: !!savedToken,
};

// ─── Slice ────────────────────────────────────────────────────────────────────

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Call this after a successful login API response
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; user: AuthState["user"] }>
    ) => {
      const { token, user } = action.payload;
      state.token = token;
      state.user = user;
      state.isAuthenticated = true;

      // Persist to localStorage (survives page refresh)
      storage.saveToken(token);
      storage.saveUser(user);
    },

    // Call this on logout
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;

      // Clear from localStorage
      storage.removeToken();
      storage.removeUser();
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
