/* eslint-disable prefer-const */
/* eslint-disable no-prototype-builtins */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
  API_USER,
  signupUserDetails,
  signupUserResponse,
  loginUserDetails,
  loginUserResponse,
  forgetPasswordEmail,
  forgetPasswordEmailRes,
  userNewPasswordDetails,
  userNewPasswordDetailsRes,
  updateProfileDetailsRes,
  updateProfileDetails,
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
    console.log("🚀 ~ loginUserDetails:", loginUserDetails);
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

interface emailValuePayload {
  forgetPasswordEmail: forgetPasswordEmail;
}

//MARK:ForgetPassword
export const forgetPassword = createAsyncThunk<
  forgetPasswordEmailRes,
  emailValuePayload
>("forgetPassword", async ({ forgetPasswordEmail }, { rejectWithValue }) => {
  console.log("🚀 ~ > ~ forgetPasswordEmail:", forgetPasswordEmail);
  try {
    const response = await axios.post<any>(`${API_USER}/forget-password`, {
      forgetPasswordEmail,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    rejectWithValue(error);
  }
});

//MARK:resetPassword
export const resetPassword = createAsyncThunk<
  userNewPasswordDetailsRes,
  userNewPasswordDetails
>("resetPassword", async ({ newPassword, token }, { rejectWithValue }) => {
  try {
    console.log("🚀 ~ > ~ userNewPasswordDetails:", newPassword, token);
    const response = await axios.post(
      `${API_USER}/reset-password/${token}`,
      { newPassword },
      { withCredentials: true }
    );

    return response.data;
  } catch (error: any) {
    console.log(error);
    const errorMessage =
      error.response.data.message || error.message || "Failed to fetch";
    return rejectWithValue(errorMessage);
  }
});

interface updateProfileDetailsPayload {
  updateProfileDetails: updateProfileDetails;
}

//MARK:updateProfile
export const updateProfile = createAsyncThunk<
  updateProfileDetailsRes,
  updateProfileDetailsPayload
>("updateProfile", async ({ updateProfileDetails }, { rejectWithValue }) => {
  try {
    console.log("🚀 ~ > ~ updateProfileDetails:", updateProfileDetails);

    const formData = new FormData();

    for (const key in updateProfileDetails) {
      if (updateProfileDetails.hasOwnProperty(key)) {
        formData.append(
          key,
          updateProfileDetails[key as keyof updateProfileDetails]
        );
      }
    }

    // formData.append("profilePicture",file);

    console.log("🚀 ~ > ~ formData:", formData);

    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    const response = await axios.post(`${API_USER}/profile/update`, formData, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data", // Ensure the correct content type is set
      },
    });

    return response?.data;
  } catch (error: any) {
    console.log(error);
    const errorMsg =
      error?.response?.data?.message || error?.message || "failed to fetch";
    return rejectWithValue(errorMsg);
  }
});

//MARK:userApi
export const userApi = createSlice({
  name: "userApi",
  initialState: {
    users: [] as unknown[],
    isLoading: false,
    error: false,
    message: "" as unknown,
    success: false,
    isAuthenticated: false as unknown,
  },
  reducers: {},
  extraReducers: (builder) => {
    //updateProfile
    builder.addCase(updateProfile.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateProfile.fulfilled, (state, action) => {
      console.log("🚀 ~ builder.addCase ~ action:", action.payload);
      state.isLoading = false;
      state.users = [];
      state.users.push(action.payload);
      localStorage.setItem("users", JSON.stringify([action.payload]));
      // localStorage.setItem("users", JSON.stringify(users));
    });
    builder.addCase(updateProfile.rejected, (state) => {
      state.isLoading = false;
    });
    //resetPassword
    builder.addCase(resetPassword.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(resetPassword.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = false;
      state.success = true;
      toast.success<unknown>(
        typeof action.payload.message === "string"
          ? action.payload.message
          : "An error occurred"
      );
    });
    builder.addCase(resetPassword.rejected, (state, action) => {
      state.error = true;
      state.isLoading = false;
      toast.error<unknown>(
        typeof action.payload === "string"
          ? action.payload
          : "An error occurred"
      );
    });

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
      // state.isLoading = true;
      state.error = false;
    });
    builder.addCase(logout.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = false;
      state.message = action.payload.message;
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("users");
    });
    builder.addCase(logout.rejected, (state, action) => {
      state.error = true;
      state.isLoading = false;
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
    });
    builder.addCase(isAuthenticatedFun.fulfilled, (state) => {
      state.isLoading = false;
      state.error = false;
    });
    builder.addCase(isAuthenticatedFun.rejected, (state, action) => {
      state.error = true;
      state.isLoading = false;
      state.message = action.payload;
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("users");
    });

    builder.addCase(forgetPassword.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(forgetPassword.fulfilled, (state, action: any) => {
      state.isLoading = false;
      state.success = true;
      toast.success<unknown>(
        typeof action.payload.message === "string"
          ? action.payload.message
          : "An error occurred"
      );
    });
    builder.addCase(forgetPassword.rejected, (state, action: any) => {
      state.isLoading = false;
      toast.error<unknown>(
        typeof action.payload.message === "string"
          ? action.payload.message
          : "An error occurred"
      );
    });
  },
});

export default userApi.reducer;
