/* eslint-disable react-hooks/exhaustive-deps */
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
import ResetPassword from "./auth/ResetPassword";

const saveToLocalStorage = (isAuthenticated: any, users: any) => {
  console.log("🚀 ~ saveToLocalStorage ~ users:", users);
  if (
    isAuthenticated &&
    users[0]?.user?.isVerified &&
    users[0]?.message.includes("Welcome")
  ) {
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("users", JSON.stringify(users));
  }

  const isAuthenticatedLoc =
    localStorage.getItem("isAuthenticated") === "true" ? true : false;

  const checkAuthUserVal = localStorage.getItem("users");

  let checkAuthUserParsed = [];
  if (checkAuthUserVal) {
    try {
      checkAuthUserParsed = JSON.parse(checkAuthUserVal);
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

  const { isAuthenticatedLoc } = saveToLocalStorage(isAuthenticated, users);

  if (!isAuthenticatedLoc) {
    return <Navigate to="/login" replace />;
  }

  if (!users[0]?.user?.isVerified && !isAuthenticatedLoc) {
    return <Navigate to="/VerifyEmail" replace />;
  }

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

  if (isAuthenticatedLoc && checkAuthUserParsed[0]?.user?.isVerified) {
    return <Navigate to="/" replace />;
  }

  if (
    users.length > 0 &&
    users[0]?.user?.isVerified == false &&
    !isAuthenticatedLoc
  ) {
    window.location.reload();
    return <Navigate to="/VerifyEmail" replace />;
  }

  return children;
};

const AdminRout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, users }: any = useSelector<any>(
    (state) => state.user
  );

  const { checkAuthUserParsed } = saveToLocalStorage(isAuthenticated, users);

  if (!checkAuthUserParsed[0]?.user?.admin) {
    return <Navigate to="/" replace />;
  }

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
      {
        path: "/Resetpassword",
        element: <ResetPassword />,
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
        {" "}
        <VerifyEmail />{" "}
      </AuthenticatedUser>
    ),
  },
  {
    path: "/resetpassword/:token",
    element: (
      <AuthenticatedUser>
        <ResetPassword />
      </AuthenticatedUser>
    ),
  },
]);

function App() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const { isAuthenticatedLoc, checkAuthUserParsed } = saveToLocalStorage(
      false,
      null
    );

    if (!checkAuthUserParsed.length && !isAuthenticatedLoc) {
      dispatch(logout());
    } else {
      dispatch(isAuthenticatedFun());
    }
  }, [isAuthenticatedFun]);

  return (
    <main>
      <RouterProvider router={appRouter}></RouterProvider>
    </main>
  );
}

export default App;
