import React, { Suspense } from "react";
import ErrorBoundary from "../../components/ErrorBoundary";
const MemberList = React.lazy(() => import("./MemberList"));
import NewMember from "./NewMember";
import { useAuth } from "../../context/auth/context";

const Members = () => {
  const { isAdmin } = useAuth();
  
  return (
    <>
      <div className="flex justify-between">
        <h2 className="text-2xl font-medium tracking-tight">Members</h2>
        {isAdmin && <NewMember />}
      </div>
      <ErrorBoundary>
        <Suspense fallback={<div className="suspense-loading">Loading...</div>}>
          <MemberList />
        </Suspense>
      </ErrorBoundary>
    </>
  );
};
export default Members;
