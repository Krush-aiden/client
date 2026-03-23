import { NavLink } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import {
  HandPlatter,
  ListOrdered,
  Loader2,
  Menu,
  Moon,
  ShoppingCart,
  SquareMenu,
  Sun,
  User,
  UtensilsCrossed,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { logout } from "@/feature/UserSlicer";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store";
import { useEffect, useState } from "react";
import { useTheme } from "@/components/ThemeProvider";

const Navbar = () => {
  const loading = false;
  const { setTheme } = useTheme();
  const cartCount = useSelector((state: RootState) => state.counter.value);
  const adminVal = localStorage.getItem("users");
  // console.log("🚀 ~ useEffect ~ admin:", admin);
  let adminParsed = [];
  if (adminVal) {
    try {
      adminParsed = JSON.parse(adminVal);
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  }
  const [profileImgUrl, setProfileImg] = useState(
    "https://github.com/shadcn.png",
  );
  const { success, users } = useSelector((state: any) => state.user);
  const admin = adminParsed[0]?.user?.admin;
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  const dispatch = useDispatch<AppDispatch>();
  const { message } = useSelector((state: any) => state.user);

  useEffect(() => {
    const checkAuthUserVal = localStorage.getItem("users");
    let checkAuthUserParsed = [];
    if (checkAuthUserVal) {
      try {
        checkAuthUserParsed = JSON.parse(checkAuthUserVal);
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    }
    if (message == "Logged out successfully.") {
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("users");
      window.location.reload();
    }
    setProfileImg(checkAuthUserParsed[0]?.user?.profilePictureName);
  }, [message, success, users]);

  return (
    <div className="fixed bg-white dark:bg-gray-900 w-full top-0 left-0 z-50 backdrop-filter">
      <div className="max-w-7xl mx-auto px-2 relative">
        <div className="flex items-center justify-between h-16">
          {/* Left side - FoodSy (with absolute positioning) */}
          <NavLink
            to="/"
            className="text-orange dark:text-orange font-bold text-2xl mt-4 md:font-extrabold absolute left-2"
          >
            FoodSy
          </NavLink>

          {/* Right side - Navigation Links */}
          <div className="hidden md:flex items-center gap-3 ml-auto">
            <NavLink
              to="/"
              className="text-gray-700 dark:text-gray-200 hover:text-orange"
            >
              Home
            </NavLink>
            {isAuthenticated && (
              <NavLink
                to="/Profile"
                className="text-gray-700 dark:text-gray-200 hover:text-orange"
              >
                Profile
              </NavLink>
            )}
            {isAuthenticated && !admin && (
              <NavLink
                to="/Order/status"
                className="text-gray-700 dark:text-gray-200 hover:text-orange"
              >
                Order
              </NavLink>
            )}

            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-300 ease-in-out dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all duration-300 ease-in-out dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setTheme("light")}>
                    Light
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>
                    Dark
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("system")}>
                    System
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {!admin && (
              <div className="pl-3 ">
                <NavLink to="/Cart">
                  <div className="pl-2 ">
                    <Button className="pr-3 size-1 relative-inset-y-2 left-4 text-xs rounded-full bg-orange">
                      {cartCount}
                    </Button>
                  </div>
                  <ShoppingCart className="ml-2 text-gray-700 dark:text-gray-200" />
                </NavLink>
              </div>
            )}
            {isAuthenticated ? (
              <>
                <div>
                  <Avatar>
                    <AvatarImage
                      className="relative left-2 text-xs rounded-full size-10"
                      src={profileImgUrl || "https://github.com/shadcn.png"}
                      alt="@shadcn"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </div>
                <div className="pl-4">
                  {loading ? (
                    <button
                      disabled
                      className="w-full bg-orange flex items-center justify-center py-3 px-4 opacity-50 cursor-not-allowed"
                    >
                      <Loader2 className="h-6 w-6 animate-spin mr-2" />
                      Please wait
                    </button>
                  ) : (
                    <button
                      type="submit"
                      onClick={() => dispatch(logout())}
                      className="w-full bg-orange hover:bg-hoverOrange py-3 px-4 rounded-lg"
                    >
                      Logout
                    </button>
                  )}
                </div>
              </>
            ) : (
              <NavLink
                to="/Login"
                className="bg-orange hover:bg-hoverOrange text-white py-2 px-4 rounded-lg font-medium"
              >
                Login
              </NavLink>
            )}
          </div>
          <div className="md:hidden lg:hidden ml-auto">
            <MobileNavbar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

const MobileNavbar = () => {
  const { setTheme } = useTheme();
  const cartCount = useSelector((state: RootState) => state.counter.value);
  const adminVal = localStorage.getItem("users");
  // console.log("🚀 ~ useEffect ~ admin:", admin);

  let adminParsed = [];
  if (adminVal) {
    try {
      adminParsed = JSON.parse(adminVal);
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  }

  const admin = adminParsed[0]?.user?.admin;
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  const dispatch = useDispatch<AppDispatch>();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="bg-gray-800">
          <Menu size={18} />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader className="flex flex-row items-center justify-between mt-2">
          <SheetTitle className="flex flex-row gap-2">
            <NavLink to="/">FoodSy</NavLink>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="">
                  <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-300 ease-in-out dark:rotate-90 dark:scale-0" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all duration-300 ease-in-out dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SheetTitle>
        </SheetHeader>
        <Separator />
        <SheetDescription className="flex-1">
          {isAuthenticated && (
            <NavLink
              to="/profile"
              className="flex items-center gap-4 hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-2 rounded-lg cursor-pointer hover:text-gray-900 dark:hover:text-white font-medium"
            >
              <User />
              <span>Profile</span>
            </NavLink>
          )}
          {isAuthenticated && !admin && (
            <NavLink
              to="/order/status"
              className="flex items-center gap-4 hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-2 rounded-lg cursor-pointer hover:text-gray-900 dark:hover:text-white font-medium"
            >
              <HandPlatter />
              <span>Order</span>
            </NavLink>
          )}
          {!admin && (
            <NavLink
              to="/Cart"
              className="flex items-center gap-4 hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-2 rounded-lg cursor-pointer hover:text-gray-900 dark:hover:text-white font-medium"
            >
              <ShoppingCart />
              <span>Cart ({cartCount})</span>
            </NavLink>
          )}

          {admin && (
            <>
              <NavLink
                to="/admin/menu"
                className="flex items-center gap-4 hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-2 rounded-lg cursor-pointer hover:text-gray-900 dark:hover:text-white font-medium"
              >
                <SquareMenu />
                <span>Menu</span>
              </NavLink>
              <NavLink
                to="/admin/restaurant"
                className="flex items-center gap-4 hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-2 rounded-lg cursor-pointer hover:text-gray-900 dark:hover:text-white font-medium"
              >
                <UtensilsCrossed />
                <span>Restaurant</span>
              </NavLink>
              <NavLink
                to="/admin/order"
                className="flex items-center gap-4 hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-2 rounded-lg cursor-pointer hover:text-gray-900 dark:hover:text-white font-medium"
              >
                <ListOrdered />
                <span>Restaurant Orders</span>
              </NavLink>
            </>
          )}
        </SheetDescription>
        <SheetFooter className="flex flex-col gap-4">
          {isAuthenticated ? (
            <>
              <div className="flex flex-row items-center gap-2 mt-2">
                <Avatar>
                  <AvatarImage
                    className="relative left-2 text-xs rounded-full size-10"
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <h1 className="font-bold text-xl ml-2">FoodSy User</h1>
              </div>
              <SheetClose asChild>
                <Button
                  type="submit"
                  onClick={() => dispatch(logout())}
                  className="bg-orange hover:bg-HoverOrange"
                >
                  Logout
                </Button>
              </SheetClose>
            </>
          ) : (
            <SheetClose asChild>
              <NavLink to="/Login">
                <Button className="bg-orange hover:bg-HoverOrange w-full">
                  Login
                </Button>
              </NavLink>
            </SheetClose>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
