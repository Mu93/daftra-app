import JobAlertCard from "@/_components/JobAlertCard";
import JobList from "@/_components/JobList";
import Navbar from "@/_components/Navbar";
import { NavigationMenu } from "@/_components/NavigationMenu";
import SortingBar from "@/_components/SortingBar";

export default function Dashboard({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex bg-gray-100 w-full">
      <div className="hidden md:block w-[15%] ">
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
          {children}
        </main>
      </div>
    </div>
  );
}
