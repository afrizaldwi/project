import { NavLink, Link } from "react-router-dom";
import useAuth from "../../hook/useAuth";
import { adminMenu, penyewaMenu } from "./menu";
import { useState } from "react";

interface SidebarProps {
  display: string;
}

const Sidebar = ({ display }: SidebarProps) => {
  const [isLoadingSubmit, setIsLoadingSubmit] = useState<boolean>(false);
  const { user, logout } = useAuth();

  const handlerLogout = async () => {
    setIsLoadingSubmit(true);
    await logout();
  };

  const menu = user?.role === "admin" ? adminMenu : penyewaMenu;

  return (
    <aside
      className={`max-lg:${display} w-full lg:flex flex-col lg:w-1/5 min-h-screen bg-primary text-white`}
    >
      <div className="px-6 py-6">
        <Link to={`/${user?.role}/dashboard`} className="hover:opacity-80 transition-opacity">
          <h1 className="text-xl font-bold">Kost Bahagia</h1>
        </Link>
      </div>

      <nav className="flex flex-col flex-1 px-3 py-2 gap-2">
        {menu.map((menu) => (
          <NavLink
            key={menu.path}
            to={menu.path}
            className={({ isActive }) =>
              `px-4 py-2.5 rounded-md text-sm font-semibold transition-all ${
                isActive
                  ? "bg-white text-primary shadow-sm"
                  : "text-white/90 hover:bg-white/10"
              }`
            }
          >
            {menu.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4">
        <button
          onClick={handlerLogout}
          disabled={isLoadingSubmit}
          className="w-full px-4 py-3 rounded-lg text-sm font-bold bg-[#1e40af] hover:bg-[#1a368e] text-white shadow-md transition-all"
        >
          {isLoadingSubmit ? "Loading..." : "Logout"}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
