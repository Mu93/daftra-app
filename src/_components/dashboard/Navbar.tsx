"use client";
import Link from "next/link";
import { useState } from "react";
import { IoSearch } from "react-icons/io5";
import {
  FaHome,
  FaBriefcase,
  FaUsers,
  FaBell,
  FaEnvelope,
  FaUserCircle,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import ProfileMenu from "./ProfileMenu";
import { LayoutDashboard } from "lucide-react";

export default function Navbar({
  toggleSidebar,
  isSidebarOpen,
}: {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  return (
    <nav className="bg-black text-white p-4">
      <div className="flex justify-between items-center">
        {/* Logo & Search */}
        <div className="flex items-center gap-4">
          <div className="text-4xl font-bold tracking-widest">
            i<span className="text-green-400">Z</span>AM
          </div>
          <div className="hidden md:block">
            <SearchInput />
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 items-center">
          <NavLinks />
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center text-white hover:text-green-500"
          >
            <FaUserCircle className="mr-2" />
            Profile
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <button
            className="md:hidden text-white flex gap-2 items-center"
            onClick={() => toggleSidebar()}
          >
            {isSidebarOpen ? (
              <FaTimes size={24} />
            ) : (
              <LayoutDashboard size={24} />
            )}
          </button>

          <button
            className="md:hidden text-white flex gap-2 items-center"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="flex flex-col gap-4 mt-4 bg-black p-4 md:hidden">
          <SearchInput />
          <NavLinks />
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center text-white hover:text-green-500"
          >
            <FaUserCircle className="mr-2" />
            Profile
          </button>
        </div>
      )}

      {/* Profile Menu */}
      {isProfileMenuOpen && (
        <div className="absolute top-16 right-4 bg-white shadow-lg rounded-lg">
          <ProfileMenu />
        </div>
      )}
    </nav>
  );
}

// Extracted NavLinks for reusability
const NavLinks = () => (
  <>
    <Link
      href="#"
      className="flex items-center text-white hover:text-green-500"
    >
      <FaHome className="mr-2" /> Home
    </Link>
    <Link
      href="#"
      className="flex items-center text-white hover:text-green-500"
    >
      <FaBriefcase className="mr-2" /> Jobs
    </Link>
    <Link
      href="#"
      className="flex items-center text-white hover:text-green-500"
    >
      <FaUsers className="mr-2" /> Employers
    </Link>
    <Link
      href="#"
      className="flex items-center text-white hover:text-green-500"
    >
      <FaBell className="mr-2" /> Notifications
    </Link>
    <Link
      href="#"
      className="flex items-center text-white hover:text-green-500"
    >
      <FaEnvelope className="mr-2" /> Messaging
    </Link>
  </>
);

// Search Input Component
const SearchInput = () => (
  <div className="relative w-full ">
    <input
      type="text"
      placeholder="Search..."
      className="p-3 pl-10 pr-4 rounded-full outline-none text-black w-full border border-gray-300 focus:ring-2 focus:ring-green-600"
    />
    <IoSearch
      size={20}
      className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500"
    />
  </div>
);
