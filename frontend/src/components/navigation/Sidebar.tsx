import { NavLink, useNavigate } from "react-router-dom";
import useAuth from "../../hook/useAuth";
import { adminMenu, penyewaMenu } from "./menu";
import { useState } from "react";

interface SidebarProps {
  display: string;
}

const Sidebar = ({ display }: SidebarProps) => {
  const [isLoadingSubmit, setIsLoadingSubmit] = useState<boolean>(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handlerLogout = async () => {
    setIsLoadingSubmit(true);
    await logout();
    navigate("/", { replace: true });
  };

  const menu = user?.role === "admin" ? adminMenu : penyewaMenu;

  return (
    <aside
      className={`${display} fixed left-0 top-0 z-40 h-screen w-full flex-col bg-primary text-light lg:flex lg:w-1/5`}

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
              `px-4 py-2 rounded text-sm font-medium transition-colors ${isActive
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
          {isLoadingSubmit ? "Memuat..." : "Keluar"}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;