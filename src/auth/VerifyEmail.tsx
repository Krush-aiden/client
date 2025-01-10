// import { Input } from "@/components/ui/input";
import { useState, useRef } from "react";

const VerifyEmail = () => {
  const inputRef = useRef<(HTMLInputElement | null)[]>([]);

  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  console.log("🚀 ~ VerifyEmail ~ otp:", otp);

  const handleChange = (index: number, value: string) => {
    if (/^[a-zA-Z0-9]$/.test(value) || value === "") {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
    }
    //Move to the next Input field if a
    console.log("🚀 ~ handleChange ~ value:", value);
    console.log("🚀 ~ handleChange ~ inputRef.current[index:", inputRef.current[index]);
    if (/^[a-zA-Z0-9]$/.test(value) && index < 5) {
      inputRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key == "Backspace" && otp[index] === "" && index > 0) {
      console.log("if");
      inputRef.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-full bg-white">
      <div className="p-8 rounded-md w-full max-w-md flex flex-col gap-10 border border-gray-200 bg-white">
        <div className="text-center">
          <h1 className="font-extrabold text-2xl">Verify your e-mail</h1>
          <p className="text-sm text-gray-600">Enter the 6 digit code</p>
        </div>
        <form action="">
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
        </form>
      </div>
    </div>
  );
};

export default VerifyEmail;
