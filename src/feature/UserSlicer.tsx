import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
  API_USER,
  signupUserDetails,
  signupUserResponse,
  loginUserDetails,
  loginUserResponse,
} from "@/apiTypes/userApi";
import { toast } from "react-toastify";

interface SignUpUserPayload {
  signupUserDetails: signupUserDetails;
}

//MARK:signUpUser
export const signUpUser = createAsyncThunk<
  signupUserResponse,
  SignUpUserPayload
>("signUpUser", async ({ signupUserDetails }, { rejectWithValue }) => {
  try {
    // Make sure you use the correct protocol and port
    const response = await axios.post(`${API_USER}/signup`, signupUserDetails);
    return response.data;
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
});

interface loginUserPayload {
  loginUserDetails: loginUserDetails;
}

//MARK:loginUser
export const loginUser = createAsyncThunk<loginUserResponse, loginUserPayload>(
  "loginUser",
  async ({ loginUserDetails }, { rejectWithValue }) => {
    try {
      // Make sure you use the correct protocol and port
      const response = await axios.post(`${API_USER}/login`, loginUserDetails, {
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

//MARK:VerifyEmail
export const verifyEmail = createAsyncThunk<any, any>(
  "verifyEmail",
  async ({ verifyEmailCode }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_USER}/verify-email`, {
        verificationCode: verifyEmailCode,
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

//MARK:isAuthenticatedFun
export const isAuthenticatedFun = createAsyncThunk(
  "isAuthenticatedFun",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_USER}/check-auth`, {
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
//MARK:logout
export const logout = createAsyncThunk(
  "logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_USER}/logout`,
        {},
        {
          withCredentials: true, // Include credentials (cookies)
        }
      );
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

//MARK:userApi
export const userApi = createSlice({
  name: "userApi",
  initialState: {
    users: [] as unknown[],
    isLoading: false,
    error: false,
    message: "" as unknown,
    searchData: [],
    isAuthenticated: false as unknown,
    isCheckingAuth: false as unknown,
  },
  reducers: {},
  extraReducers: (builder) => {
    //SignUp
    builder.addCase(signUpUser.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(signUpUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.users = [];
      state.users.push(action.payload);
      toast.success<unknown>(
        typeof action.payload.message === "string"
          ? action.payload.message
          : "An error occurred"
      );
    });
    builder.addCase(signUpUser.rejected, (state, action) => {
      state.error = true;
      state.isLoading = false;
      state.message = action.payload;
      toast.error<unknown>(
        typeof action.payload === "string"
          ? action.payload
          : "An error occurred"
      );
    });

    //Login
    builder.addCase(loginUser.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = false;
      state.isAuthenticated = true;
      state.users = [];
      state.users.push(action.payload);
      state.message = "";
      toast.success<unknown>(
        typeof action.payload.message === "string"
          ? action.payload.message
          : "An error occurred"
      );
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.error = true;
      state.isLoading = false;
      state.message = action.payload;
      toast.error<unknown>(
        typeof action.payload === "string"
          ? action.payload
          : "An error occurred"
      );
    });

    //Logout
    builder.addCase(logout.pending, (state) => {
      state.isLoading = true;
      state.isCheckingAuth = false;
    });
    builder.addCase(logout.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = false;
      state.isCheckingAuth = true;
      state.message = action.payload.message;
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("users");
    });
    builder.addCase(logout.rejected, (state, action) => {
      state.error = true;
      state.isLoading = false;
      state.isCheckingAuth = false;
      state.message = action.payload;
    });

    //Verify-Email
    builder.addCase(verifyEmail.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(verifyEmail.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = false;
      state.isAuthenticated = true;
      state.users = [];
      state.users.push(action.payload);
      toast.success<unknown>(
        typeof action.payload.message === "string"
          ? action.payload.message
          : "An error occurred"
      );
    });
    builder.addCase(verifyEmail.rejected, (state, action) => {
      state.error = true;
      state.message = action.payload;
      state.isAuthenticated = false;
      state.isLoading = false;
      toast.error<unknown>(
        typeof action.payload === "string"
          ? action.payload
          : "An error occurred"
      );
    });

    //CHeck-Auth
    builder.addCase(isAuthenticatedFun.pending, (state) => {
      state.isLoading = true;
      state.isCheckingAuth = true;
    });
    builder.addCase(isAuthenticatedFun.fulfilled, (state) => {
      state.isLoading = false;
      state.error = false;
      state.isCheckingAuth = false;
    });
    builder.addCase(isAuthenticatedFun.rejected, (state, action) => {
      state.error = true;
      state.isLoading = false;
      state.isCheckingAuth = false;
      state.message = action.payload;
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("users");
    });
  },
});

export default userApi.reducer;
