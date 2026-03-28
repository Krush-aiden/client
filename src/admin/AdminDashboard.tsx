import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "@/app/store";
import { fetchMenu } from "@/feature/adminMenuSlicer";
import { fetchRestaurantFunction } from "@/feature/adminSlicer";
import { Button } from "@/components/ui/button";
import axios from "axios";
import {
  ClipboardList,
  UtensilsCrossed,
  SquareMenu,
  Clock,
  Plus,
  Eye,
  Settings,
  TrendingUp,
  Package,
  IndianRupee,
  ArrowRight,
  ChefHat,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const API_RESTAURANT_URL: string | undefined =
  import.meta.env.VITE_ENVIRONMENT == "prod"
    ? `${import.meta.env.VITE_BACKEND_USER_API_URL_PROD}/api/v1/restaurantRout`
    : `${import.meta.env.VITE_BACKEND_USER_API_URL_DEV}/api/v1/restaurantRout`;

interface OrderItem {
  _id: string;
  deliveryDetails?: { name?: string; email?: string; city?: string };
  cartItems?: {
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

function AdminDashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { menus } = useSelector((state: any) => state.adminMenu);
  const { restaurantDetails } = useSelector((state: any) => state.admin);

  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  const restaurantName =
    restaurantDetails?.[0]?.restaurant?.[0]?.restaurantName ||
    "Your Restaurant";
  const restaurantImage =
    restaurantDetails?.[0]?.restaurant?.[0]?.imageUrl || "";
  const isActive = restaurantDetails?.[0]?.success;

  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const recentOrders = [...orders]
    .sort(
      (a, b) =>
        new Date(b.createdAt || "").getTime() -
        new Date(a.createdAt || "").getTime(),
    )
    .slice(0, 5);

  useEffect(() => {
    dispatch(fetchMenu());
    dispatch(fetchRestaurantFunction());
    const controller = new AbortController();
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${API_RESTAURANT_URL}/order`, {
          withCredentials: true,
          signal: controller.signal,
        });
        setOrders(res.data?.orders || []);
      } catch {
        /* ignore */
      } finally {
        if (!controller.signal.aborted) {
          setOrdersLoading(false);
        }
      }
    };
    fetchOrders();
    return () => controller.abort();
  }, [dispatch]);

  return (
    <div className="max-w-7xl mx-auto mt-20 mb-10 px-4 md:px-6 space-y-8">
      {/* Hero Header */}
      <div
        className="relative overflow-hidden rounded-2xl p-6 md:p-8 text-white shadow-xl"
        style={{
          background: "linear-gradient(to right, #f97316, #fb923c, #f59e0b)",
        }}
      >
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <div className="relative flex flex-col md:flex-row items-start md:items-center gap-5">
          {restaurantImage ? (
            <img
              src={restaurantImage}
              alt={restaurantName}
              className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover ring-4 ring-white/30 shadow-lg"
            />
          ) : (
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/20 flex items-center justify-center">
              <ChefHat className="w-8 h-8" />
            </div>
          )}
          <div className="flex-1">
            <p className="text-white/80 text-sm font-medium">Welcome back 👋</p>
            <h1 className="text-2xl md:text-3xl font-extrabold mt-1">
              {restaurantName}
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                  isActive
                    ? "bg-green-500/20 text-green-100"
                    : "bg-red-500/20 text-red-100"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${isActive ? "bg-green-300 animate-pulse" : "bg-red-300"}`}
                />
                {isActive ? "Open & Active" : "Setup Needed"}
              </span>
            </div>
          </div>
          <Button
            onClick={() => navigate("/admin/restaurant")}
            variant="outline"
            className="border-white/30 text-white bg-white/10 hover:bg-white/20 backdrop-blur"
          >
            <Settings className="w-4 h-4 mr-2" />
            Manage
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => navigate("/admin/menu")}
          className="group cursor-pointer bg-white dark:bg-gray-800 shadow-md hover:shadow-lg rounded-2xl p-5 border border-gray-100 dark:border-gray-700 transition-all hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/30">
              <SquareMenu className="text-blue-600 dark:text-blue-400 w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-blue-500 transition-colors" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wider">
            Total Menus
          </p>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mt-1">
            {menus?.length ?? 0}
          </h2>
        </div>

        <div
          onClick={() => navigate("/admin/order")}
          className="group cursor-pointer bg-white dark:bg-gray-800 shadow-md hover:shadow-lg rounded-2xl p-5 border border-gray-100 dark:border-gray-700 transition-all hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-xl bg-yellow-100 dark:bg-yellow-900/30">
              <Clock className="text-yellow-600 dark:text-yellow-400 w-5 h-5" />
            </div>
            {pendingOrders > 0 && (
              <span className="flex h-5 w-5">
                <span className="animate-ping absolute h-5 w-5 rounded-full bg-yellow-300 opacity-75" />
                <span className="relative inline-flex rounded-full h-5 w-5 bg-yellow-400 items-center justify-center text-[10px] font-bold text-yellow-900">
                  {pendingOrders}
                </span>
              </span>
            )}
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wider">
            Pending Orders
          </p>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mt-1">
            {ordersLoading ? "…" : pendingOrders}
          </h2>
        </div>

        <div
          onClick={() => navigate("/admin/order")}
          className="group cursor-pointer bg-white dark:bg-gray-800 shadow-md hover:shadow-lg rounded-2xl p-5 border border-gray-100 dark:border-gray-700 transition-all hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-xl bg-green-100 dark:bg-green-900/30">
              <ClipboardList className="text-green-600 dark:text-green-400 w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-green-500 transition-colors" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wider">
            Total Orders
          </p>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mt-1">
            {ordersLoading ? "…" : orders.length}
          </h2>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
              <TrendingUp className="text-emerald-600 dark:text-emerald-400 w-5 h-5" />
            </div>
            <IndianRupee className="w-4 h-4 text-gray-300 dark:text-gray-600" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wider">
            Total Revenue
          </p>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mt-1">
            {ordersLoading ? "…" : `₹${totalRevenue.toLocaleString("en-IN")}`}
          </h2>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => navigate("/admin/menu")}
          className="group flex items-center gap-4 bg-white dark:bg-gray-800 shadow-md hover:shadow-lg rounded-2xl p-5 border border-gray-100 dark:border-gray-700 transition-all hover:-translate-y-0.5 text-left"
        >
          <div className="p-3 rounded-xl bg-blue-600 text-white group-hover:scale-110 transition-transform">
            <Plus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-white">
              Add Menu
            </h3>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Create new dishes
            </p>
          </div>
        </button>

        <button
          onClick={() => navigate("/admin/order")}
          className="group flex items-center gap-4 bg-white dark:bg-gray-800 shadow-md hover:shadow-lg rounded-2xl p-5 border border-gray-100 dark:border-gray-700 transition-all hover:-translate-y-0.5 text-left"
        >
          <div className="p-3 rounded-xl bg-green-600 text-white group-hover:scale-110 transition-transform">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-white">
              View Orders
            </h3>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              {pendingOrders > 0 ? `${pendingOrders} pending` : "Manage orders"}
            </p>
          </div>
        </button>

        <button
          onClick={() => navigate("/admin/restaurant")}
          className="group flex items-center gap-4 bg-white dark:bg-gray-800 shadow-md hover:shadow-lg rounded-2xl p-5 border border-gray-100 dark:border-gray-700 transition-all hover:-translate-y-0.5 text-left"
        >
          <div className="p-3 rounded-xl bg-gray-700 text-white group-hover:scale-110 transition-transform">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-white">
              Edit Restaurant
            </h3>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Update info & settings
            </p>
          </div>
        </button>
      </div>

      {/* Two-Column: Recent Orders + Menu Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700">
            <h2 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
              <Package className="w-4 h-4 text-orange" />
              Recent Orders
            </h2>
            <button
              onClick={() => navigate("/admin/order")}
              className="text-xs text-orange hover:underline font-medium"
            >
              View all →
            </button>
          </div>
          <div className="divide-y divide-gray-50 dark:divide-gray-700/50">
            {ordersLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-orange" />
              </div>
            ) : recentOrders.length === 0 ? (
              <div className="py-10 text-center text-gray-400 dark:text-gray-500 text-sm">
                No orders yet
              </div>
            ) : (
              recentOrders.map((order) => (
                <div
                  key={order._id}
                  className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-800 dark:text-gray-200 truncate">
                      {order.deliveryDetails?.name || "Customer"}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )
                        : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      ₹{order.totalAmount || 0}
                    </span>
                    <Badge
                      className={`capitalize text-[10px] px-2 py-0.5 rounded-full ${statusColors[order.status] || "bg-gray-100 text-gray-600"}`}
                    >
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Menu Preview */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700">
            <h2 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
              <SquareMenu className="w-4 h-4 text-blue-500" />
              Menu Items
            </h2>
            <button
              onClick={() => navigate("/admin/menu")}
              className="text-xs text-blue-600 hover:underline font-medium"
            >
              Manage →
            </button>
          </div>
          <div className="divide-y divide-gray-50 dark:divide-gray-700/50">
            {!menus || menus.length === 0 ? (
              <div className="py-10 text-center">
                <SquareMenu className="w-10 h-10 text-gray-200 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400 dark:text-gray-500 text-sm">
                  No menu items yet
                </p>
                <Button
                  onClick={() => navigate("/admin/menu")}
                  className="mt-3 bg-orange hover:bg-HoverOrange text-white text-xs"
                  size="sm"
                >
                  <Plus className="w-3 h-3 mr-1" /> Add your first item
                </Button>
              </div>
            ) : (
              menus.slice(0, 6).map((menu: any) => (
                <div
                  key={menu._id}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                >
                  {menu.imageUrl ? (
                    <img
                      src={menu.imageUrl}
                      className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
                      alt={menu.name}
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                      <SquareMenu className="w-4 h-4 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <span className="font-medium text-sm text-gray-700 dark:text-gray-200 block truncate">
                      {menu.name}
                    </span>
                    {menu.description && (
                      <span className="text-xs text-gray-400 dark:text-gray-500 block truncate">
                        {menu.description}
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-semibold text-gray-600 dark:text-gray-300 flex-shrink-0">
                    ₹{menu.price}
                  </span>
                </div>
              ))
            )}
            {menus?.length > 6 && (
              <div className="px-5 py-3 text-center">
                <button
                  onClick={() => navigate("/admin/menu")}
                  className="text-xs text-blue-600 hover:underline"
                >
                  +{menus.length - 6} more items
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
