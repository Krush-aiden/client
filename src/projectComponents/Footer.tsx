import { NavLink } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white w-full mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {/* Brand */}
          <div className="col-span-1 sm:col-span-2 md:col-span-1">
            <h2 className="text-2xl font-extrabold text-orange">FoodSy</h2>
            <p className="mt-2 text-gray-400 text-xs leading-relaxed">
              Delivering happiness one meal at a time.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-1.5 text-sm">
              <li>
                <NavLink
                  to="/"
                  className="text-gray-400 hover:text-orange transition-colors"
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/Profile"
                  className="text-gray-400 hover:text-orange transition-colors"
                >
                  Profile
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/Cart"
                  className="text-gray-400 hover:text-orange transition-colors"
                >
                  Cart
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Cuisines */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
              Popular Cuisines
            </h3>
            <ul className="space-y-1.5 text-sm">
              {["Pizza", "Biryani", "Burger", "Sushi"].map((c) => (
                <li key={c}>
                  <NavLink
                    to={`/Search/${c}`}
                    className="text-gray-400 hover:text-orange transition-colors"
                  >
                    {c}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
              Contact
            </h3>
            <ul className="space-y-1.5 text-sm text-gray-400">
              <li>support@foodsy.com</li>
              <li>+91 98765 43210</li>
              <li>Mumbai, India</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-6 pt-4 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} FoodSy. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
