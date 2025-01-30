/* eslint-disable @typescript-eslint/no-explicit-any */
import { NavLink, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
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
import { AppDispatch } from "@/app/store";
import { FormEvent, useEffect } from "react";

const Navbar = () => {
  const loading = false;
  const adminVal = localStorage.getItem("users");
  // console.log("🚀 ~ useEffect ~ admin:", admin);

  let adminParsed = [];
  if (adminVal) {
    try {
      adminParsed = JSON.parse(adminVal);
      console.log("Parsed users:", adminParsed);
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  } else {
    console.log("No data found for users in localStorage.");
  }

  console.log("🚀 ~ Navbar ~ adminParsed:", adminParsed);

  const admin = adminParsed[0]?.user?.admin;
  console.log("🚀 ~ Navbar ~ admin:", admin);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const onClickLogout = async (e: FormEvent) => {
    e.preventDefault();
    try {
      dispatch(logout()).unwrap();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  const { message }: any = useSelector<any>((state) => state.user);

  useEffect(() => {
    if (message == "Logged out successfully.") {
      window.location.reload();
    }
  }, [message]);

  return (
    <div className="text-white fixed w-full top-0 left-0 z-50 backdrop-filter">
      <div className="max-w-7xl mx-auto px-2 relative">
        <div className="flex items-center justify-between h-16">
          {/* Left side - FoodSy (with absolute positioning) */}
          <NavLink
            to="/"
            className="text-blue-700 font-bold text-2xl mt-4 md:font-extrabold absolute left-2"
          >
            FoodSy
          </NavLink>

          {/* Right side - Navigation Links */}
          <div className="hidden md:flex items-center gap-3 ml-auto">
            <NavLink to="/" className="text-blue-700">
              Home
            </NavLink>
            <NavLink to="/Profile" className="text-blue-700">
              Profile
            </NavLink>
            <NavLink to="/Order/status" className="text-blue-700">
              Order
            </NavLink>

            {admin && (
              <Menubar>
                <MenubarMenu>
                  <MenubarTrigger className="bg-white text-black hover:bg-gray-100">
                    Dashboard
                  </MenubarTrigger>
                  <MenubarContent>
                    <NavLink to="/admin/restaurant">
                      <MenubarItem>Resturant</MenubarItem>
                    </NavLink>
                    <NavLink to="/admin/menu">
                      <MenubarItem>Menu</MenubarItem>
                    </NavLink>
                    <NavLink to="/admin/order">
                      <MenubarItem>Orders</MenubarItem>
                    </NavLink>
                  </MenubarContent>
                </MenubarMenu>
              </Menubar>
            )}
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="bg-black">
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-300 ease-in-out dark:rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all duration-300 ease-in-out dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Light</DropdownMenuItem>
                  <DropdownMenuItem>Dark</DropdownMenuItem>
                  <DropdownMenuItem>System</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="pl-3 ">
              <NavLink to="/Cart">
                <div className="pl-2 ">
                  <Button className="pr-3 size-1 relative-inset-y-2 left-4 text-xs rounded-full bg-orange">
                    5
                  </Button>
                </div>
                <ShoppingCart className="ml-2 text-blue-700" />
              </NavLink>
            </div>
            <div>
              <Avatar>
                <AvatarImage
                  className="relative left-2 text-xs rounded-full size-10"
                  src="https://github.com/shadcn.png"
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
                  onClick={onClickLogout}
                  className="w-full bg-orange hover:bg-hoverOrange py-3 px-4 rounded-lg"
                >
                  Logout
                </button>
              )}
            </div>
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
  const adminVal = localStorage.getItem("users");
  // console.log("🚀 ~ useEffect ~ admin:", admin);

  let adminParsed = [];
  if (adminVal) {
    try {
      adminParsed = JSON.parse(adminVal);
      console.log("Parsed users:", adminParsed);
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  } else {
    console.log("No data found for users in localStorage.");
  }

  console.log("🚀 ~ Navbar ~ adminParsed:", adminParsed);

  const admin = adminParsed[0]?.user?.admin;
  console.log("🚀 ~ Navbar ~ admin:", admin);

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
                <DropdownMenuItem>Light</DropdownMenuItem>
                <DropdownMenuItem>Dark</DropdownMenuItem>
                <DropdownMenuItem>System</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SheetTitle>
        </SheetHeader>
        <Separator />
        <SheetDescription className="flex-1">
          <NavLink
            to="/profile"
            className="flex items-center gap-4 hover:bg-gray-200 px-3 py-2 rounded-lg cursor-pointer hover:text-gray-900 font-medium"
          >
            <User />
            <span>Profile</span>
          </NavLink>
          <NavLink
            to="/order/status"
            className="flex items-center gap-4 hover:bg-gray-200 px-3 py-2 rounded-lg cursor-pointer hover:text-gray-900 font-medium"
          >
            <HandPlatter />
            <span>Order</span>
          </NavLink>
          <NavLink
            to="/Cart"
            className="flex items-center gap-4 hover:bg-gray-200 px-3 py-2 rounded-lg cursor-pointer hover:text-gray-900 font-medium"
          >
            <ShoppingCart />
            <span>Cart (0)</span>
          </NavLink>

          {admin && (
            <>
              <NavLink
                to="/admin/menu"
                className="flex items-center gap-4 hover:bg-gray-200 px-3 py-2 rounded-lg cursor-pointer hover:text-gray-900 font-medium"
              >
                <SquareMenu />
                <span>Menu</span>
              </NavLink>
              <NavLink
                to="/admin/restaurant"
                className="flex items-center gap-4 hover:bg-gray-200 px-3 py-2 rounded-lg cursor-pointer hover:text-gray-900 font-medium"
              >
                <UtensilsCrossed />
                <span>Restaurant</span>
              </NavLink>
              <NavLink
                to="/admin/order"
                className="flex items-center gap-4 hover:bg-gray-200 px-3 py-2 rounded-lg cursor-pointer hover:text-gray-900 font-medium"
              >
                <ListOrdered />
                <span>Restaurant Orders</span>
              </NavLink>
            </>
          )}
        </SheetDescription>
        <SheetFooter className="flex flex-col gap-4">
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
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
