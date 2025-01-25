import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_USER: string = "http://localhost:8000/api/v1/user/";

// Defining the structure of the user data
type UserDetails = {
  fullName: string;
  email: string;
  contact: string;
  password: string;
};

// Define the type for the payload passed to the `signUpUser` async thunk
interface SignUpUserPayload {
  userDetails: UserDetails;
}

// Define the response type from the API (based on your actual API response structure)
interface UserResponse {
  fullName: string;
  email: string;
  contact: string;
  password: string;
  // users :unknown [];
}

export const signUpUser = createAsyncThunk<UserResponse, SignUpUserPayload>(
  "signUpUser",
  async ({ userDetails }, { rejectWithValue }) => {
    console.log("🚀 ~ userDetails:", userDetails);
    try {
      // Make sure you use the correct protocol and port
      const response = await axios.post(`${API_USER}/signup`, userDetails);
      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(
        "Error signing up user:",
        error.message || error.response?.data || error
      );
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to create user";
      return rejectWithValue(errorMessage);
    }
  }
);

export const loginUser = createAsyncThunk<UserResponse, SignUpUserPayload>(
  "loginUser",
  async ({ userDetails }, { rejectWithValue }) => {
    console.log("🚀 ~ userDetails:", userDetails);
    try {
      // Make sure you use the correct protocol and port
      const response = await axios.post(`${API_USER}/login`, userDetails);
      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(
        "Error signing up user:",
        error.message || error.response?.data || error
      );
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to create user";
      return rejectWithValue(errorMessage);
    }
  }
);

export const userApi = createSlice({
  name: "userApi",
  initialState: {
    users: [] as UserResponse[],
    isLoading: false,
    error: false,
    message: "" as unknown,
    searchData: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(signUpUser.pending, (state) => {
      console.log("here 1");
      state.isLoading = true;
    });
    builder.addCase(signUpUser.fulfilled, (state, action) => {
      state.isLoading = false;
      console.log("🚀 ~ builder.addCase ~ action.payload:", action.payload);
      state.users.push(action.payload);
    });
    builder.addCase(signUpUser.rejected, (state, action) => {
      console.log("here 3");
      state.error = true;
      state.message = action.payload;
    });
  },
});

export default userApi.reducer;
