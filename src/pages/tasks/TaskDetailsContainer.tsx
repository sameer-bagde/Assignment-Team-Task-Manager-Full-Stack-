import { useEffect } from "react";
import { useProjectsState } from "../../context/projects/context";
import { useTasksState, useTasksDispatch } from "../../context/task/context";
import TaskDetails from "./TaskDetails";
import { useParams } from "react-router-dom";
import { refreshTasks } from "../../context/task/actions";

const TaskDetailsContainer = () => {
  const { taskID, projectID } = useParams();
  const projectState = useProjectsState();
  const taskListState = useTasksState();
  const taskDispatch = useTasksDispatch();

  const isFetchingTasks = taskListState.isLoading;
  const selectedTask = taskListState.projectData.tasks?.[`task_${taskID}`];

  // Auto-fetch tasks for this project if they haven't been loaded yet
  useEffect(() => {
    if (projectID && !isFetchingTasks && !selectedTask) {
      refreshTasks(taskDispatch, projectID);
    }
  }, [projectID, taskDispatch]);

  if (isFetchingTasks || !projectState || projectState?.isLoading) {
    return <>Loading...</>;
  }

  if (!selectedTask && !isFetchingTasks) {
    return <>No such task!</>;
  }

  if (!selectedTask) {
    return <>Loading...</>;
  }

  return <TaskDetails />;
};

export default TaskDetailsContainer;
