/* eslint-disable @typescript-eslint/no-explicit-any */
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
  console.log("🚀 ~ userDetails:", signupUserDetails);
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
    console.log("🚀 ~ userDetails:", loginUserDetails);
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

// interface verifyEmailPayload {

// }

//MARK:VerifyEmail
export const verifyEmail = createAsyncThunk<any, any>(
  "verifyEmail",
  async ({ verifyEmailCode }, { rejectWithValue }) => {
    console.log("hee");
    console.log("🚀 ~ verifyEmailCode:", verifyEmailCode);
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
      console.log("🚀 ~ response:");
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
      console.log("🚀 ~ logout response:");

      const response = await axios.post(
        `${API_USER}/logout`,
        {},
        {
          withCredentials: true, // Include credentials (cookies)
        }
      );
      // localStorage.removeItem("isAuthenticated");
      // localStorage.removeItem("users");
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
      console.log("here 1");
      state.isLoading = true;
    });
    builder.addCase(signUpUser.fulfilled, (state, action) => {
      state.isLoading = false;
      console.log("🚀 ~ builder.addCase ~ action.payload:", action.payload);
      toast.success("working fine");
      state.users.push(action.payload);
    });
    builder.addCase(signUpUser.rejected, (state, action) => {
      console.log("here 3");
      state.error = true;
      state.isLoading = false;
      state.message = action.payload;
      toast.error("not working fine");
    });

    //Login
    builder.addCase(loginUser.pending, (state) => {
      console.log("here 1");
      state.isLoading = true;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = false;
      state.isAuthenticated = true;
      // state.isCheckingAuth = true;
      console.log("🚀 ~ builder.addCase ~ action.payload:", action.payload);
      state.users.push(action.payload);
      state.message = "";
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      console.log("here 3");
      state.error = true;
      state.isLoading = false;
      state.message = action.payload;
    });

    //Logout
    builder.addCase(logout.pending, (state) => {
      console.log("here 1");
      state.isLoading = true;
      state.isCheckingAuth = false;
      // localStorage.removeItem("isAuthenticated");
      // localStorage.removeItem("users");
    });
    builder.addCase(logout.fulfilled, (state, action) => {
      console.log("here 2");
      console.log("🚀 ~ builder.addCase ~ action:", action.payload);
      state.isLoading = false;
      state.error = false;
      state.isCheckingAuth = true;
      state.message = action.payload.message;
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("users");
      // localStorage.clear();
    });
    builder.addCase(logout.rejected, (state, action) => {
      console.log("here 3");
      state.error = true;
      state.isLoading = false;
      state.isCheckingAuth = false;
      state.message = action.payload;
    });

    //Verify-Email
    builder.addCase(verifyEmail.pending, (state) => {
      console.log("here 1");
      state.isLoading = true;
    });
    builder.addCase(verifyEmail.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = false;
      console.log("🚀 ~ builder.addCase ~ action.payload:", action.payload);
      state.users.push(action.payload);
      toast.success<unknown>(
        typeof action.payload.message === "string"
          ? action.payload.message
          : "An error occurred"
      );
    });
    builder.addCase(verifyEmail.rejected, (state, action) => {
      console.log("here 3");
      state.error = true;
      state.message = action.payload;
      state.isLoading = false;
      console.log("🚀 ~ builder.addCase ~ action.payload:", action.payload);
      toast.error<unknown>(
        typeof action.payload === "string"
          ? action.payload
          : "An error occurred"
      );
    });

    //CHeck-Auth
    builder.addCase(isAuthenticatedFun.pending, (state) => {
      console.log("here 1");
      state.isLoading = true;
      state.isCheckingAuth = false;
    });
    builder.addCase(isAuthenticatedFun.fulfilled, (state, action) => {
      console.log("here 2");
      state.isLoading = false;
      state.error = false;
      if (state.users.length <= 0) {
        state.users.push(action.payload);
      }
      state.isCheckingAuth = true;
    });
    builder.addCase(isAuthenticatedFun.rejected, (state, action) => {
      console.log("here 3");
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
