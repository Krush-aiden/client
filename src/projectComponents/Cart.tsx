import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useState } from "react";
import CheckOutConfirmPage from "./CheckOutConfirmPage";
import type { RootState } from "../app/store";
import { useSelector, useDispatch } from "react-redux";
import {
  incrementItem,
  decrementItem,
  removeItem,
  clearCart,
} from "../feature/cartSlicer";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [open, setOpen] = useState<boolean>(false);
  const { items } = useSelector((state: RootState) => state.counter);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const handleCheckout = () => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    if (!isAuthenticated) {
      navigate("/Login");
      return;
    }
    setOpen(true);
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center max-w-7xl mx-auto my-32 gap-5 px-4">
        <div className="w-20 h-20 rounded-full bg-orange/10 flex items-center justify-center">
          <ShoppingCart className="w-10 h-10 text-orange" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          Your cart is empty
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-center max-w-sm">
          Looks like you haven't added anything to your cart yet. Explore our
          restaurants and find something delicious!
        </p>
        <Button
          className="bg-orange hover:bg-HoverOrange px-8 py-3 rounded-xl font-medium shadow-lg shadow-orange/20"
          onClick={() => navigate("/")}
        >
          Browse Restaurants
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col max-w-7xl mx-auto my-20 px-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Your Cart
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {items.length} {items.length === 1 ? "item" : "items"}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="text-red-500 border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-1.5"
          onClick={() => dispatch(clearCart())}
        >
          <Trash2 className="w-4 h-4" />
          Clear all
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Items</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Total</TableHead>
            <TableHead className="text-right">Remove</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-start">
          {items.map((item) => (
            <TableRow key={item._id}>
              <TableCell>
                <Avatar className="size-14">
                  <AvatarImage
                    className="relative left-2 text-xs rounded-full size-10"
                    src={item.imageUrl || "https://github.com/shadcn.png"}
                    alt={item.name}
                  />
                  <AvatarFallback>{item.name[0]}</AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>₹{item.price}</TableCell>
              <TableCell>
                <div className="w-fit flex items-center rounded-full border border-gray-100 dark:border-gray-800 shadow-md">
                  <Button
                    size={"icon"}
                    className="rounded-full"
                    onClick={() => dispatch(decrementItem(item._id))}
                  >
                    <Minus />
                  </Button>
                  <Button
                    disabled
                    className="bg-white dark:bg-gray-800 text-black dark:text-white font-semibold"
                  >
                    {item.quantity}
                  </Button>
                  <Button
                    size={"icon"}
                    className="rounded-full"
                    onClick={() => dispatch(incrementItem(item._id))}
                  >
                    <Plus />
                  </Button>
                </div>
              </TableCell>
              <TableCell>₹{item.price * item.quantity}</TableCell>
              <TableCell className="text-right">
                <Button
                  className="bg-orange hover:bg-HoverOrange text-right"
                  size={"sm"}
                  onClick={() => dispatch(removeItem(item._id))}
                >
                  Remove
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={5} className="text-start font-semibold">
              Total
            </TableCell>
            <TableCell className="text-right font-semibold">
              ₹ {total}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      <div className="flex justify-end my-5">
        <Button
          className="bg-orange hover:bg-HoverOrange"
          onClick={handleCheckout}
        >
          Proceed To CheckOut
        </Button>
      </div>
      <CheckOutConfirmPage open={open} setOpen={setOpen} />
    </div>
  );
};

export default Cart;
