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
export interface RestaurantUpdateAndEditDetails {
  restaurantName: string;
  restaurantCity: string;
  restaurantCountry: string;
  restaurantEdt?: any;
  restaurantCuisines?: string[];
  restaurantImage?: any;
}

interface RestaurantUpdateAndEditResponse {
  message: string;
  restaurant: any;
}

interface AdminState {
  restaurantDetails: unknown[];
  isLoading: boolean;
  error: boolean;
  message: string;
  success: boolean;
}

const initialState: AdminState = {
  restaurantDetails: [],
  isLoading: false,
  error: false,
  message: "",
  success: false,
};

//MARK: Fetch Restaurant
export const fetchRestaurantFunction = createAsyncThunk(
  "fetchRestaurantFunction",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_ADMIN}/`, {
        withCredentials: true, // Include credentials (cookies)
      });
      return response.data;
    } catch (error: any) {
      console.error(
        "Error signing up user:",
        error.message || error.response?.data || error
      );
      const errorMessage =
        error?.response?.data?.message || error?.message || "Failed to login";
      return rejectWithValue(errorMessage);
    }
  }
);

//MARK:Restaurant Add
export const restaurantUpdate = createAsyncThunk<
  RestaurantUpdateAndEditResponse,
  RestaurantUpdateAndEditDetails
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
            restaurantUpdateDetails[
              key as keyof RestaurantUpdateAndEditDetails
            ] as any
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

//MARK:Restaurant Update
export const restaurantEdit = createAsyncThunk<
  RestaurantUpdateAndEditResponse,
  RestaurantUpdateAndEditDetails
>(
  "admin/restaurantEdit",
  async (RestaurantEditDetails, { rejectWithValue }) => {
    try {
      console.log("🚀 ~ restaurantUpdateDetails:", RestaurantEditDetails);
      const formData = new FormData();
      for (const key in RestaurantEditDetails) {
        // eslint-disable-next-line no-prototype-builtins
        if (RestaurantEditDetails.hasOwnProperty(key)) {
          formData.append(
            key,
            RestaurantEditDetails[
              key as keyof RestaurantUpdateAndEditDetails
            ] as any
          );
        }
      }
      const response = await axios.put(
        `${API_ADMIN}/restaurant/edit`,
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

//MARK: Restaurant Api
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
          toast.success("Restaurant updated successfully");
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
    builder
      .addCase(restaurantEdit.pending, (state) => {
        state.isLoading = true;
        state.error = false;
      })
      .addCase(
        restaurantEdit.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          state.success = true;
          state.error = false;
          state.message = action.payload.message;
          toast.success("Restaurant updated successfully");
        }
      )
      .addCase(restaurantEdit.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = true;
        state.message = action.payload;
        toast.error("Failed to update restaurant");
      });
    builder
      .addCase(fetchRestaurantFunction.pending, (state) => {
        state.isLoading = false;
      })
      .addCase(
        fetchRestaurantFunction.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          state.error = false;
          console.log("🚀 ~ .addCase ~ action:", action.payload);
          state.restaurantDetails = [action.payload];
        }
      )
      .addCase(
        fetchRestaurantFunction.rejected,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          state.error = true;
          state.message = action.payload;
        }
      );
  },
});

export const { resetSuccess } = adminSlicer.actions;
export default adminSlicer.reducer;
