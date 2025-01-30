import { Separator } from "@radix-ui/react-separator";
import { Loader2, Mail } from "lucide-react";
import { NavLink } from "react-router-dom";
import { ChangeEvent, FormEvent, useState } from "react";
import { forgetPasswordSchema, userForgetPassword } from "@/schema/userSchema";

const ResetPassword = () => {
  const loading = false;

  const [Input, setInput] = useState<userForgetPassword>({
    email: "",
  });

  const changeEventHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInput({ ...Input, [name]: value });
  };

  const [errorMsg, setErrorMsg] = useState<Partial<userForgetPassword>>({});

  console.log("errorMsg", errorMsg);
  const [errorState, setErrorState] = useState<boolean>();
  console.log(errorState);

  const loginSubmitHandler = (e: FormEvent) => {
    e.preventDefault();
    const result = forgetPasswordSchema.safeParse(Input);
    setErrorState(result.success);

    if (!result.success) {
      const fieldError = result.error.formErrors.fieldErrors;
      console.log(fieldError);
      setErrorMsg(fieldError as Partial<userForgetPassword>);
      return;
    }
    console.log(Input);
    // Todo Api implementation starts here
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form
        onSubmit={loginSubmitHandler}
        className="md:p-8 w-full max-w-md rounded-lg md:border border-gray-200 mx-4"
      >
        <div className="mb-4">
          <h3 className="font-bold text-2xl">Forget Password</h3>
          <span className="text-sm">
            Enter your email address to reset your password
          </span>
        </div>
        <div className="mb-6">
          <div className="relative">
            <input
              className="w-full px-12 py-3 text-lg text-gray-800 bg-gray-100 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              type="email"
              name="email"
              placeholder="Enter your e-mail"
              value={Input.email}
              onChange={changeEventHandler}
            />
            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>
          {!errorState && (
            <span className="text-red-500 text-sm">{errorMsg.email}</span>
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
              Send Link
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
