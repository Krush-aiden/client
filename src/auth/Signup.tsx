import { Separator } from "@radix-ui/react-separator";
import { Contact, Loader2, Lock, Mail, User } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { SignupInputState, userSignupSchema } from "@/schema/userSchema";
import { useDispatch, useSelector } from "react-redux";
import { signUpUser } from "@/feature/UserSlicer";
import { AppDispatch } from "@/app/store";
// import { toast } from "sonner";

const Signup = () => {
  // const { toast } = Toaster();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const signupApiRes: any = useSelector<any>((state) => state.user);
  console.log("🚀 ~ Signup ~ signupApiRes:", signupApiRes);
  const [loading, setLoading] = useState(false);

  const [Input, setInput] = useState<SignupInputState>({
    fullName: "",
    contact: "",
    email: "",
    password: "",
  });

  const changeEventHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInput({ ...Input, [name]: value });
  };

  const [errorsMsg, setErrorsMsg] = useState<Partial<SignupInputState>>({});
  const [ErrorState, setErrorState] = useState<boolean>();

  const loginSubmitHandler = async (e: FormEvent) => {
    e.preventDefault();
    const result = userSignupSchema.safeParse(Input);
    setErrorState(result.success);
    if (!result.success) {
      const fieldErrors = result.error.formErrors.fieldErrors;
      setErrorsMsg(fieldErrors as Partial<SignupInputState>);
      return;
    }

    console.log("Input:", Input);
    // Todo Api implementation starts here
    // Wrap the Input data inside the expected structure
    const payload = { signupUserDetails: Input };
    // Dispatch the action with the correct payload structure
    console.log("🚀 ~ loginSubmitHandler ~ signupApiRes:", signupApiRes);
    // if (signupApiRes.users.length <= 0) {

    // }
    try {
      setLoading(signupApiRes.isLoading);
      await dispatch(signUpUser(payload)).unwrap();
      // window.location.reload();
    } catch (error) {
      console.error("Logout failed:", error);
    }
    navigate("/verifyEmail");
  };

  useEffect(() => {
    if (signupApiRes?.users[0]?.success) {
      console.log("🚀 ~ useEffect ~ signupApiRes:", signupApiRes);
      navigate("/VerifyEmail");
    }
  }, [signupApiRes, navigate]);

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
              type="text"
              name="fullName"
              placeholder="fullName"
              value={Input.fullName}
              onChange={changeEventHandler}
            />
            <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>
          {!ErrorState && (
            <span className="text-sm text-red-500">{errorsMsg.fullName}</span>
          )}
        </div>

        <div className="mb-6">
          <div className="relative">
            <input
              className="w-full px-12 py-3 text-lg text-gray-800 bg-gray-100 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              name="contact"
              placeholder="Contact"
              //   value={Input.contact}
              onChange={changeEventHandler}
            />
            <Contact className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>
          {!ErrorState && (
            <span className="text-sm text-red-500">{errorsMsg.contact}</span>
          )}
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
          {!ErrorState && (
            <span className="text-sm text-red-500">{errorsMsg.email}</span>
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
          {!ErrorState && (
            <span className="text-sm text-red-500">{errorsMsg.password}</span>
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
              Sign Up
            </button>
          )}
        </div>
        <Separator className="w-full h-px bg-gray-300 my-4" />
        <p className="mr-4">
          Already have account ?{" "}
          <NavLink to="/Login" className="text-blue-500">
            Login
          </NavLink>
        </p>
      </form>
    </div>
  );
};

export default Signup;
