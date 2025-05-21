import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../feature/cartSlicer";
import userApi from "@/feature/UserSlicer";
import adminSlicer from "@/feature/adminSlicer";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    user: userApi,
    admin: adminSlicer,
  },
});
export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
