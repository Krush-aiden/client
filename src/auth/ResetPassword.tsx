import { Separator } from "@radix-ui/react-separator";
import { Loader2, Mail } from "lucide-react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { resetPasswordSchema, userResetPassword } from "@/schema/userSchema";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/app/store";
import { resetPassword } from "@/feature/UserSlicer";

const ResetPassword = () => {
  const { token } = useParams(); // Capture the token from the URL
  // console.log("🚀 ~ ResetPassword ~ token:", token);

  const [Input, setInput] = useState<userResetPassword>({
    newPassword: "",
  });

  const changeEventHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInput({ ...Input, [name]: value });
  };

  const [errorMsg, setErrorMsg] = useState<Partial<userResetPassword>>({});
  const [loading, setLoading] = useState(false);

  const { isLoading, success }: any = useSelector<any>((state) => state.user);
  const navigate = useNavigate();
  const [errorState, setErrorState] = useState<boolean>();

  const dispatch = useDispatch<AppDispatch>();
  const loginSubmitHandler = (e: FormEvent) => {
    e.preventDefault();
    const result = resetPasswordSchema.safeParse(Input);
    setErrorState(result.success);

    if (!result.success) {
      const fieldError = result.error.formErrors.fieldErrors;
      console.log(fieldError);
      setErrorMsg(fieldError as Partial<userResetPassword>);
      return;
    }
    console.log(Input);
    // console.log("🚀 ~ ResetPassword ~ token:", token);

    // Wrap newPassword and token inside userNewPasswordDetails
    const userNewPasswordDetails = {
      newPassword: Input.newPassword, // Ensure correct property name ('newpassword')
      token: token, // Token must be defined at this point
    };
    // Todo Api implementation starts here

    try {
      dispatch(resetPassword(userNewPasswordDetails)).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setLoading(isLoading);
    if (success) {
      navigate("/login");
    }
  }, [navigate, isLoading, success]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form
        onSubmit={loginSubmitHandler}
        className="md:p-8 w-full max-w-md rounded-lg md:border border-gray-200 mx-4"
      >
        <div className="mb-4">
          <h3 className="font-bold text-2xl">Reset Password</h3>
          <span className="text-sm">Enter your new password</span>
        </div>
        <div className="mb-6">
          <div className="relative">
            <input
              className="w-full px-12 py-3 text-lg text-gray-800 bg-gray-100 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              type="text"
              name="newPassword"
              placeholder="Enter your new password"
              value={Input.newPassword}
              onChange={changeEventHandler}
            />
            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>
          {!errorState && (
            <span className="text-red-500 text-sm">{errorMsg.newPassword}</span>
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
              Reset
            </button>
          )}
        </div>
        <Separator className="w-full h-px bg-gray-300 my-4" />
        <p className="mr-4">
          Back to{" "}
          <NavLink to="/Login" className="text-blue-500">
            Login
          </NavLink>
        </p>
      </form>
    </div>
  );
};

export default ResetPassword;
