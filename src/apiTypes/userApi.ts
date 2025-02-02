// apiTypes.ts


// Defining the structure of the user data

export const API_USER: string | undefined = import.meta.env.VITE_ENVIRONMENT == "prod" ? `${import.meta.env.VITE_BACKEND_USER_API_URL_PROD}/api/v1/user`: `${import.meta.env.VITE_BACKEND_USER_API_URL_DEV}/api/v1/user`;


export type signupUserDetails = {
  fullName: string;
  email: string;
  contact: string;
  password: string;
};

export interface signupUserResponse {
  message: string;
  fullName: string;
  email: string;
  contact: string;
  password: string;
}

export type loginUserDetails = {
    email: string,
    password: string,
}

export type loginUserResponse = {
    message: string;
    email: string,
    password: string,
}

export type verifyEmailDetails = {
  verifyEmailCode : string
}
export type verifyEmailResponse = {
  verifyEmailCode : string
}

export type forgetPasswordEmail = {
  email:string
}

export type forgetPasswordEmailRes = {
  message: string;
  email:string 
}

export type userNewPasswordDetails = {
  newPassword: string;
  token: string | undefined;  // Allow token to be string or undefined
}

export type userNewPasswordDetailsRes = {
  newPassword : string;
  token: string;
  message : string;
}

export type updateProfileDetails = {
  fullName: string,
  email: string,
  address: string,
  city: string,
  country: string,
  profilePictureName: any,
}

export type updateProfileDetailsRes = {
  fullName: string,
  email: string,
  address: string,
  city: string,
  country: string,
  profilePictureName: string,
  message:string,
}