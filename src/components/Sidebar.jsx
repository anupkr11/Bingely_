import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LayoutGrid, Film, Tv, Bookmark, Clapperboard } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store";

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showLogout, setShowLogout] = React.useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const navItems = [
    { icon: LayoutGrid, path: "/", label: "Home" },
    { icon: Film, path: "/movies", label: "Movies" },
    { icon: Tv, path: "/tv-series", label: "TV Series" },
    { icon: Bookmark, path: "/bookmarks", label: "Bookmarks" },
  ];

  return (
    <aside className="fixed left-0 top-0 w-full h-20 flex flex-row items-center px-4 bg-semi-dark-blue md:left-4 md:top-4 md:h-[calc(100vh-32px)] md:w-24 md:flex-col md:py-8 md:rounded-2xl z-50">
      <div className="md:mb-12 mr-auto md:mr-0">
        <NavLink to="/">
          <Clapperboard className="text-primary w-6 h-6 md:w-8 md:h-8" />
        </NavLink>
      </div>

      <nav className="flex flex-row md:flex-col gap-6 md:gap-8 flex-1 justify-center">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `nav-link ${isActive ? "nav-link-active" : ""}`
            }
          >
            <item.icon className="w-6 h-6" />
          </NavLink>
        ))}
      </nav>

      <div className="md:mt-auto ml-auto md:ml-0 flex items-center md:flex-col gap-4 relative">
        {user && (
          <span className="hidden md:block text-[15px] text-grey-blue truncate max-w-[80px] text-center">
            {user.firstName || user.email.split("@")[0]}
          </span>
        )}
        <div
          onClick={() => setShowLogout(!showLogout)}
          className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-pure-white overflow-hidden cursor-pointer hover:border-primary transition-colors"
        >
          <img
            src={
              user?.profileImage ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email || "Guest"}`
            }
            alt="User Avatar"
            className="w-full h-full object-cover"
          />
        </div>

        {showLogout && (
          <div className="absolute top-full mt-2 right-0 md:top-0 md:left-full md:ml-4 md:mt-0 bg-semi-dark-blue border border-grey-blue rounded-lg p-2 shadow-2xl z-[60] min-w-[120px]">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 hover:bg-primary/20 rounded transition-colors text-sm"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
