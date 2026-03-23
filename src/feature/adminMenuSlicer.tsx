import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

//MARK: API URL
const API_ADMIN_MENU_ROUT_URL: string | undefined =
  import.meta.env.VITE_ENVIRONMENT == "prod"
    ? `${import.meta.env.VITE_BACKEND_USER_API_URL_PROD}/api/v1/menuRout`
    : `${import.meta.env.VITE_BACKEND_USER_API_URL_DEV}/api/v1/menuRout`;

//MARK: TYPES
export interface MenuDetails {
  _id?: string;
  name: string;
  description: string;
  price: number;
  image?: any;
}

interface MenuResponse {
  message: string;
  menu?: any;
}

interface AdminMenuState {
  menus: MenuDetails[];
  isLoading: boolean;
  error: boolean;
  message: string;
  success: boolean;
}

const initialState: AdminMenuState = {
  menus: [],
  isLoading: false,
  error: false,
  message: "",
  success: false,
};


//MARK: Fetch Menu
export const fetchMenu = createAsyncThunk(
    "adminMenu/fetchMenu",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axios.get(
                `${API_ADMIN_MENU_ROUT_URL}/`,
                { withCredentials: true }
            );
            console.log("res", res);
            return res.data;
        } catch (error: any) {
            return rejectWithValue(
                error?.response?.data?.message || "Failed to fetch menu"
            );
        }
    }
);


//MARK: Add Menu
export const addMenu = createAsyncThunk<MenuResponse, MenuDetails>(
  "adminMenu/addMenu",
  async (payload, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      Object.keys(payload).forEach((key) => {
        formData.append(key, payload[key as keyof MenuDetails] as any);
      });

      const res = await axios.post(
        `${API_ADMIN_MENU_ROUT_URL}/addMenu`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to add menu"
      );
    }
  }
);


//MARK: Edit Menu
export const editMenu = createAsyncThunk<MenuResponse, MenuDetails>(
  "adminMenu/editMenu",
  async (payload, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      Object.keys(payload).forEach((key) => {
        formData.append(key, payload[key as keyof MenuDetails] as any);
      });

        const res = await axios.put(
            `${API_ADMIN_MENU_ROUT_URL}/menus/${payload._id}`,
            formData,
            {
                withCredentials: true,
                headers: { "Content-Type": "multipart/form-data" },
            }
        );

      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to update menu"
      );
    }
  }
);


//MARK: Delete Menu
export const deleteMenu = createAsyncThunk<string, string>(
  "adminMenu/deleteMenu",
  async (menuId, { rejectWithValue }) => {
    try {
      await axios.delete(
        `${API_ADMIN_MENU_ROUT_URL}/deleteMenu/${menuId}`,
        {
          withCredentials: true,
        }
      );
      return menuId;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to delete menu"
      );
    }
  }
);


//MARK: Menu Slice
const adminMenuSlicer = createSlice({
  name: "adminMenu",
  initialState,
  reducers: {
    resetSuccess(state) {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder

      //MARK: Fetch Menu Cases
      .addCase(fetchMenu.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchMenu.fulfilled, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.menus = action.payload.menus || [];
      })
      .addCase(fetchMenu.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = true;
        state.message = action.payload;
      })

      //MARK: Add Menu Cases
      .addCase(addMenu.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addMenu.fulfilled, (state) => {
        state.isLoading = false;
        state.success = true;
        toast.success("Menu added successfully");
      })
      .addCase(addMenu.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = true;
        toast.error(action.payload);
      })

      //MARK: Edit Menu Cases
      .addCase(editMenu.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(editMenu.fulfilled, (state) => {
        state.isLoading = false;
        state.success = true;
        toast.success("Menu updated successfully");
      })
      .addCase(editMenu.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = true;
        toast.error(action.payload);
      })

      //MARK: Delete Menu Cases
      .addCase(deleteMenu.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteMenu.fulfilled, (state, action) => {
        state.isLoading = false;
        state.menus = state.menus.filter(
          (menu) => menu._id !== action.payload
        );
        toast.success("Menu deleted");
      })
      .addCase(deleteMenu.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = true;
        toast.error(action.payload);
      });
  },
});

export const { resetSuccess } = adminMenuSlicer.actions;
export default adminMenuSlicer.reducer;