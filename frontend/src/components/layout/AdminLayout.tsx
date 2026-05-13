import { Outlet } from "react-router-dom";
import Sidebar from "../navigation/Sidebar";
import { useState } from "react";

const AdminLayout = () => {
  const [sidebarDisplay, setSidebarDisplay] = useState<string>("hidden");

  const toggleSidebar = () => {
    setSidebarDisplay(sidebarDisplay === "hidden" ? "flex" : "hidden");
  };

  return (
    <div className="flex min-h-screen bg-light">
      {/* Mobile Toggle */}
      <button 
        onClick={toggleSidebar}
        className="lg:hidden fixed bottom-6 right-6 z-50 bg-primary text-white p-4 rounded-full shadow-lg"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar */}
      <Sidebar display={sidebarDisplay} />

      {/* Main Content */}
      <main className="flex-1 w-full lg:w-4/5 p-6 lg:p-10">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
