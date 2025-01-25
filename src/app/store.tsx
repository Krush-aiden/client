import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../feature/cartSlicer";
import userApi from "@/feature/UserSlicer";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    user: userApi,
  },
});
export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
