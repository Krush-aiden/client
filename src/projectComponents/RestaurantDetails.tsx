import Image from "@/assets/Hero_Page_Pizza.jpg";
import { Badge } from "@/components/ui/badge";
import { Timer } from "lucide-react";
import AvailableMenu from "./AvailableMenu";

const RestaurantDetails = () => {
    return (
      <div className="max-w-6xl mx-auto my-10">
        <div className="w-full flex flex-col items-start">
          <div className="relative w-full h-32 md:h-64 lg:h-72">
            <img
              src={Image}
              alt="res_Image"
              className="object-cover w-full h-full rounded-lg shadow-lg"
            />
          </div>
          <div className="flex flex-wrap md:flex-row justify-between">
            <div className="my-4 flex flex-col items-start">
              <h1 className="font-medium text-2xl">Pizza Buzz</h1>
              <div className="flex gap-2 my-2">
                {["Pizza", "Momos", "patty"].map((cuisine, idx) => {
                  return <Badge key={idx}>{cuisine}</Badge>;
                })}
              </div>
              <div className="flex flex-col md:flex-row gap-2 my-5">
                <div className="flex items-center gap-2">
                  <Timer className="w-6 h-6" />
                  <h2 className="flex items-center gap-2 font-medium">
                    Delivery Time:{" "}
                    <span className="text-[#D19254]">35 mins</span>
                  </h2>
                </div>
              </div>
            </div>
          </div>
          <AvailableMenu>

          </AvailableMenu>
        </div>
      </div>
    );
};

export default RestaurantDetails;