import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, Package, MapPin, IndianRupee } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const API_RESTAURANT_URL: string | undefined =
  import.meta.env.VITE_ENVIRONMENT == "prod"
    ? `${import.meta.env.VITE_BACKEND_USER_API_URL_PROD}/api/v1/restaurantRout`
    : `${import.meta.env.VITE_BACKEND_USER_API_URL_DEV}/api/v1/restaurantRout`;

interface OrderItem {
  _id: string;
  user?: { fullName?: string; email?: string };
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

function Order() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${API_RESTAURANT_URL}/order`, {
          withCredentials: true,
        });
        setOrders(response.data?.orders || []);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      await axios.post(
        `${API_RESTAURANT_URL}/order/${orderId}/status`,
        { status: newStatus },
        { withCredentials: true },
      );
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o)),
      );
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-orange" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-20 mb-10 px-6">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
        Orders Overview
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">
        {orders.length} {orders.length === 1 ? "order" : "orders"} received
      </p>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Package className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-400">
            No orders yet
          </h2>
          <p className="text-gray-400 dark:text-gray-500 mt-1">
            Orders placed by customers will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 border border-gray-200 dark:border-gray-700 transition-shadow hover:shadow-xl"
            >
              {/* Header row */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange/10 flex items-center justify-center">
                    <Package className="w-5 h-5 text-orange" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                      {order.deliveryDetails?.name ||
                        order.user?.fullName ||
                        "Customer"}
                    </h2>
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
                  className={`capitalize px-3 py-1 text-xs font-medium rounded-full ${statusColors[order.status] || "bg-gray-100 text-gray-600"}`}
                >
                  {order.status}
                </Badge>
              </div>

              {/* Details */}
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-3">
                  {order.deliveryDetails?.address && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                      <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                      <span>
                        {order.deliveryDetails.address}
                        {order.deliveryDetails.city
                          ? `, ${order.deliveryDetails.city}`
                          : ""}
                      </span>
                    </p>
                  )}
                  {order.deliveryDetails?.email && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {order.deliveryDetails.email}
                    </p>
                  )}

                  {/* Cart items */}
                  {order.cartItems && order.cartItems.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {order.cartItems.map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 text-sm"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-10 h-10 object-cover rounded"
                          />
                          <span className="text-gray-700 dark:text-gray-300 flex-1">
                            {item.name}{" "}
                            <span className="text-gray-400">
                              x{item.quantity}
                            </span>
                          </span>
                          <span className="text-gray-600 dark:text-gray-300 font-medium flex items-center">
                            <IndianRupee className="w-3 h-3" />
                            {item.price * item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {order.totalAmount != null && (
                    <p className="text-base font-semibold text-gray-800 dark:text-gray-100 pt-2 border-t border-gray-100 dark:border-gray-700 flex items-center gap-1">
                      Total: <IndianRupee className="w-4 h-4" />
                      {order.totalAmount}
                    </p>
                  )}
                </div>

                {/* Status dropdown */}
                <div className="w-full sm:w-56 shrink-0">
                  <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Update Status
                  </Label>
                  <Select
                    value={order.status}
                    onValueChange={(val) => handleStatusChange(order._id, val)}
                    disabled={updatingId === order._id}
                  >
                    <SelectTrigger>
                      {updatingId === order._id ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />{" "}
                          Updating...
                        </span>
                      ) : (
                        <SelectValue placeholder="Select Status" />
                      )}
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {[
                          "pending",
                          "confirmed",
                          "preparing",
                          "outForDelivery",
                          "delivered",
                        ].map((status, index) => (
                          <SelectItem key={index} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Order;
