/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import "./App.css";
import Login from "./auth/Login";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Signup from "./auth/Signup";
import ForgetPassword from "./auth/ForgetPassword";
import VerifyEmail from "./auth/VerifyEmail";
import MainLayout from "./layout/MainLayout";
import HeroSection from "./projectComponents/HeroSection";
import Profile from "./projectComponents/Profile";
import SearchPage from "./projectComponents/SearchPage";
import FilterPage from "./projectComponents/FilterPage";
import RestaurantDetails from "./projectComponents/RestaurantDetails";
import Cart from "./projectComponents/Cart";
import Restaurant from "./admin/Restaurant";
import AddMenu from "./admin/AddMenu";
import Order from "./admin/Order";
import Success from "./projectComponents/Success";
import { useEffect } from "react";
import { isAuthenticatedFun, logout } from "@/feature/UserSlicer";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "./app/store";
import Loading from "./components/ui/Loading";

const saveToLocalStorage = (isAuthenticated: any, users: any) => {
  if (isAuthenticated) {
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("users", JSON.stringify(users));
  }

  const isAuthenticatedLoc =
    localStorage.getItem("isAuthenticated") === "true" ? true : false;

  const checkAuthUserVal = localStorage.getItem("users");

  let checkAuthUserParsed = null;
  if (checkAuthUserVal) {
    try {
      checkAuthUserParsed = JSON.parse(checkAuthUserVal);
      console.log("Parsed users:", checkAuthUserParsed);
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  } else {
    console.log("No data found for users in localStorage.");
  }
  return { isAuthenticatedLoc, checkAuthUserParsed };
};

const ProtectedRoutes = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, users }: any = useSelector<any>(
    (state) => state.user
  );

  const { isAuthenticatedLoc, checkAuthUserParsed } = saveToLocalStorage(
    isAuthenticated,
    users
  );

  console.log(
    "🚀 ~ ProtectedRoutes ~ isAuthenticatedLoc:================================ 11111 ",
    isAuthenticatedLoc
  );

  console.log(
    "🚀 ~ ProtectedRoutes ~ checkAuthUserParsed:================================ 11111",
    checkAuthUserParsed
  );

  if (!isAuthenticatedLoc) {
    return <Navigate to="/login" replace />;
  }
  console.log(
    "🚀 ~ ProtectedRoutes ~ users[0]?.user?.isVerified:",
    checkAuthUserParsed[0]?.user?.isVerified
  );

  if (!checkAuthUserParsed[0]?.user?.isVerified) {
    return <Navigate to="/VerifyEmail" replace />;
  }

  // dispatch(isAuthenticatedFun());
  return children;
};

const AuthenticatedUser = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, users }: any = useSelector<any>(
    (state) => state.user
  );

  const { isAuthenticatedLoc, checkAuthUserParsed } = saveToLocalStorage(
    isAuthenticated,
    users
  );

  console.log(
    "🚀 ~ AuthenticatedUser ~ checkAuthUserParsed:========================================== 22222 ",
    checkAuthUserParsed
  );
  console.log(
    "🚀 ~ ProtectedRoutes ~ isAuthenticatedLoc:========================================== 22222 ",
    isAuthenticatedLoc
  );

  if (isAuthenticatedLoc && checkAuthUserParsed[0]?.user?.isVerified) {
    console.log("here 222");
    return <Navigate to="/" replace />;
  }

  return children;
};

const AdminRout = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticatedLoc =
    localStorage.getItem("isAuthenticated") === "true" ? true : false;

  console.log(
    "🚀 ~ ProtectedRoutes ~ isAuthenticatedLoc:========================================== 3333 AuthenticatedUser",
    isAuthenticatedLoc
  );

  //   if (!isAuthenticated) {
  //     return <Navigate to="/login" replace />;
  //   }
  //   if (!user?.admin) {
  //     return <Navigate to="/" replace />;
  //   }

  return children;
};

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoutes>
        <MainLayout />
      </ProtectedRoutes>
    ),
    children: [
      {
        path: "/",
        element: <HeroSection />,
      },
      {
        path: "/Profile",
        element: <Profile />,
      },
      {
        path: "/Search/:text",
        element: <SearchPage />,
      },
      {
        path: "/Restaurant/:id",
        element: <RestaurantDetails />,
      },
      {
        path: "/order/status",
        element: <Success />,
      },
      {
        path: "/Cart",
        element: <Cart />,
      },
      //admin Service starts here
      {
        path: "/admin/restaurant",
        element: (
          <AdminRout>
            {" "}
            <Restaurant />{" "}
          </AdminRout>
        ),
      },
      {
        path: "/admin/menu",
        element: (
          <AdminRout>
            {" "}
            <AddMenu />
          </AdminRout>
        ),
      },
      {
        path: "/admin/order",
        element: (
          <AdminRout>
            {" "}
            <Order />
          </AdminRout>
        ),
      },
      {
        path: "/FilterPage",
        element: <FilterPage />,
      },
    ],
  },
  {
    path: "/Login",
    element: (
      <AuthenticatedUser>
        <Login />
      </AuthenticatedUser>
    ),
  },
  {
    path: "/SignUp",
    element: (
      <AuthenticatedUser>
        {" "}
        <Signup />
      </AuthenticatedUser>
    ),
  },
  {
    path: "/ForgetPassword",
    element: (
      <AuthenticatedUser>
        {" "}
        <ForgetPassword />
      </AuthenticatedUser>
    ),
  },
  {
    path: "/VerifyEmail",
    element: (
      <AuthenticatedUser>
        <VerifyEmail />
      </AuthenticatedUser>
    ),
  },
]);

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading }: any = useSelector<any>((state) => state.user);

  useEffect(() => {
    // if (users.length <= 0) {
    console.log("inside effect");
    // const { isAuthenticated, users }: any = useSelector<any>(
    //   (state) => state.user
    // );

    const { isAuthenticatedLoc, checkAuthUserParsed } = saveToLocalStorage(
      false,
      null
    );

    console.log("🚀 ~ useEffect ~ checkAuthUserParsed:", checkAuthUserParsed);
    console.log("🚀 ~ useEffect ~ isAuthenticatedLoc:", isAuthenticatedLoc);
    if (!checkAuthUserParsed && !isAuthenticatedLoc) {
      console.log("cookie remove ==============<<<<<<<<<<<<>>>>>>>>>>>>>>>.");
      dispatch(logout());
    } else {
      dispatch(isAuthenticatedFun());
    }
    // }
  }, [isAuthenticatedFun]);

  if (isLoading) return <Loading />;
  return (
    <main>
      <RouterProvider router={appRouter}></RouterProvider>
    </main>
  );
}

export default App;
