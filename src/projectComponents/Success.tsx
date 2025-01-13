import Image from "@/assets/Hero_Page_Pizza.jpg";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { IndianRupee } from "lucide-react";
import { NavLink } from "react-router-dom";

function Success() {
  const order = [1, 2, 3];
  if (order.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h1 className="font-bold text-2xl text-gray-700 dark:text-gray-300">
          Order not found
        </h1>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:gray-900 px-4">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 max-w-lg w-full">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            Order Status :{" "}
            <span className="text-[#D19254]">{"confirm".toUpperCase()}</span>
          </h1>
        </div>
        <div className="mb-6 text-left">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Order Summary
          </h2>
          {/* your order items display here */}
          <div className="mb-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <img
                  className="w-16 h-16 rounded-md object-cover"
                  src={Image}
                  alt=""
                />
                <h3 className="text-lg ml-4 text-gray-800 dark:text-gray-200 font-medium">
                  Paneer Pizza
                </h3>
              </div>
              <div className="text-right">
                <div className="text-gray-800 dark:text-gray-200 flex items-center">
                  <IndianRupee />
                  <span className="text-lg font-medium">80</span>
                </div>
              </div>
            </div>
            <Separator className="my-4"/>
          </div>
        </div>
        <NavLink to="/" >
            <Button className="bg-orange hover:bg-hoverOrange w-full py-3 rounded-md shadow-lg">Continue Shopping</Button>
        </NavLink>
      </div>
    </div>
  );
}

export default Success;
