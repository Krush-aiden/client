import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

// Define API endpoint and types
// const API_ADMIN = "/api/admin";

const API_ADMIN: string | undefined =
  import.meta.env.VITE_ENVIRONMENT == "prod"
    ? `${import.meta.env.VITE_BACKEND_USER_API_URL_PROD}/api/v1/restaurantRout`
    : `${import.meta.env.VITE_BACKEND_USER_API_URL_DEV}/api/v1/restaurantRout`;

// Define TypeScript interfaces for restaurant update
export interface RestaurantUpdateDetails {
  restaurantName: string;
  restaurantCity: string;
  restaurantCountry: string;
  restaurantEdt?: any;
  restaurantCuisines?: string[];
  restaurantImage?: any;
}

interface RestaurantUpdateResponse {
  message: string;
  restaurant: any;
}

interface AdminState {
  admin: unknown[];
  isLoading: boolean;
  error: boolean;
  message: string;
  success: boolean;
}

const initialState: AdminState = {
  admin: [],
  isLoading: false,
  error: false,
  message: "",
  success: false,
};

// AsyncThunk for restaurantUpdate
export const restaurantUpdate = createAsyncThunk<
  RestaurantUpdateResponse,
  RestaurantUpdateDetails
>(
  "admin/restaurantUpdate",
  async (restaurantUpdateDetails, { rejectWithValue }) => {
    try {
      console.log("🚀 ~ restaurantUpdateDetails:", restaurantUpdateDetails);
      const formData = new FormData();
      for (const key in restaurantUpdateDetails) {
        // eslint-disable-next-line no-prototype-builtins
        if (restaurantUpdateDetails.hasOwnProperty(key)) {
          formData.append(
            key,
            restaurantUpdateDetails[key as keyof RestaurantUpdateDetails] as any
          );
        }
      }
      const response = await axios.post(
        `${API_ADMIN}/restaurant/update`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error("Error updating restaurant:", error);
      const errorMsg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update restaurant";
      return rejectWithValue(errorMsg);
    }
  }
);

// Slice for admin
const adminSlicer = createSlice({
  name: "admin",
  initialState,
  reducers: {
    resetSuccess(state) {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(restaurantUpdate.pending, (state) => {
        state.isLoading = true;
        state.error = false;
      })
      .addCase(
        restaurantUpdate.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          state.success = true;
          state.error = false;
          state.message = action.payload.message;
          state.admin = [action.payload.restaurant];
          toast.success("Restaurant updated successfully");
          localStorage.setItem("restaurant", JSON.stringify(state.admin));
        }
      )
      .addCase(
        restaurantUpdate.rejected,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          state.error = true;
          state.message = action.payload;
          toast.error("Failed to update restaurant");
        }
      );
  },
});

export const { resetSuccess } = adminSlicer.actions;
export default adminSlicer.reducer;
