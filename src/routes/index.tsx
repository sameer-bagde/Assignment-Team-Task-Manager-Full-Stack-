import { createBrowserRouter, Navigate } from "react-router-dom";
import ProjectDetails from "../pages/project_details";
import NewTask from "../pages/tasks/NewTask";
import TaskDetailsContainer from "../pages/tasks/TaskDetailsContainer";

import AccountLayout from "../layouts/account";
import Signin from "../pages/signin";
import Signup from "../pages/signup";
import Projects from "../pages/projects";
import Members from "../pages/members";
import Logout from "../pages/logout";
import Notfound from "../pages/Notfound";
import ProtectedRoute from "../ProtectedRoute";
import { Outlet } from "react-router-dom";
import ProjectContainer from "../pages/projects/ProjectContainer";
import Dashboard from "../pages/dashboard";

const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/account/dashboard" replace /> },
  { path: "/signin",  element: <Signin /> },
  { path: "/signup",  element: <Signup /> },
  { path: "/logout",  element: <Logout /> },
  { path: "notfound", element: <Notfound /> },
  { path: "*",        element: <Navigate to="/notfound" replace /> },

  // ── Protected Routes ─────────────────────────────────────────────────────
  {
    path: "account",
    element: (
      <ProtectedRoute>
        <AccountLayout />
      </ProtectedRoute>
    ),
    ErrorBoundary: () => <>Failed to load the page</>,
    children: [
      { index: true, element: <Navigate to="/account/dashboard" replace /> },

      // Dashboard
      { path: "dashboard", element: <Dashboard /> },

      // Projects + nested tasks
      {
        path: "projects",
        element: <ProjectContainer />,
        children: [
          { index: true, element: <Projects /> },
          {
            path: ":projectID",
            element: <ProjectDetails />,
            children: [
              { index: true, element: <><Outlet /></> },
              {
                path: "tasks",
                children: [
                  { index: true, element: <Navigate to="../" /> },
                  { path: "new",     element: <NewTask /> },
                  { path: ":taskID", children: [{ index: true, element: <TaskDetailsContainer /> }] },
                ],
              },
            ],
          },
        ],
      },

      // Members
      { path: "members", element: <Members /> },
    ],
  },
]);

export default router;
