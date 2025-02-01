import { Search } from "lucide-react";
import { useState } from "react";
import pizza_3000285_1280 from "@/assets/pizza-3000285_1280.png";
import { useNavigate } from "react-router-dom";

function HeroSection() {
  const [searchText, setSearchText] = useState<string>("");
  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row max-w-7xl mx-auto md:p-18 rounded-lg items-center justify-center m-4 mt-10 md:mt-20 gap-20 h-full">
      {/* Left side with text */}
      <div className="flex flex-col gap-10 w-full md:w-[50%] justify-center">
        <div className="flex flex-col gap-5 text-center md:text-left">
          <h5 className="font-bold md:font-extrabold md:text-5xl text-4xl">
            Order Food anytime, anywhere
          </h5>
          <p className="text-gray-500">
            Hey! Our delicious food is waiting for you, and we are always near
            you.
          </p>
        </div>
        <div className="relative flex items-center gap-2 justify-center md:justify-start">
          <Search className="text-gray-500 absolute inset-y-2 left-4 w-6 h-6" />
          <input
            className="bg-white border-gray-500 border-2 px-4 py-2 shadow-lg rounded-md w-full pl-12"
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search for food..."
          />
          <button
            onClick={() => {
              if (searchText) navigate(`/Search/${searchText}`);
            }}
            className="bg-orange hover:bg-hoverOrange text-white px-4 py-2 rounded-md"
          >
            Search
          </button>
        </div>
      </div>

      {/* Right side with image */}
      <div className="w-full md:w-[50%]">
        <img
          src={pizza_3000285_1280}
          alt="Delicious Pizza"
          className="object-contain sm:h-[400px] md:h-[600px] lg:h-[600px] w-full sm:w-full md:w-auto lg:w-auto"
        />
      </div>
    </div>
  );
}

export default HeroSection;
