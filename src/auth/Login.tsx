import { Separator } from "@radix-ui/react-separator";
import { Loader2, Lock, Mail } from "lucide-react";
import { NavLink } from "react-router-dom";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { LoginInputState, userLoginSchema } from "@/schema/userSchema";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/app/store";
import { loginUser } from "@/feature/UserSlicer";

const Login = () => {
  const [Input, setInput] = useState<LoginInputState>({
    email: "",
    password: "",
  });

  const changeEventHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInput({ ...Input, [name]: value });
  };

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<Partial<LoginInputState>>({});
  const [errorState, setErrorState] = useState<boolean>();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading }: any = useSelector<any>((state) => state.user);

  const loginSubmitHandler = (e: FormEvent) => {
    e.preventDefault();
    const result = userLoginSchema.safeParse(Input);
    setErrorState(result.success);

    if (!result.success) {
      const fieldError = result.error.formErrors.fieldErrors;
      setErrorMsg(fieldError as Partial<LoginInputState>);
      return;
    }
    const payload = { loginUserDetails: Input };

    console.log("🚀 ~ loginSubmitHandler ~ payload:", payload);
    try {
      dispatch(loginUser(payload)).unwrap();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const fetchguestCred = () => {
    setInput({
      email: "gianluca.fares@fileexp.com",
      password: "gianluca.fares@fileexp.com",
    });
  };

  const fetchAdminCred = () => {
    setInput({
      email: "jentzen.jovon@fileexp.com",
      password: "jentzen.jovon@fileexp.com",
    });
  };

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form
        onSubmit={loginSubmitHandler}
        className="md:p-8 w-full max-w-md rounded-lg md:border border-gray-200 mx-4"
      >
        <div className="mb-4">
          <h3 className="font-bold text-2xl">FoodSy</h3>
        </div>
        <div className="mb-6">
          <div className="relative">
            <input
              className="w-full px-12 py-3 text-lg text-gray-800 bg-gray-100 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              type="email"
              name="email"
              placeholder="Email"
              value={Input.email}
              onChange={changeEventHandler}
            />
            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>
          {!errorState && (
            <span className="text-red-500 text-sm">{errorMsg.email}</span>
          )}
        </div>
        <div className="mb-6">
          <div className="relative">
            <input
              className="w-full px-12 py-3 text-lg text-gray-800 bg-gray-100 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              type="password"
              placeholder="Password"
              name="password"
              value={Input.password}
              onChange={changeEventHandler}
            />
            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>
          {!errorState && (
            <span className="text-red-500 text-sm">{errorMsg.password}</span>
          )}
        </div>
        <div className="mb-10">
          {loading ? (
            <button
              disabled
              className="w-full bg-orange flex items-center justify-center py-3 px-4 opacity-50 cursor-not-allowed"
            >
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              Please wait
            </button>
          ) : (
            <button
              type="submit"
              className="w-full bg-orange hover:bg-hoverOrange py-3 px-4"
            >
              Login
            </button>
          )}
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                onClick={fetchAdminCred}
                id="gAdmin"
                name="fav_language"
                value="HTML"
                className="form-radio h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-700">Guest Admin Credentials</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                id="gUser"
                onClick={fetchguestCred}
                name="fav_language"
                value="HTML"
                className="form-radio h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-700">Guest User Credentials</span>
            </label>
          </div>
          <div className="mt-2">
            <NavLink to="/ForgetPassword" className="text-blue-500">
              Forget Password
            </NavLink>
          </div>
        </div>

        <Separator className="w-full h-px bg-gray-300 my-4" />
        <p className="mr-4">
          Don&apos;t have any account ?{" "}
          <NavLink to="/SignUp" className="text-blue-500">
            Sign Up
          </NavLink>
        </p>
        <Separator className="w-full h-px bg-gray-300 my-4" />
        <div>
          Note:
          <p>
            1. Please allow up to 1 minute for login or account creation
            attempts using dummy credentials. Due to the free-tier limitations
            on Render
          </p>
          <p>
            2. This project is a <strong>work-in-progress</strong>. The frontend{" "}
            <strong>UI components</strong> have been fully designed and
            implemented, providing a polished and interactive user experience.
            Additionally, <strong>Authentication</strong>,
            <strong>Authorization</strong>, and{" "}
            <strong>Profile data management</strong>
            have been completed on both the frontend and backend sides. However,
            the backend functionality is still being finalized, with some
            endpoints and features in development.
          </p>
        </div>
      </form>
    </div>
  );
};
export default Login;
