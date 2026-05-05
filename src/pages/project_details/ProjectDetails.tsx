import { useEffect } from "react";
import { Link, Outlet, useParams } from "react-router-dom";

import { useTasksDispatch, useTasksState } from "../../context/task/context";

import DragDropList from "./DragDropList";
import { refreshTasks } from "../../context/task/actions";
import { useProjectsState } from "../../context/projects/context";
import { useAuth } from "../../context/auth/context";

const ProjectDetails = () => {
  const { isAdmin } = useAuth();
  const tasksState = useTasksState();
  const taskDispatch = useTasksDispatch();
  const projectState = useProjectsState();
  const { projectID } = useParams();
  useEffect(() => {
    if (projectID) refreshTasks(taskDispatch, projectID);
  }, [projectID, taskDispatch]);
  const selectedProject = projectState?.projects.filter(
    (project) => `${project.id}` === projectID,
  )?.[0];

  if (!selectedProject) {
    return <>No such Project!</>;
  }

  if (tasksState.isLoading && Object.keys(tasksState.projectData.tasks).length === 0) {
    return <>Loading...</>;
  }
  return (
    <>
      <div className="flex justify-between">
        <h2 className="text-2xl font-medium tracking-tight text-slate-700 dark:text-white">
          {selectedProject.name}
        </h2>
        {isAdmin && (
          <Link to={`tasks/new`}>
            <button
              id="newTaskBtn"
              className="rounded-md bg-blue-600 px-4 py-2 m-2 text-sm font-medium text-white hover:bg-opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
            >
              New Task
            </button>
          </Link>
        )}
      </div>
      <div className="grid grid-cols-1 gap-2">
        <DragDropList data={tasksState.projectData} />
      </div>
      {/* Child routes: NewTask modal, TaskDetails modal */}
      <Outlet />
    </>
  );
};

export default ProjectDetails;
