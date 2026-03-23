import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  IndianRupee,
  Package,
  Clock,
  Loader2,
  MapPin,
  ShoppingBag,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const API_RESTAURANT_URL: string | undefined =
  import.meta.env.VITE_ENVIRONMENT == "prod"
    ? `${import.meta.env.VITE_BACKEND_USER_API_URL_PROD}/api/v1/restaurantRout`
    : `${import.meta.env.VITE_BACKEND_USER_API_URL_DEV}/api/v1/restaurantRout`;

const statusSteps = [
  "pending",
  "confirmed",
  "preparing",
  "outForDelivery",
  "delivered",
];

const statusLabels: Record<string, string> = {
  pending: "Order Placed",
  confirmed: "Confirmed",
  preparing: "Preparing",
  outForDelivery: "Out for Delivery",
  delivered: "Delivered",
};

const statusColors: Record<string, string> = {
  pending:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  confirmed: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  preparing:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  outfordelivery:
    "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
  delivered:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
};

interface OrderData {
  _id: string;
  restaurant?: { restaurantName?: string; imageUrl?: string };
  deliveryDetails?: {
    name?: string;
    email?: string;
    address?: string;
    city?: string;
  };
  cartItems?: {
    menuId: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
  }[];
  totalAmount?: number;
  status: string;
  createdAt?: string;
}

function Success() {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${API_RESTAURANT_URL}/order/user`, {
          withCredentials: true,
        });
        setOrders(res.data?.orders || []);
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-orange" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-20 mb-10 px-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-orange/10">
          <ShoppingBag className="w-6 h-6 text-orange" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            My Orders
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {orders.length} {orders.length === 1 ? "order" : "orders"}
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-10 text-center">
          <Package className="w-16 h-16 text-gray-200 dark:text-gray-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-400">
            No orders yet
          </h2>
          <p className="text-gray-400 dark:text-gray-500 mt-1 mb-6">
            Your placed orders will appear here.
          </p>
          <NavLink to="/">
            <Button className="bg-orange hover:bg-HoverOrange text-white">
              Browse Restaurants
            </Button>
          </NavLink>
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => {
            const currentStep = statusSteps.indexOf(
              order.status === "outForDelivery"
                ? "outForDelivery"
                : order.status === "delivery"
                  ? "delivered"
                  : order.status,
            );
            return (
              <div
                key={order._id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden"
              >
                {/* Order header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    {order.restaurant?.imageUrl && (
                      <img
                        src={order.restaurant.imageUrl}
                        alt=""
                        className="w-10 h-10 rounded-xl object-cover"
                      />
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-white text-sm">
                        {order.restaurant?.restaurantName || "Restaurant"}
                      </h3>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )
                          : ""}
                      </p>
                    </div>
                  </div>
                  <Badge
                    className={`capitalize text-xs px-3 py-1 rounded-full ${statusColors[order.status?.toLowerCase()] || "bg-gray-100 text-gray-600"}`}
                  >
                    {statusLabels[order.status] || order.status}
                  </Badge>
                </div>

                {/* Progress tracker */}
                {currentStep >= 0 && currentStep < statusSteps.length && (
                  <div className="flex items-center justify-between px-6 py-4">
                    {statusSteps.map((step, i) => (
                      <div
                        key={step}
                        className="flex items-center flex-1 last:flex-initial"
                      >
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${
                              i <= currentStep
                                ? "bg-orange text-white"
                                : "bg-gray-200 dark:bg-gray-700 text-gray-400"
                            }`}
                          >
                            {i < currentStep ? "\u2713" : i + 1}
                          </div>
                          <span className="text-[9px] text-gray-500 dark:text-gray-400 mt-1 text-center w-14 leading-tight">
                            {statusLabels[step]}
                          </span>
                        </div>
                        {i < statusSteps.length - 1 && (
                          <div
                            className={`flex-1 h-0.5 mx-1 mt-[-14px] ${
                              i < currentStep
                                ? "bg-orange"
                                : "bg-gray-200 dark:bg-gray-700"
                            }`}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <Separator />

                {/* Items */}
                <div className="px-5 py-4 space-y-3">
                  {order.cartItems?.map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image || "https://github.com/shadcn.png"}
                          alt={item.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                            {item.name}
                          </p>
                          <span className="text-xs text-gray-400">
                            x{item.quantity}
                          </span>
                        </div>
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                        <IndianRupee className="w-3 h-3" />
                        {item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-5 py-3 bg-gray-50 dark:bg-gray-700/30">
                  {order.deliveryDetails?.address && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 truncate max-w-[60%]">
                      <MapPin className="w-3 h-3 shrink-0" />
                      {order.deliveryDetails.address}
                      {order.deliveryDetails.city
                        ? `, ${order.deliveryDetails.city}`
                        : ""}
                    </p>
                  )}
                  <span className="font-bold text-gray-800 dark:text-white flex items-center text-sm">
                    <IndianRupee className="w-3.5 h-3.5" />
                    {order.totalAmount || 0}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Success;
