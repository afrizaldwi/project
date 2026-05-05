import { NavLink } from "react-router-dom";
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
      className={`max-lg:${display} w-full lg:flex flex-col lg:w-1/5 min-h-screen bg-primary text-light`}
    >
      <div className="px-6 py-5 border-b border-accent">
        <h1 className="text-xl font-bold">Kost Bahagia</h1>
      </div>

      <nav className="flex flex-col flex-1 px-4 py-4 gap-1">
        {menu.map((menu) => (
          <NavLink
            key={menu.path}
            to={menu.path}
            className={({ isActive }) =>
              `px-4 py-2 rounded text-sm font-medium transition-colors ${
                isActive
                  ? "bg-light text-primary"
                  : "hover:bg-accent text-light"
              }`
            }
          >
            {menu.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-accent">
        <button
          onClick={handlerLogout}
          disabled={isLoadingSubmit}
          className="w-full px-4 py-2 rounded text-sm font-medium bg-accent hover:opacity-90 text-light"
        >
          {isLoadingSubmit ? "Loading..." : "Logout"}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
