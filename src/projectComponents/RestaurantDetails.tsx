import { Badge } from "@/components/ui/badge";
import { Timer, MapPin, Globe, Loader2, Star, XCircle } from "lucide-react";
import AvailableMenu from "./AvailableMenu";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const API_RESTAURANT_URL: string | undefined =
  import.meta.env.VITE_ENVIRONMENT == "prod"
    ? `${import.meta.env.VITE_BACKEND_USER_API_URL_PROD}/api/v1/restaurantRout`
    : `${import.meta.env.VITE_BACKEND_USER_API_URL_DEV}/api/v1/restaurantRout`;

const RestaurantDetails = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurant = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const response = await axios.get(`${API_RESTAURANT_URL}/${id}`);
        setRestaurant(response.data);
      } catch (error) {
        console.error("Failed to fetch restaurant:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurant();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-orange" />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500 dark:text-gray-400 text-xl">
          Restaurant not found.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-20 mb-10 px-4">
      {/* Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden shadow-xl">
        <img
          src={restaurant.imageUrl}
          alt={restaurant.restaurantName}
          className="object-cover w-full h-48 md:h-72 lg:h-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-4xl font-bold">
                {restaurant.restaurantName}
              </h1>
              <div className="flex items-center gap-4 mt-2 text-sm text-white/80">
                <span className="flex items-center gap-1">
                  <MapPin size={14} />
                  {restaurant.city}
                </span>
                <span className="flex items-center gap-1">
                  <Globe size={14} />
                  {restaurant.country}
                </span>
                <span className="flex items-center gap-1">
                  <Timer size={14} />
                  {restaurant.deliveryTime} mins
                </span>
              </div>
            </div>
            {restaurant.isActive !== false ? (
              <div className="flex items-center gap-1.5 bg-green-500/20 text-green-300 border border-green-500/30 px-3 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm">
                <Star className="w-3.5 h-3.5 fill-current" />
                Open Now
              </div>
            ) : (
              <div className="flex items-center gap-1.5 bg-red-500/20 text-red-300 border border-red-500/30 px-3 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm">
                <XCircle className="w-3.5 h-3.5" />
                Closed
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Closed Banner */}
      {restaurant.isActive === false && (
        <div className="mt-4 flex items-center gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-xl px-4 py-3">
          <XCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">
            This restaurant is currently{" "}
            <span className="font-bold">closed</span> and not accepting orders.
            You can browse the menu but cannot add items to your cart.
          </p>
        </div>
      )}

      {/* Cuisines */}
      {restaurant.cuisines?.length > 0 && (
        <div className="flex gap-2 mt-5 flex-wrap">
          {restaurant.cuisines.map((cuisine: string, idx: number) => (
            <Badge
              key={idx}
              className="bg-orange/10 text-orange border-orange/20 hover:bg-orange/20 dark:bg-orange/20 dark:text-orange"
            >
              {cuisine}
            </Badge>
          ))}
        </div>
      )}

      {/* Menu Section */}
      <AvailableMenu
        menus={restaurant.menus || []}
        restaurantId={restaurant._id}
        isActive={restaurant.isActive}
      />
    </div>
  );
};

export default RestaurantDetails;
