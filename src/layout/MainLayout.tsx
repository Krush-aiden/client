import Footer from "@/projectComponents/Footer";
import Navbar from "@/projectComponents/NavBar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header>
        <Navbar />
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="w-full">
        <Footer />
      </footer>
    </div>
  );
};
export default MainLayout;
