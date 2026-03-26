import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/app/store";
import { clearCart } from "@/feature/cartSlicer";
import axios from "axios";
import { Loader2 } from "lucide-react";

const API_PAYMENT_URL: string | undefined =
  import.meta.env.VITE_ENVIRONMENT == "prod"
    ? `${import.meta.env.VITE_BACKEND_USER_API_URL_PROD}/api/v1/payment`
    : `${import.meta.env.VITE_BACKEND_USER_API_URL_DEV}/api/v1/payment`;

function CheckOutConfirmPage({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, restaurantId } = useSelector(
    (state: RootState) => state.counter,
  );
  const [submitting, setSubmitting] = useState(false);
  const [input, setInput] = useState({
    name: "",
    email: "",
    contact: "",
    address: "",
    city: "",
    country: "",
  });

  // Pre-fill from profile data
  useEffect(() => {
    if (open) {
      const usersVal = localStorage.getItem("users");
      if (usersVal) {
        try {
          const parsed = JSON.parse(usersVal);
          const user = parsed[0]?.user;
          if (user) {
            setInput((prev) => ({
              ...prev,
              name: user.fullName || prev.name,
              email: user.email || prev.email,
              address: user.address?.includes("update")
                ? ""
                : user.address || prev.address,
              city: user.city?.includes("update") ? "" : user.city || prev.city,
              country: user.country?.includes("update")
                ? ""
                : user.country || prev.country,
            }));
          }
        } catch {
          /* ignore */
        }
      }
    }
  }, [open]);

  const changEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };
  const checkOutHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("\n══════════════════════════════════════════════");
    console.log("🛒 CHECKOUT HANDLER — User clicked 'Pay & Order'");
    console.log("══════════════════════════════════════════════");

    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    console.log("🔐 isAuthenticated:", isAuthenticated);
    if (!isAuthenticated) {
      console.log("❌ Not authenticated — redirecting to /Login");
      setOpen(false);
      navigate("/Login");
      return;
    }

    console.log("📌 restaurantId:", restaurantId);
    console.log("📌 items count:", items.length);
    if (!restaurantId || items.length === 0) {
      console.log("❌ No restaurant or empty cart — aborting");
      return;
    }

    setSubmitting(true);
    try {
      const totalAmount = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );
      const cartItems = items.map((item) => ({
        menuId: item._id,
        name: item.name,
        image: item.imageUrl || "",
        price: item.price,
        quantity: item.quantity,
      }));

      const deliveryDetails = {
        email: input.email,
        name: input.name,
        address: input.address,
        city: input.city,
      };

      console.log("\n📦 Preparing payment request:");
      console.log("   restaurant:", restaurantId);
      console.log(
        "   deliveryDetails:",
        JSON.stringify(deliveryDetails, null, 2),
      );
      console.log("   cartItems:", JSON.stringify(cartItems, null, 2));
      console.log("   totalAmount (₹):", totalAmount);
      console.log("   API_PAYMENT_URL:", API_PAYMENT_URL);

      console.log("\n📤 Sending POST to:", `${API_PAYMENT_URL}/initiate`);

      // Initiate PhonePe payment
      const { data } = await axios.post(
        `${API_PAYMENT_URL}/initiate`,
        {
          restaurant: restaurantId,
          deliveryDetails,
          cartItems,
          totalAmount,
        },
        { withCredentials: true },
      );

      console.log("\n📥 Response from backend:");
      console.log("   success:", data.success);
      console.log("   orderId:", data.orderId);
      console.log("   redirectUrl:", data.redirectUrl);

      if (data.success && data.redirectUrl) {
        console.log("✅ Payment initiated! Clearing cart and redirecting...");
        console.log("🔗 Redirecting to PhonePe:", data.redirectUrl);
        dispatch(clearCart());
        setOpen(false);
        // Redirect to PhonePe payment page
        window.location.href = data.redirectUrl;
      } else {
        console.error(
          "❌ Payment initiation failed — unexpected response:",
          data,
        );
      }
    } catch (error) {
      console.error("❌ Failed to initiate payment:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogTitle className="font-semibold text-lg">
          Review Your Order
        </DialogTitle>
        <DialogDescription className="text-sm text-gray-500 dark:text-gray-400">
          Please review your delivery details carefully. Once satisfied, click
          &quot;Confirm&quot; to finalize your order.
        </DialogDescription>
        <form onSubmit={checkOutHandler} className="space-y-3 mt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label className="text-sm">Full Name</Label>
              <Input
                type="text"
                name="name"
                value={input.name}
                onChange={changEventHandler}
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label className="text-sm">Email</Label>
              <Input
                type="email"
                name="email"
                value={input.email}
                onChange={changEventHandler}
                className="mt-1"
                required
              />
            </div>
          </div>
          <div>
            <Label className="text-sm">Contact</Label>
            <Input
              type="text"
              name="contact"
              value={input.contact}
              onChange={changEventHandler}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-sm">Address</Label>
            <Input
              type="text"
              name="address"
              value={input.address}
              onChange={changEventHandler}
              className="mt-1"
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label className="text-sm">City</Label>
              <Input
                type="text"
                name="city"
                value={input.city}
                onChange={changEventHandler}
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label className="text-sm">Country</Label>
              <Input
                type="text"
                name="country"
                value={input.country}
                onChange={changEventHandler}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter className="pt-4">
            <Button
              type="submit"
              disabled={submitting}
              className="bg-orange hover:bg-HoverOrange w-full md:w-auto"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Redirecting to Payment...
                </>
              ) : (
                "Pay & Order"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CheckOutConfirmPage;
