import React from "react";
import Dashboard from "./_comp/Dashboard";

const Page: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <Dashboard />
      {children}
    </>
  );
};

export default Page;
