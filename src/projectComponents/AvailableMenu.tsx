import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/store";
import { addToCart } from "@/feature/cartSlicer";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ShoppingCart, XCircle, Check } from "lucide-react";

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
}

interface AvailableMenuProps {
  menus: MenuItem[];
  restaurantId?: string;
  isActive?: boolean;
}

function AvailableMenu({ menus, restaurantId, isActive }: AvailableMenuProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [showClosedModal, setShowClosedModal] = useState(false);
  const [addedItem, setAddedItem] = useState<MenuItem | null>(null);
  const [toastVisible, setToastVisible] = useState(false);

  const handleAddToCart = (menu: MenuItem) => {
    if (isActive === false) {
      setShowClosedModal(true);
      return;
    }
    dispatch(
      addToCart({
        _id: menu._id,
        name: menu.name,
        description: menu.description,
        price: menu.price,
        imageUrl: menu.imageUrl,
        restaurantId,
      }),
    );
    setAddedItem(menu);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2500);
  };

  if (!menus || menus.length === 0) {
    return (
      <div className="w-full text-center py-10">
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          No menu items available.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="py-8 w-full">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-8 bg-orange rounded-full" />
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
            Menu ({menus.length} items)
          </h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {menus.map((menu) => (
            <Card
              key={menu._id}
              className="group shadow-sm hover:shadow-xl rounded-2xl overflow-hidden transition-all duration-300 border border-gray-100 dark:border-gray-700"
            >
              {menu.imageUrl && (
                <div className="overflow-hidden">
                  <img
                    src={menu.imageUrl}
                    className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
                    alt={menu.name}
                  />
                </div>
              )}
              <CardContent className="p-5">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                  {menu.name}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5 line-clamp-2">
                  {menu.description}
                </p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-orange">
                    ₹{menu.price}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="p-5 pt-0">
                <Button
                  onClick={() => handleAddToCart(menu)}
                  disabled={isActive === false}
                  className={`w-full text-white py-2.5 rounded-xl font-medium transition-all ${
                    isActive === false
                      ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                      : "bg-orange hover:bg-HoverOrange hover:shadow-lg hover:shadow-orange/25"
                  }`}
                >
                  {isActive === false ? "Restaurant Closed" : "Add to Cart"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Closed Restaurant Modal */}
      <Dialog open={showClosedModal} onOpenChange={setShowClosedModal}>
        <DialogContent className="max-w-sm text-center">
          <div className="flex flex-col items-center gap-3 py-2">
            <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <XCircle className="w-7 h-7 text-red-500" />
            </div>
            <DialogTitle className="text-xl font-bold text-gray-800 dark:text-white">
              Restaurant is Closed
            </DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400">
              This restaurant is currently closed and not accepting orders.
              Please check back later.
            </DialogDescription>
            <Button
              onClick={() => setShowClosedModal(false)}
              className="w-full bg-orange hover:bg-HoverOrange text-white mt-1"
            >
              OK, Got it
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add to Cart Toast */}
      <div
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
          toastVisible
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-3 bg-gray-900 dark:bg-gray-800 text-white px-5 py-3 rounded-2xl shadow-2xl border border-gray-700 min-w-[280px] max-w-xs">
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shrink-0">
            <Check className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{addedItem?.name}</p>
            <p className="text-xs text-gray-400">
              Added to cart ₹{addedItem?.price}
            </p>
          </div>
          <ShoppingCart className="w-5 h-5 text-orange shrink-0" />
        </div>
      </div>
    </>
  );
}

export default AvailableMenu;
