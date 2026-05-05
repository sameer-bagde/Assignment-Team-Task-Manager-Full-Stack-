/* eslint-disable @typescript-eslint/no-unused-vars */
import { Draggable } from "react-beautiful-dnd";
import React, { forwardRef } from "react";
import { useParams } from "react-router-dom";
import { useTasksDispatch } from "../../context/task/context";
import { deleteTask } from "../../context/task/actions";
import { TaskDetails } from "../../context/task/types";
import "./TaskCard.css";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/auth/context";

const Task = forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<{ task: TaskDetails }>
>((props, ref) => {
  const taskDispatch = useTasksDispatch();
  const { projectID } = useParams();
  const { isAdmin } = useAuth();
  const { task } = props;
  return (
    <div ref={ref} {...props} className="mx-2 mb-3">
      <Link
        className="block w-full p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-indigo-200 dark:hover:border-indigo-700/60 transition-all duration-200 group relative"
        to={`tasks/${task.id}`}
      >
        <div className="flex flex-col gap-2">
          <div className="flex-1 pr-8">
            <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100 mb-1">{task.title}</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 line-clamp-2">
              {task.description}
            </p>
            <div className="flex items-center justify-between mt-auto">
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </span>
              <div className="flex -space-x-2">
                {task.assignees && task.assignees.length > 0 && task.assignees.map(a => (
                  <div key={a.id} className="h-6 w-6 rounded-full ring-2 ring-white dark:ring-slate-800 bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-[10px] text-white font-medium" title={a.name}>
                    {a.name.charAt(0).toUpperCase()}
                  </div>
                ))}
              </div>
            </div>
          </div>
          {isAdmin && (
            <button
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
              onClick={(event) => {
                event.preventDefault();
                deleteTask(taskDispatch, projectID ?? "", task);
              }}
              title="Delete Task"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </Link>
    </div>
  );
});

const Container = (
  props: React.PropsWithChildren<{
    task: TaskDetails;
    index: number;
  }>,
) => {
  return (
    <Draggable index={props.index} draggableId={`task_${props.task.id}`}>
      {(provided) => (
        <Task
          task={props.task}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        />
      )}
    </Draggable>
  );
};

export default Container;
