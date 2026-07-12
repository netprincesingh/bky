import { configureStore, Middleware } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { api } from '../api/Api';
import authReducer, { setCredentials, logout } from './AuthSlice';
import * as SecureStore from 'expo-secure-store';







const secureStoreMiddleware: Middleware = store => next => action => {
  const result = next(action);

  // Sync to secure store on login
  if (setCredentials.match(action)) {
    const { accessToken, refreshToken } = action.payload;
    if (accessToken) SecureStore.setItemAsync('accessToken', accessToken).catch(console.error);
    if (refreshToken) SecureStore.setItemAsync('refreshToken', refreshToken).catch(console.error);
  } 
  // Clear from secure store on logout
  else if (logout.match(action)) {
    SecureStore.deleteItemAsync('accessToken').catch(console.error);
    SecureStore.deleteItemAsync('refreshToken').catch(console.error);
  }

  return result;
};





export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware, secureStoreMiddleware),
});



setupListeners(store.dispatch);



// Helper to initialize store from SecureStore
export const loadTokens = async () => {
  try {
    const accessToken = await SecureStore.getItemAsync('accessToken');
    const refreshToken = await SecureStore.getItemAsync('refreshToken');
    if (accessToken && refreshToken) {
      store.dispatch(setCredentials({
        user: { }, 
        accessToken,
        refreshToken
      }));
    }
  } catch (e) {
    console.error('Failed to load tokens from SecureStore', e);
  }
};

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
