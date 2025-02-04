import Dashboard from "./_comp/Dashboard";

export default function Page({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Dashboard />
      {children}
    </>
  );
}
