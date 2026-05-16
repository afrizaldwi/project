import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Users, Wrench, Menu, LogOut, Home } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const userName = 'Budi'; // Mocking user

  const navLinks = [
    { to: '/', icon: <Users size={20} />, label: 'Data Tamu' },
    { to: '/kerusakan', icon: <Wrench size={20} />, label: 'Laporan Kerusakan' },
  ];

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50 flex font-sans text-gray-800">
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-gray-800/50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col
        `}>
          <div className="h-16 flex items-center px-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 text-white p-2 rounded-lg">
                <Home size={20} />
              </div>
              <div>
                <h2 className="font-bold text-gray-800 leading-tight">Kost Kostan</h2>
                <p className="text-xs text-gray-500">Management</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto py-6 px-4">
            <p className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Menu Utama</p>
            <nav className="space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsSidebarOpen(false)}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors
                    ${isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                  `}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </NavLink>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0">
          <header className="h-16 flex items-center justify-between px-4 lg:px-8 bg-white border-b border-gray-200">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 lg:hidden"
            >
              <Menu size={24} />
            </button>

            <div className="ml-auto flex items-center gap-4">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-gray-700 hidden sm:block">
                  Halo, <span className="text-blue-600">{userName}</span>
                </span>
                <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold border-2 border-white shadow-sm">
                  {userName.charAt(0)}
                </div>
              </div>

              <div className="h-6 w-px bg-gray-200 mx-1 hidden sm:block" />

              <Tooltip>
                <TooltipTrigger>
                  <button className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors">
                    <LogOut size={20} />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Keluar</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </header>

          <div className="flex-1 overflow-auto p-4 md:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
}
