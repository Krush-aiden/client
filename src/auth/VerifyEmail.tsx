import { Loader2, Mail } from "lucide-react";
import { useState, useRef, FormEvent, useEffect } from "react";
import { verifyEmail } from "@/feature/UserSlicer";
import { AppDispatch } from "@/app/store";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  const inputRef = useRef<(HTMLInputElement | null)[]>([]);

  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [verified, setVerified] = useState(false);

  const handleChange = (index: number, value: string) => {
    if (/^[a-zA-Z0-9]$/.test(value) || value === "") {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
    }
    if (/^[a-zA-Z0-9]$/.test(value) && index < 5) {
      inputRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key == "Backspace" && otp[index] === "" && index > 0) {
      inputRef.current[index - 1]?.focus();
    }
  };
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { isLoading, users }: any = useSelector<any>((state) => state.user);

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();
    const verificationCodeVal = otp.join("");
    try {
      if (verificationCodeVal !== "") {
        const result = await dispatch(
          verifyEmail({ verifyEmailCode: verificationCodeVal }),
        ).unwrap();
        if (result?.success && result?.user?.isVerified) {
          setVerified(true);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  // Only redirect after a successful verification action from this page
  useEffect(() => {
    if (verified) {
      navigate("/login");
    }
  }, [verified, navigate]);

  // If user is already authenticated & verified, redirect to home
  useEffect(() => {
    const isAuth = localStorage.getItem("isAuthenticated") === "true";
    if (isAuth) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen w-full bg-white dark:bg-gray-900">
      <div className="p-8 rounded-2xl w-full max-w-md flex flex-col gap-8 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg">
        <div className="text-center">
          <div className="w-16 h-16 bg-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-orange" />
          </div>
          <h1 className="font-extrabold text-2xl dark:text-white">
            Verify your e-mail
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            We sent a 6-digit code to your email. Enter it below.
          </p>
        </div>
        <form onSubmit={submitHandler}>
          <div className="flex gap-2 justify-center">
            {otp.map((letter: string, idx: number) => (
              <input
                type="text"
                key={idx}
                value={letter}
                maxLength={1}
                className="md:w-12 md:h-12 w-9 h-9 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-center text-sm md:text-2xl font-bold rounded-xl border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange focus:border-orange transition-all"
                ref={(element) => (inputRef.current[idx] = element)}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange(idx, e.target.value)
                }
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
                  handleKeyDown(idx, e)
                }
              />
            ))}
          </div>
          <div className="mt-8">
            {loading ? (
              <button
                disabled
                className="w-full bg-orange/70 text-white flex items-center justify-center py-3 rounded-xl font-medium cursor-not-allowed"
              >
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Verifying...
              </button>
            ) : (
              <button
                type="submit"
                className="w-full bg-orange hover:bg-hoverOrange text-white py-3 rounded-xl font-medium transition-colors"
              >
                Verify Email
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmail;
