import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import complaintReducer from './complaintSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    complaints: complaintReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
