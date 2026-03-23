import { Separator } from "@radix-ui/react-separator";
import { Loader2, Lock, Mail } from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { LoginInputState, userLoginSchema } from "@/schema/userSchema";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/app/store";
import { loginUser, googleLogin } from "@/feature/UserSlicer";
import { ChevronDown } from "lucide-react";

declare global {
  interface Window {
    google: any;
  }
}

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
  const [googleAuthError, setGoogleAuthError] = useState("");
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
      console.error("Login failed:", error);
    }
  };

  const handleGoogleSuccess = useCallback(
    (response: any) => {
      const { credential } = response;
      const payload = { googleToken: credential };
      try {
        dispatch(googleLogin(payload)).unwrap();
      } catch (error) {
        console.error("Google login failed:", error);
      }
    },
    [dispatch],
  );

  const googleInitialized = useRef(false);
  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (!clientId) {
      console.error("Google Client ID missing");
      setGoogleAuthError(
        "Google sign-in is unavailable right now. Please use email login.",
      );
      return;
    }

    const loadGoogleScript = () => {
      if (document.getElementById("google-script")) {
        initializeGoogle();
        return;
      }

      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.id = "google-script";

      script.onload = initializeGoogle;
      script.onerror = () => {
        setGoogleAuthError(
          "Unable to load Google sign-in script. Check browser privacy/ad-block settings.",
        );
      };
      document.body.appendChild(script);
    };

    const initializeGoogle = () => {
      if (!window.google || googleInitialized.current) return;

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleSuccess,
      });

      const container = document.getElementById("googleSignInButton");
      if (container) {
        container.innerHTML = "";
        setGoogleAuthError("");
        window.google.accounts.id.renderButton(container, {
          theme: "outline",
          size: "large",
          width: 400,
          text: "continue_with",
        });
      }

      googleInitialized.current = true;
    };

    loadGoogleScript();
  }, [handleGoogleSuccess]);

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

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
  const [showInfo, setShowInfo] = useState(false);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-md mx-4 mb-3 flex justify-end">
        <NavLink
          to="/"
          className="flex items-center gap-1 text-sm text-gray-600 hover:text-orange-500 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7A1 1 0 003 11h1v6a1 1 0 001 1h4v-4h2v4h4a1 1 0 001-1v-6h1a1 1 0 00.707-1.707l-7-7z" />
          </svg>
          Home
        </NavLink>
      </div>
      <form
        onSubmit={loginSubmitHandler}
        className="md:p-8 w-full max-w-md rounded-lg md:border border-gray-200 mx-4"
      >
        <div className="mb-4">
          <NavLink
            to="/"
            className="font-bold text-2xl hover:text-orange-500 transition-colors"
          >
            FoodSy
          </NavLink>
        </div>

        {/* Google Sign-In Button */}
        <div className="mb-6">
          {googleAuthError ? (
            <div className="w-full rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-700">
              {googleAuthError}
            </div>
          ) : (
            <div
              id="googleSignInButton"
              className="flex justify-center w-full"
            ></div>
          )}
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="text-gray-500 text-sm">Or continue with email</span>
          <div className="flex-grow border-t border-gray-300"></div>
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
          <div className="space-y-2 mt-4">
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
        <div className="mt-4">
          <button
            type="button"
            onClick={() => setShowInfo((prev) => !prev)}
            className="flex items-center gap-2 text-sm text-gray-700 font-medium"
          >
            Note
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${
                showInfo ? "rotate-180" : ""
              }`}
            />
          </button>

          {showInfo && (
            <div className="mt-2 text-sm text-gray-600 space-y-2">
              <p>
                1. Please allow up to 1 minute for login or account creation
                attempts using dummy credentials. Due to the free-tier
                limitations on Render
              </p>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};
export default Login;
