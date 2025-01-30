import { Loader2 } from "lucide-react";
import { useState, useRef, FormEvent, useEffect } from "react";
import { verifyEmail } from "@/feature/UserSlicer";
import { AppDispatch } from "@/app/store";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  const inputRef = useRef<(HTMLInputElement | null)[]>([]);

  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);

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
    e: React.KeyboardEvent<HTMLInputElement>
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
        dispatch(
          await verifyEmail({ verifyEmailCode: verificationCodeVal })
        ).unwrap();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setLoading(isLoading);
    if (users[0]?.success && users[0]?.user?.isVerified) {
      navigate("/login");
    }
  }, [navigate, isLoading, users]);

  return (
    <div className="flex items-center justify-center h-screen w-full bg-white">
      <div className="p-8 rounded-md w-full max-w-md flex flex-col gap-10 border border-gray-200 bg-white">
        <div className="text-center">
          <h1 className="font-extrabold text-2xl">Verify your e-mail</h1>
          <p className="text-sm text-gray-600">Enter the 6 digit code</p>
        </div>
        <form onSubmit={submitHandler}>
          <div className="flex gap-2 justify-center">
            {otp.map((letter: string, idx: number) => {
              //   console.log("🚀 ~ idx:", idx);
              //   console.log("🚀 ~ letter:", letter);
              return (
                <input
                  type="text"
                  key={idx}
                  value={letter}
                  maxLength={1}
                  className="md:w-12 md:h-12 w-8 h-8 bg-white text-black text-center text-sm md:text-2xl font-normal md:font-bold rounded-lg border border-gray-600"
                  ref={(element) => (inputRef.current[idx] = element)}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleChange(idx, e.target.value)
                  }
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
                    handleKeyDown(idx, e)
                  }
                />
              );
            })}
          </div>
          <div className="mb-10">
            {loading ? (
              <button
                disabled
                className="w-full bg-orange flex items-center justify-center py-2 px-3 mt-10 opacity-50 cursor-not-allowed"
              >
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                Please wait
              </button>
            ) : (
              <button
                type="submit"
                className="w-full bg-orange hover:bg-hoverOrange py-3 px-4 mt-10"
              >
                Login
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmail;
