// apiTypes.ts


// Defining the structure of the user data
export const API_USER: string = "http://localhost:8000/api/v1/user";


export type signupUserDetails = {
  fullName: string;
  email: string;
  contact: string;
  password: string;
};

export interface signupUserResponse {
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
    email: string,
    password: string,
}

export type verifyEmailDetails = {
  verifyEmailCode : string
}
export type verifyEmailResponse = {
  verifyEmailCode : string
}