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

const API_RESTAURANT_URL: string | undefined =
  import.meta.env.VITE_ENVIRONMENT == "prod"
    ? `${import.meta.env.VITE_BACKEND_USER_API_URL_PROD}/api/v1/restaurantRout`
    : `${import.meta.env.VITE_BACKEND_USER_API_URL_DEV}/api/v1/restaurantRout`;

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
        } catch (e) {
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
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    if (!isAuthenticated) {
      setOpen(false);
      navigate("/Login");
      return;
    }
    if (!restaurantId || items.length === 0) return;

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
      await axios.post(
        `${API_RESTAURANT_URL}/order/create`,
        {
          restaurant: restaurantId,
          deliveryDetails: {
            email: input.email,
            name: input.name,
            address: input.address,
            city: input.city,
          },
          cartItems,
          totalAmount,
        },
        { withCredentials: true },
      );
      dispatch(clearCart());
      setOpen(false);
      navigate("/order/status");
    } catch (error) {
      console.error("Failed to place order:", error);
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
                  Placing Order...
                </>
              ) : (
                "Confirm Order"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CheckOutConfirmPage;
