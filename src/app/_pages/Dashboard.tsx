"use client";
import JobAlertCard from "@/_components/dashboard/JobAlertCard";
import JobList from "@/_components/dashboard/JobList";
import Navbar from "@/_components/dashboard/Navbar";
import { NavigationMenu } from "@/_components/dashboard/NavigationMenu";
import SortingBar from "@/_components/dashboard/SortingBar";
import { useState } from "react";

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <div className="flex bg-gray-100 w-full relative">
      {/* Sidebar */}
      <div
        className={`
        bg-white h-screen shadow-lg transition-transform duration-300 z-50
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        absolute left-0 top-0 z-10 md:relative md:translate-x-0`}
      >
        <NavigationMenu />
      </div>
      <div className="flex flex-col relative w-full z-20">
        <div className="z-30">
          <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        </div>
        <div className="z-20">
          <SortingBar />
        </div>
        <main className="p-6 relative z-10">
          <JobAlertCard />
          <JobList />
        </main>
      </div>
    </div>
  );
}
