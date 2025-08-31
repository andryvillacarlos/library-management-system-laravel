import Sidebar from "@/Components/Admin/SideBar";
import Navbar from "@/Components/Admin/NavBar";
import { useState } from "react";

export default function DashboardLayout({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <Navbar onMenuClick={() => setIsOpen(!isOpen)} />

        {/* Page Content */}
        <main className="flex-1 bg-white p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
