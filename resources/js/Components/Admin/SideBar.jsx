import {
  Home,
  X,
  Book,
  User,
  ArrowLeftRight,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Wallet,
  FileText,
} from "lucide-react";
import { Link } from "@inertiajs/react";
import { useState } from "react";

export default function Sidebar({ isOpen, setIsOpen }) {
  // Keep submenu open if route is under transaction.*
  const [isTransactionOpen, setIsTransactionOpen] = useState(
    route().current("transaction.*") || route().current("fines.*")
  );

  const linkClass = (name) =>
    `flex items-center gap-3 p-3 rounded-lg transition-colors duration-200
     ${route().current(name) ? "bg-blue-700 font-semibold" : "hover:bg-blue-500/70"}`;

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`
          bg-blue-600 text-white flex flex-col p-5 shadow-xl h-full
          transition-transform duration-300
          fixed top-0 left-0 z-40 w-56
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:static lg:translate-x-0 
        `}
      >
        {/* Brand + Close button (mobile only) */}
        <div className="flex items-center justify-between mb-8 border-b border-white/20 pb-4">
          <h2 className="text-xl font-extrabold tracking-wide">Admin</h2>
          <button
            className="lg:hidden text-white hover:text-gray-200"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2">
          <Link
            href={route("dashboard")}
            className={linkClass("dashboard")}
            onClick={() => setIsOpen(false)}
          >
            <Home className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </Link>

          <Link
            className={linkClass("books.index")}
            href={route("books.index")}
            onClick={() => setIsOpen(false)}
          >
            <Book className="w-5 h-5" />
            <span className="font-medium">Books</span>
          </Link>

          <Link
            className={linkClass("members.index")}
            href={route("members.index")}
            onClick={() => setIsOpen(false)}
          >
            <User className="w-5 h-5" />
            <span className="font-medium">Member</span>
          </Link>

          {/* Transaction Dropdown */}
          <button
            className="flex items-center justify-between gap-3 p-3 rounded-lg hover:bg-blue-500/70 transition-colors duration-200"
            onClick={() => setIsTransactionOpen(!isTransactionOpen)}
          >
            <div className="flex items-center gap-3">
              <ArrowLeftRight className="w-5 h-5" />
              <span className="font-medium">Transaction</span>
            </div>
            {isTransactionOpen ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          {/* Submenu */}
          <div
            className={`ml-8 flex flex-col gap-2 overflow-hidden transition-all duration-300 ease-in-out
              ${isTransactionOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}
            `}
          >
            <Link
              href={route("transaction.borrow.list")}
              className={`flex items-center gap-2 p-2 rounded-lg hover:bg-blue-500/60 ${
                route().current("transaction.borrow.list") ? "bg-blue-700 font-semibold" : ""
              }`}
              onClick={() => setIsOpen(false)}
            >
              <BookOpen className="w-4 h-4" />
              <span>Borrow</span>
            </Link>

            <Link
              href={route("fines.list")}
              className={`flex items-center gap-2 p-2 rounded-lg hover:bg-blue-500/60 ${
                route().current("fines.list") ? "bg-blue-700 font-semibold" : ""
              }`}
              onClick={() => setIsOpen(false)}
            >
              <Wallet className="w-4 h-4" />
              <span>Fines</span>
            </Link>

            <Link
              href={route("transaction.history-list")}
              className={`flex items-center gap-2 p-2 rounded-lg hover:bg-blue-500/60 ${
                route().current("transaction.history-list") ? "bg-blue-700 font-semibold" : ""
              }`}
              onClick={() => setIsOpen(false)}
            >
              <FileText className="w-4 h-4" />
              <span>History</span>
            </Link>
          </div>
        </nav>
      </aside>

      {/* Overlay (mobile only when open) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
