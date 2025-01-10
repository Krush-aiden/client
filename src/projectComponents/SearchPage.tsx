import { NavLink, useNavigate } from "react-router-dom";
import FilterPage from "./FilterPage";
import { Globe, MapPin, Search, X } from "lucide-react";
import { useState } from "react";
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

function SearchPage() {
  const [searchText, setSearchText] = useState<string>("");
  const navigate = useNavigate(); // Assuming you want to navigate based on search input

  return (
    <div className="max-w-full mx-auto my-10">
      <div className="flex flex-col md:flex-row w-full gap-10">
        {/* Filter Section (aligned right on large devices, left on small devices) */}
        <FilterPage />
        <div className="flex-1">
          {/* Search Section */}
          <div className="w-full relative flex items-center gap-2 justify-center md:justify-start">
            <Search className="text-gray-500 absolute inset-y-3 left-4 w-6 h-6" />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search for food..."
              className="bg-white border border-gray-300 text-gray-700 rounded-md w-full pl-12 py-3 shadow-md focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-200 ease-in-out"
            />
            {/* Make the search button full width */}
            <button
              onClick={() => navigate(`/Search/${searchText}`)}
              className="bg-orange hover:bg-hoverOrange text-white px-3 py-2 rounded-md w-20 mt-0 md:md-0"
            >
              Search
            </button>
          </div>
          {/* Search Item Display here */}
          <div className="flex flex-wrap gap-3 lg:items-start md:flex-col md:items-center md:gap-2 my-3">
            <h1 className="font-medium text-lg">(2) Search result found :</h1>
            <div className="flex flex-wrap gap-2 mr-4 md:mb-0">
              {["Dosa", "Puri", "Zira-rice"].map(
                (selecteedFilter: string, idx: number) => {
                  return (
                    <div
                      className="relative inline-flex items-center max-w-full"
                      key={idx}
                    >
                      <Badge
                        className="text-[#D19254] rounded-md hover:cursor-pointer pr-6 whitespace-normal"
                        variant={"outline"}
                      >
                        {selecteedFilter}
                      </Badge>
                      <X
                        className="absolute text-black right-2 hover:cursor-pointer"
                        size={16}
                      />
                    </div>
                  );
                }
              )}
            </div>
          </div>
          {/* Resturant Card Display*/}
          <div className="grid md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((_data: number, idx: number) => {
              return (
                <Card
                  key={idx}
                  className="bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300"
                >
                  <CardHeader>
                    <div className="relative">
                      <AspectRatio ratio={16 / 9} className="bg-muted">
                        <img src={PizzaImg} alt="" />
                      </AspectRatio>
                      <div className="absolute top-2 left-2 bg-white dark:bg-gray-700 bg-opacity-75 rounded-lg px-2 py-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Featured
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-3 md:p-3">
                    {/* <div className="p-4"> */}
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      Pizza buzz
                    </h1>
                    <div className="mt-2 gap-1 flex items-center text-gray-600 dark:text-gray-400">
                      <MapPin size={16} />
                      <p className="text-sm">
                        City:{}
                        <span className="font-medium">Mumbai</span>
                      </p>
                    </div>
                    <div className="mt-2 gap-1 flex items-center text-gray-600 dark:text-gray-400">
                      <Globe size={16} />
                      <p className="text-sm">
                        Country:{}
                        <span className="font-medium">India</span>
                      </p>
                    </div>
                    <div className="flex gap-2 mt-4 flex-wrap">
                      {["Burger", "momos", "Patty"].map(
                        (cuisine: string, idx: number) => {
                          return (
                            <Badge
                              key={idx}
                              className="font-medium px-2 py-1 rounded-full shadow-sm"
                            >
                              {cuisine}
                            </Badge>
                          );
                        }
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 border-t dark:border-t-gray-700 border-t-gray-100 text-white flex justify-end">
                    <NavLink to={`/Restaurant/${123}`}>
                      <Button className="bg-orange hover:bg-HoverOrange font-semibold py-2 px-4 rounded-full shadow-md transition-colors duration-200">
                        View Menus
                      </Button>
                    </NavLink>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchPage;
