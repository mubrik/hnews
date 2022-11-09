import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/dist/query';
/* fetch api */
import { hackerNewsApi } from './api/api';
/* slice and middleware */
import authReducer from './authSlice';
import storyReducer from './storySlice';
import { authStorageMiddleware } from './middleware/middleware';
/* Types */
import { IAuthStoreState } from '../customTypes'

/* configures the redux store */
export default function configureAppStore(preloadedState?: Record<"auth", IAuthStoreState>) {
  const store = configureStore({
    reducer: {
      auth: authReducer,
      story: storyReducer,
      [hackerNewsApi.reducerPath]: hackerNewsApi.reducer
    },
    preloadedState,
    middleware: (defaultMid) => [...defaultMid(), authStorageMiddleware, hackerNewsApi.middleware]
  });

  setupListeners(store.dispatch);

  return store;
}
