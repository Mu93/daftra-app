"use client";
import JobAlertCard from "@/_components/dashboard/JobAlertCard";
import JobList from "@/_components/dashboard/JobList";
import Navbar from "@/_components/dashboard/Navbar";
import { NavigationMenu } from "@/_components/dashboard/NavigationMenu";
import SortingBar from "@/_components/dashboard/SortingBar";

export default function Dashboard() {
  return (
    <div className="flex bg-gray-100 w-full">
      <div className="hidden md:flex items-center max-w-[40%]">
        <NavigationMenu />
      </div>
      <div className="flex flex-col relative w-full ">
        <div className="z-30">
          <Navbar />
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
