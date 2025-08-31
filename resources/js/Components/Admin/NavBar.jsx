import { ChevronDown, User, Settings, LogOut, Menu } from "lucide-react";
import { Link, usePage } from "@inertiajs/react";
import { useState } from "react";

export default function Navbar({ onMenuClick }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { auth } = usePage().props;

  return (
    <nav className="w-full bg-red-600 shadow-lg px-6 py-3 flex justify-between items-center">
      {/* Left: Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 bg-red-500 hover:bg-red-700 rounded-lg text-white transition"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Brand */}
      <div className="text-xl font-extrabold text-white tracking-wide">
        📚 PAP LMS
      </div>

      {/* Right: Profile */}
      <div className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-red-500 transition"
        >
          <img
            src="/avatar.png"
            alt="Profile"
            className="w-9 h-9 rounded-full border-2 border-white"
          />
          <span className="font-medium text-white hidden sm:inline">
            {auth?.user?.name || "Guest"}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-white transition-transform ${
              dropdownOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown */}
        {dropdownOpen && (
          <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl py-2 z-50">
            <Link
              href="/profile"
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
            >
              <User className="w-4 h-4" />
              Profile
            </Link>

            {/* Settings with Submenu */}
            <div>
              <button
                onClick={() => setSettingsOpen(!settingsOpen)}
                className="flex items-center justify-between w-full px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
              >
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Settings
                </div>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    settingsOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {settingsOpen && (
                <div className="ml-8 mt-1 flex flex-col">
                  <Link
                   href={route('types.index')}
                    className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 transition"
                  >
                    Member Types
                  </Link>
                  <Link
                    href={route('policies.index')}
                    className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 transition"
                  >
                    Policies
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/logout"
              method="post"
              as="button"
              className="flex items-center gap-2 w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
            >
              <LogOut className="w-4 h-4" />
              Log Out
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
