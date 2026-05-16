import { useState } from "react";
import Sidebar from "./Sidebar";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-primary text-light">
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 rounded hover:bg-accent flex flex-col gap-1 right-4"
        >
          <div className="w-5 h-0.5 bg-light"></div>
          <div className="w-5 h-0.5 bg-light"></div>
          <div className="w-5 h-0.5 bg-light"></div>
        </button>
      </header>

      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div onClick={() => setIsOpen(false)}>
            <Sidebar display="flex" />
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
