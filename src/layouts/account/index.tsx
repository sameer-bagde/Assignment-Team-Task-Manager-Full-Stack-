import { Outlet } from "react-router-dom";
import Appbar from "./Appbar";

const AccountLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Appbar />
      <main className="flex-grow flex flex-col">
        <div className="flex-grow w-full max-w-[1600px] mx-auto px-6 py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AccountLayout;
