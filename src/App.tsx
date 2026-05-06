import { RouterProvider } from "react-router-dom";
import "./App.css";
import router from "./routes";
import { CommentsProvider } from "./context/comment/context";
import { ProjectsProvider } from "./context/projects/context";
import { MembersProvider } from "./context/members/context";
import { AuthProvider } from "./context/auth/context";
import { DashboardProvider } from "./context/dashboard/context";

const App = () => {
  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-900 transition-colors">
      <AuthProvider>
        <DashboardProvider>
          <ProjectsProvider>
            <MembersProvider>
              <CommentsProvider>
                <RouterProvider router={router} />
              </CommentsProvider>
            </MembersProvider>
          </ProjectsProvider>
        </DashboardProvider>
      </AuthProvider>
    </div>
  );
};
export default App;
