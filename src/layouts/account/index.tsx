import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

const AccountLayout = () => {
  return (
<<<<<<< HEAD
    <div className="flex h-screen bg-slate-50 dark:bg-[#0B1120] transition-colors duration-200">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden relative">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10">
          <div className="mx-auto max-w-5xl">
            <Outlet />
          </div>
        </main>
      </div>
=======
    <div className="flex flex-col min-h-screen">
      <Appbar />
      <main className="flex-grow flex flex-col">
        <div className="flex-grow w-full max-w-[1600px] mx-auto px-6 py-6">
          <Outlet />
        </div>
      </main>
>>>>>>> 1978db6c7bc8e3ec64dc6038bf813c48f00bae27
    </div>
  );
};

export default AccountLayout;
