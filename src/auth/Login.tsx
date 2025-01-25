import { Separator } from "@radix-ui/react-separator";
import { Loader2, Lock, Mail } from "lucide-react";
import { NavLink } from "react-router-dom";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { LoginInputState, userLoginSchema } from "@/schema/userSchema";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/app/store";
import { toast } from "react-toastify";
import { signUpUser } from "@/feature/UserSlicer";

const Login = () => {
  const loading = false;

  const [Input, setInput] = useState<LoginInputState>({
    email: "",
    password: "",
  });

  const changeEventHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInput({ ...Input, [name]: value });
  };

  const [errorMsg, setErrorMsg] = useState<Partial<LoginInputState>>({});

  console.log("errorMsg", errorMsg);
  const [errorState, setErrorState] = useState<boolean>();
  console.log(errorState);

  const dispatch = useDispatch<AppDispatch>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const loginApiRes: any = useSelector<any>((state) => state.user);

  const loginSubmitHandler = (e: FormEvent) => {
    e.preventDefault();
    const result = userLoginSchema.safeParse(Input);
    setErrorState(result.success);

    if (!result.success) {
      const fieldError = result.error.formErrors.fieldErrors;
      console.log(fieldError);
      setErrorMsg(fieldError as Partial<LoginInputState>);
      return;
    }

    const payload = { userDetails: Input };

    console.log("🚀 ~ loginSubmitHandler ~ payload:", payload);
    // Dispatch the action with the correct payload structure

    dispatch(signUpUser(payload));
    if (loginApiRes.message !== "") {
      toast.error(loginApiRes.message);
    }
  };

  useEffect(() => {
    console.log("🚀 ~ Signup ~ loginApiRes:", loginApiRes);
    console.log("🚀 ~ useEffect ~ loginApiRes.message:", loginApiRes.message);
    if (loginApiRes.message !== "") {
      toast.error(loginApiRes.message);
    }
  }, [loginApiRes, loginApiRes.message]);

  return (
    <div className="flex items-center justify-center min-h-screen">
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
      </form>
    </div>
  );
};
export default Login;
