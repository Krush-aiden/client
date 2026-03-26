import {
  Search,
  UtensilsCrossed,
  Clock,
  MapPin,
  ChefHat,
  ArrowRight,
} from "lucide-react";
import { useState } from "react";
import pizza_3000285_1280 from "@/assets/pizza-3000285_1280.png";
import { useNavigate } from "react-router-dom";
import AdminDashboard from "@/admin/AdminDashboard";

const popularCuisines = [
  "Pizza",
  "Biryani",
  "Burger",
  "Sushi",
  "Pasta",
  "Thali",
  "Chinese",
  "Dosa",
];

const features = [
  {
    icon: Clock,
    title: "Fast Delivery",
    desc: "Get your food delivered in 30 mins or less",
  },
  {
    icon: UtensilsCrossed,
    title: "Wide Selection",
    desc: "Hundreds of restaurants and cuisines to choose from",
  },
  {
    icon: ChefHat,
    title: "Top Chefs",
    desc: "Meals prepared by the best chefs in your city",
  },
  {
    icon: MapPin,
    title: "Live Tracking",
    desc: "Track your order in real-time from kitchen to door",
  },
];

function HeroSection() {
  const [searchText, setSearchText] = useState<string>("");
  const navigate = useNavigate();

  const adminVal = localStorage.getItem("users");
  let adminParsed: any[] = [];
  if (adminVal) {
    try {
      adminParsed = JSON.parse(adminVal);
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  }
  const isAdmin = adminParsed[0]?.user?.admin || false;

  if (isAdmin) {
    return <AdminDashboard />;
  }

  return (
    <div className="w-full">
      {/* Info Banner */}
      <div className="mt-16 mx-auto max-w-7xl px-4 pt-3">
        <div className="rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30 px-4 py-2.5 text-sm text-amber-700 dark:text-amber-300">
          Please allow up to 1 minute for login or account creation attempts
          using dummy credentials, due to the free-tier limitations on Render.
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 min-h-[85vh] flex items-center">
        {/* Decorative blobs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-orange/5 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-12 py-16 md:py-0 w-full">
          {/* Left Content */}
          <div className="flex-1 text-center md:text-left space-y-6 z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange/10 dark:bg-orange/20 rounded-full text-orange text-sm font-medium">
              <span className="w-2 h-2 bg-orange rounded-full animate-pulse" />
              #1 Food Delivery Platform
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight">
              Delicious food,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange to-red-500">
                delivered fast
              </span>
            </h1>

            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-lg mx-auto md:mx-0">
              Discover the best restaurants near you and get your favourite
              meals delivered to your doorstep in minutes.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto md:mx-0">
              <div className="flex items-center bg-white dark:bg-gray-800 rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-gray-900/50 border border-gray-100 dark:border-gray-700 p-2">
                <Search className="text-gray-400 ml-4 w-5 h-5 shrink-0" />
                <input
                  className="flex-1 bg-transparent px-4 py-3 text-gray-800 dark:text-white focus:outline-none placeholder-gray-400"
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && searchText)
                      navigate(`/Search/${searchText}`);
                  }}
                  placeholder="Search for restaurants, cuisines..."
                />
                <button
                  onClick={() => {
                    if (searchText) navigate(`/Search/${searchText}`);
                  }}
                  className="bg-orange hover:bg-hoverOrange text-white px-6 py-3 rounded-xl font-medium transition-all hover:shadow-lg hover:shadow-orange/25 flex items-center gap-2"
                >
                  Search
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Cuisine Tags */}
            <div className="flex flex-wrap gap-2 justify-center md:justify-start pt-2">
              <span className="text-sm text-gray-500 dark:text-gray-400 mr-1 self-center">
                Popular:
              </span>
              {popularCuisines.map((cuisine) => (
                <button
                  key={cuisine}
                  onClick={() => navigate(`/Search/${cuisine}`)}
                  className="px-3 py-1.5 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-gray-700 dark:text-gray-300 hover:border-orange hover:text-orange dark:hover:text-orange transition-colors cursor-pointer"
                >
                  {cuisine}
                </button>
              ))}
            </div>
          </div>

          {/* Right - Hero Image */}
          <div className="flex-1 flex justify-center md:justify-end z-10">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-tr from-orange/20 to-red-400/20 rounded-full blur-2xl" />
              <img
                src={pizza_3000285_1280}
                alt="Delicious Food"
                className="relative object-contain h-[350px] sm:h-[450px] md:h-[550px] drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              Why choose <span className="text-orange">FoodSy</span>?
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-3 max-w-xl mx-auto">
              We make ordering food an effortless experience with features
              designed for your convenience.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat, i) => (
              <div
                key={i}
                className="group bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 hover:border-orange/50 hover:shadow-lg hover:shadow-orange/5 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-orange/10 dark:bg-orange/20 flex items-center justify-center mb-4 group-hover:bg-orange group-hover:text-white transition-colors">
                  <feat.icon className="w-6 h-6 text-orange group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feat.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-orange to-red-500">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Hungry? You're in the right place
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Browse top-rated restaurants near you and order your favourite meals
            with just a few clicks.
          </p>
          <button
            onClick={() => {
              const el = document.querySelector("input[type='text']");
              if (el) (el as HTMLInputElement).focus();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="inline-flex items-center gap-2 bg-white text-orange px-8 py-3.5 rounded-xl font-semibold hover:bg-gray-50 transition-colors shadow-lg"
          >
            Order Now
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>
    </div>
  );
}

export default HeroSection;
