import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../feature/cartSlicer";
import userApi from "@/feature/UserSlicer";
import adminSlicer from "@/feature/adminSlicer";
import adminMenuSlicer from "@/feature/adminMenuSlicer"; // ✅ ADD THIS

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    user: userApi,
    admin: adminSlicer,
    adminMenu: adminMenuSlicer, // ✅ ADD THIS
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;