import { NavLink, useNavigate, useParams } from "react-router-dom";
import FilterPage from "./FilterPage";
import {
  Globe,
  MapPin,
  Search,
  X,
  Loader2,
  Clock,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import PizzaImg from "@/assets/Hero_Page_Pizza.jpg";
import { Button } from "@/components/ui/button";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

const API_RESTAURANT_URL: string | undefined =
  import.meta.env.VITE_ENVIRONMENT == "prod"
    ? `${import.meta.env.VITE_BACKEND_USER_API_URL_PROD}/api/v1/restaurantRout`
    : `${import.meta.env.VITE_BACKEND_USER_API_URL_DEV}/api/v1/restaurantRout`;

function SearchPage() {
  const { text } = useParams();
  const [searchText, setSearchText] = useState<string>(text || "");
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [closedRestaurant, setClosedRestaurant] = useState<any>(null);

  const fetchResults = async (
    query: string,
    cuisines: string[] = [],
    signal?: AbortSignal,
  ) => {
    if (!query) return;
    setLoading(true);
    try {
      const params: any = {};
      if (cuisines.length > 0) {
        params.selectedCuisines = cuisines.join(",");
      }
      const response = await axios.post(
        `${API_RESTAURANT_URL}/search/${encodeURIComponent(query)}`,
        {},
        { params, signal },
      );
      setRestaurants(response.data?.data || []);
    } catch (error) {
      if (!axios.isCancel(error)) {
        console.error("Search error:", error);
        setRestaurants([]);
      }
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (text) {
      setSearchText(text);
      // Save to recent searches
      const key = "recentSearches";
      const stored = JSON.parse(localStorage.getItem(key) || "[]") as string[];
      const filtered = stored.filter(
        (s) => s.toLowerCase() !== text.toLowerCase(),
      );
      filtered.unshift(text);
      localStorage.setItem(key, JSON.stringify(filtered.slice(0, 5)));

      const controller = new AbortController();
      fetchResults(text, selectedFilters, controller.signal);
      return () => controller.abort();
    }
  }, [text]);

  const handleSearch = () => {
    if (searchText) {
      navigate(`/Search/${searchText}`);
      fetchResults(searchText, selectedFilters);
    }
  };

  const handleFilterChange = (cuisines: string[]) => {
    setSelectedFilters(cuisines);
    fetchResults(searchText || text || "", cuisines);
  };

  const removeFilter = (filter: string) => {
    const updated = selectedFilters.filter((f) => f !== filter);
    setSelectedFilters(updated);
    fetchResults(searchText || text || "", updated);
  };

  return (
    <div className="max-w-7xl mx-auto mt-20 mb-10 px-4">
      <div className="flex flex-col md:flex-row w-full gap-10">
        {/* Filter Section */}
        <FilterPage
          selectedFilters={selectedFilters}
          onFilterChange={handleFilterChange}
        />
        <div className="flex-1">
          {/* Search Section */}
          <div className="w-full relative flex items-center gap-2">
            <div className="flex items-center bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 w-full p-1.5">
              <Search className="text-gray-400 ml-3 w-5 h-5 shrink-0" />
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search by restaurant, city, country, or cuisine..."
                className="bg-transparent text-gray-700 dark:text-white w-full px-3 py-2.5 focus:outline-none"
              />
              <button
                onClick={handleSearch}
                className="bg-orange hover:bg-hoverOrange text-white px-5 py-2.5 rounded-lg font-medium shrink-0 transition-colors"
              >
                Search
              </button>
            </div>
          </div>
          {/* Search Item Display here */}
          <div className="flex flex-wrap gap-3 lg:items-start md:flex-col md:items-center md:gap-2 my-4">
            <h1 className="font-semibold text-lg dark:text-white">
              {restaurants.length}{" "}
              {restaurants.length === 1 ? "result" : "results"} found
            </h1>
            {selectedFilters.length > 0 && (
              <div className="flex flex-wrap gap-2 mr-4 md:mb-0">
                {selectedFilters.map((filter: string, idx: number) => (
                  <div
                    className="relative inline-flex items-center max-w-full"
                    key={idx}
                  >
                    <Badge
                      className="text-[#D19254] rounded-md hover:cursor-pointer pr-6 whitespace-normal"
                      variant={"outline"}
                    >
                      {filter}
                    </Badge>
                    <X
                      className="absolute text-black dark:text-white right-2 hover:cursor-pointer"
                      size={16}
                      onClick={() => removeFilter(filter)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Loading */}
          {loading && (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-orange" />
            </div>
          )}
          {/* Restaurant Card Display */}
          {!loading && restaurants.length === 0 && (
            <div className="text-center py-10">
              <h2 className="text-xl text-gray-500 dark:text-gray-400">
                No restaurants found. Try a different search.
              </h2>
            </div>
          )}
          <div className="grid md:grid-cols-3 gap-5">
            {!loading &&
              restaurants.map((restaurant: any, idx: number) => (
                <Card
                  key={restaurant._id || idx}
                  className="group bg-white dark:bg-gray-800 shadow-sm hover:shadow-xl rounded-2xl overflow-hidden transition-all duration-300 border border-gray-100 dark:border-gray-700"
                >
                  <CardHeader className="p-0">
                    <div className="relative overflow-hidden">
                      <AspectRatio ratio={16 / 9} className="bg-muted">
                        <img
                          src={restaurant.imageUrl || PizzaImg}
                          alt={restaurant.restaurantName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </AspectRatio>
                      <div className="absolute top-3 left-3">
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm ${
                            restaurant.isActive !== false
                              ? "bg-green-500/20 text-green-100 border border-green-500/30"
                              : "bg-red-500/20 text-red-100 border border-red-500/30"
                          }`}
                        >
                          {restaurant.isActive !== false ? "Open" : "Closed"}
                        </span>
                      </div>
                      {restaurant.deliveryTime && (
                        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                          <Clock size={12} />
                          {restaurant.deliveryTime} mins
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      {restaurant.restaurantName}
                    </h2>
                    <div className="flex items-center gap-3 mt-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <MapPin size={14} />
                        {restaurant.city}
                      </span>
                      <span className="flex items-center gap-1">
                        <Globe size={14} />
                        {restaurant.country}
                      </span>
                    </div>
                    <div className="flex gap-1.5 mt-3 flex-wrap">
                      {restaurant.cuisines?.map(
                        (cuisine: string, cIdx: number) => (
                          <Badge
                            key={cIdx}
                            className="bg-orange/10 text-orange border-orange/20 text-xs font-medium px-2 py-0.5 rounded-full"
                          >
                            {cuisine}
                          </Badge>
                        ),
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    {restaurant.isActive !== false ? (
                      <NavLink
                        to={`/Restaurant/${restaurant._id}`}
                        className="w-full"
                      >
                        <Button className="bg-orange hover:bg-HoverOrange w-full font-medium py-2.5 rounded-xl shadow-sm hover:shadow-lg hover:shadow-orange/20 transition-all">
                          View Menu
                        </Button>
                      </NavLink>
                    ) : (
                      <Button
                        onClick={() => setClosedRestaurant(restaurant)}
                        className="w-full font-medium py-2.5 rounded-xl bg-gray-400 hover:bg-gray-500 text-white transition-all cursor-pointer"
                      >
                        View Menu
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
          </div>
        </div>
      </div>

      {/* Closed Restaurant Modal */}
      <Dialog
        open={!!closedRestaurant}
        onOpenChange={() => setClosedRestaurant(null)}
      >
        <DialogContent className="max-w-sm text-center">
          <div className="flex flex-col items-center gap-3 py-2">
            <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <XCircle className="w-7 h-7 text-red-500" />
            </div>
            <DialogTitle className="text-xl font-bold text-gray-800 dark:text-white">
              Restaurant is Closed
            </DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400">
              <span className="font-semibold text-gray-700 dark:text-gray-200">
                {closedRestaurant?.restaurantName}
              </span>{" "}
              is currently closed and not accepting orders.
            </DialogDescription>
            <div className="flex flex-col gap-2 w-full mt-1">
              <Button
                onClick={() => {
                  navigate(`/Restaurant/${closedRestaurant?._id}`);
                  setClosedRestaurant(null);
                }}
                variant="outline"
                className="w-full border-gray-300"
              >
                Browse Menu Anyway
              </Button>
              <Button
                onClick={() => setClosedRestaurant(null)}
                className="w-full bg-orange hover:bg-HoverOrange text-white"
              >
                OK, Got it
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default SearchPage;
