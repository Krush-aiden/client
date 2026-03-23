/* eslint-disable no-prototype-builtins */
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
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
axios.defaults.withCredentials = true;

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
      error.message || error.response?.data || error,
    );
    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to create user";
    return rejectWithValue(errorMessage);
  }
});

type LoginDetails = loginUserDetails | { googleToken: string };

interface loginUserPayload {
  loginUserDetails: LoginDetails;
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
        "Error logging in user:",
        error.message || error.response?.data || error,
      );
      const errorMessage =
        error?.response?.data?.message || error?.message || "Failed to login";
      return rejectWithValue(errorMessage);
    }
  },
);

interface googleLoginPayload {
  googleToken: string;
}

//MARK:googleLogin
export const googleLogin = createAsyncThunk<
  loginUserResponse,
  googleLoginPayload
>("googleLogin", async ({ googleToken }, { rejectWithValue }) => {
  try {
    const response = await axios.post(
      `${API_USER}/google-login`,
      { googleToken },
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error with Google login:",
      error.message || error.response?.data || error,
    );
    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to login with Google";
    return rejectWithValue(errorMessage);
  }
});

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
        error.message || error.response?.data || error,
      );
      const errorMessage =
        error?.response?.data?.message || error?.message || "Failed to login";
      return rejectWithValue(errorMessage);
    }
  },
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
        error.message || error.response?.data || error,
      );
      const errorMessage =
        error?.response?.data?.message || error?.message || "Failed to login";
      return rejectWithValue(errorMessage);
    }
  },
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
        },
      );
      return response.data;
    } catch (error: any) {
      console.error(
        "Error signing up user:",
        error.message || error.response?.data || error,
      );
      const errorMessage =
        error?.response?.data?.message || error?.message || "Failed to login";
      return rejectWithValue(errorMessage);
    }
  },
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
      { withCredentials: true },
    );

    return response.data;
  } catch (error: any) {
    console.log(error);
    const errorMessage =
      error.response.data.message || error.message || "Failed to fetch";
    return rejectWithValue(errorMessage);
  }
});

// interface updateProfileDetailsPayload {
//   updateProfileDetails: updateProfileDetails;
// }

//MARK:updateProfile
export const updateProfile = createAsyncThunk<
  updateProfileDetailsRes,
  updateProfileDetails
>("updateProfile", async (updateProfileDetails, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    for (const key in updateProfileDetails) {
      if (updateProfileDetails.hasOwnProperty(key)) {
        formData.append(
          key,
          updateProfileDetails[key as keyof updateProfileDetails],
        );
      }
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
interface UserState {
  users: unknown[];
  isLoading: boolean;
  error: boolean;
  message: string;
  success: boolean;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  users: [],
  isLoading: false,
  error: false,
  message: "",
  success: false,
  isAuthenticated: false,
};

const handlePending = (state: UserState) => {
  state.isLoading = true;
  state.error = false;
};

const handleFulfilled = (
  state: UserState,
  action: PayloadAction<any>,
  successMessage?: string,
) => {
  state.isLoading = false;
  state.success = true;
  state.error = false;
  state.message = action.payload.message;
  if (action.payload) {
    state.users = [action.payload];
    if (successMessage) {
      console.log("fulfilled");
      toast.success(successMessage);
    }
  }
};

const handleRejected = (
  state: UserState,
  action: PayloadAction<any>,
  errorMessage?: string,
) => {
  state.isLoading = false;
  state.error = true;
  state.message = action.payload;
  if (errorMessage) {
    console.log("reject");
    toast.error(errorMessage);
  }
};

export const userApi = createSlice({
  name: "userApi",
  initialState,
  reducers: {
    resetSuccess(state) {
      state.success = false;
    },
    clearUser(state) {
      state.users = [];
      state.isLoading = false;
      state.error = false;
      state.message = "";
      state.success = false;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateProfile.pending, handlePending)
      .addCase(updateProfile.fulfilled, (state, action) => {
        handleFulfilled(state, action, "Profile updated successfully");
        localStorage.setItem("users", JSON.stringify(state.users));
      })
      .addCase(updateProfile.rejected, (state, action) => {
        handleRejected(
          state,
          action,
          (action?.payload as any) || "Failed to update profile",
        );
      });

    builder
      .addCase(resetPassword.pending, handlePending)
      .addCase(resetPassword.fulfilled, (state, action) => {
        handleFulfilled(state, action, "Password reset successfully");
      })
      .addCase(resetPassword.rejected, (state, action) => {
        handleRejected(
          state,
          action,
          (action?.payload as any) || "Failed to reset password",
        );
      });

    builder
      .addCase(signUpUser.pending, handlePending)
      .addCase(signUpUser.fulfilled, (state, action) => {
        handleFulfilled(state, action, "Sign up successful");
      })
      .addCase(signUpUser.rejected, (state, action) => {
        handleRejected(
          state,
          action,
          (action?.payload as any) || "Failed to Signup",
        );
      });

    builder
      .addCase(loginUser.pending, handlePending)
      .addCase(loginUser.fulfilled, (state, action) => {
        handleFulfilled(state, action, action.payload.message);
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        handleRejected(
          state,
          action,
          (action?.payload as any) || "Failed to login",
        );
      });

    builder
      .addCase(googleLogin.pending, handlePending)
      .addCase(googleLogin.fulfilled, (state, action) => {
        handleFulfilled(state, action, action.payload.message);
        state.isAuthenticated = true;
      })
      .addCase(googleLogin.rejected, (state, action) => {
        handleRejected(
          state,
          action,
          (action?.payload as any) || "Failed to login with Google",
        );
      });

    builder
      .addCase(logout.pending, handlePending)
      .addCase(logout.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = false;
        state.message = action.payload.message;
      })
      .addCase(logout.rejected, (state, action) => {
        handleRejected(
          state,
          action,
          (action?.payload as any) || "Failed to logout",
        );
      });

    builder
      .addCase(verifyEmail.pending, handlePending)
      .addCase(verifyEmail.fulfilled, (state, action) => {
        handleFulfilled(state, action, "Email verified successfully");
        state.isAuthenticated = true;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        handleRejected(
          state,
          action,
          (action?.payload as any) || "Failed to verify email",
        );
      });

    builder
      .addCase(isAuthenticatedFun.pending, (state) => {
        state.error = false;
      })
      .addCase(isAuthenticatedFun.fulfilled, (state) => {
        state.isLoading = false;
        state.error = false;
      })
      .addCase(
        isAuthenticatedFun.rejected,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          state.error = true;
          state.message = action.payload;
          localStorage.removeItem("isAuthenticated");
          localStorage.removeItem("users");
        },
      );

    builder
      .addCase(forgetPassword.pending, handlePending)
      .addCase(forgetPassword.fulfilled, (state, action) => {
        handleFulfilled(state, action, "Password reset email sent");
      })
      .addCase(forgetPassword.rejected, (state, action) => {
        handleRejected(
          state,
          action,
          (action?.payload as any) || "Failed to send password reset email",
        );
      });
  },
});

export const { resetSuccess, clearUser } = userApi.actions;
export default userApi.reducer;
