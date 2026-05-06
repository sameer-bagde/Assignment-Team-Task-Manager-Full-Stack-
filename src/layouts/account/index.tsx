import { Outlet } from "react-router-dom";
import Appbar from "./Appbar";

const AccountLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Appbar />
      <main className="flex-grow flex flex-col">
        <div className="flex-grow w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AccountLayout;
