import './App.css';
import Login from './auth/Login';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import Signup from './auth/Signup';
import ForgetPassword from './auth/ForgetPassword';
import VerifyEmail from './auth/VerifyEmail';
import Mainlayout from './layout/MainLayout';
import HeroSection from './projectComponents/HeroSection';
import Profile from './projectComponents/Profile';
import SearchPage from './projectComponents/SearchPage';
import FilterPage from './projectComponents/FilterPage';
import RestaurantDetails from './projectComponents/RestaurantDetails';
import Cart from './projectComponents/Cart';
import Restaurant from './admin/Restaurant';
import AddMenu from './admin/AddMenu';

const appRounter  = createBrowserRouter([
  {
    path : "/",
    element: <Mainlayout/>,
    children:[
      {
        path :"/",
        element:<HeroSection/>
      },
      {
        path: "/Profile",
        element:<Profile/>
      },
      {
        path: "/Search/:text",
        element:<SearchPage/>
      },
      {
        path:"/Restaurant/:id",
        element:<RestaurantDetails/>
      },
      {
        path:"/Cart",
        element:<Cart/>
      },
      {
        path:"/admin/restaurant",
        element:<Restaurant/>
      },
      {
        path:"/admin/menu",
        element:<AddMenu/>
      },
      {
        path: "/FilterPage",
        element:<FilterPage/>
      }
    ]
  },
  {
    path:"/Login",
    element:<Login/>
  },
  {
    path:"/SignUp",
    element:<Signup/>
  },
  {
    path:"/ForgetPassword",
    element:<ForgetPassword/>
  },
  {
    path:"/VerifyEmail",
    element:<VerifyEmail/>
  }
]);
function App() {

  return (
    <main>
      <RouterProvider router={appRounter}>

      </RouterProvider>
    </main>
  );
}

export default App;
