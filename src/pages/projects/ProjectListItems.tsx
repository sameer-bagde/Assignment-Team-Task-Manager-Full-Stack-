/* eslint-disable @typescript-eslint/no-explicit-any */
import { useProjectsState } from "../../context/projects/context";
import { Link } from "react-router-dom";
import { useIsAdmin } from "../../context/auth/context";
import { API_ENDPOINT } from "../../config/constants";
import { useProjectsDispatch } from "../../context/projects/context";
import { fetchProjects } from "../../context/projects/actions";
import ProjectMembersModal from "./ProjectMembersModal";
import { useState } from "react";

export default function ProjectListItems() {
  const state: any         = useProjectsState();
  const dispatch           = useProjectsDispatch();
  const isAdmin            = useIsAdmin();
  const { projects, isLoading, isError, errorMessage } = state;
  const [selectedProjectForMembers, setSelectedProjectForMembers] = useState<any>(null);

  if (projects.length === 0 && isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin h-8 w-8 rounded-full border-4 border-indigo-200 border-t-indigo-600" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 text-rose-700 text-sm">
        {errorMessage}
      </div>
    );
  }

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm("Delete this project? This cannot be undone.")) return;
    const token = localStorage.getItem("authToken") ?? "";
    await fetch(`${API_ENDPOINT}/projects/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchProjects(dispatch);
  };

  if (projects.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-5xl mb-3">📁</div>
        <p className="text-slate-500 text-sm">No projects yet. Create one to get started!</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {projects.map((project: any) => (
        <div key={project.id} className="relative group">
          <Link
            to={`${project.id}`}
            className="flex items-center justify-between p-5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group-hover:border-indigo-100 dark:group-hover:border-indigo-900/50"
          >
            <div>
              <h5 className="text-base font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                {project.name}
              </h5>
              {project.description && (
                <p className="mt-0.5 text-sm text-slate-400 truncate max-w-sm">
                  {project.description}
                </p>
              )}
              {project.members && (
                <p className="mt-1 text-xs text-slate-400">
                  {project.members.length} member{project.members.length !== 1 ? "s" : ""}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden group-hover:inline-flex items-center text-xs text-indigo-600 font-medium gap-1">
                Open →
              </span>
              {isAdmin && (
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedProjectForMembers(project);
                    }}
                    className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1.5 rounded-lg text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 dark:text-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 mr-2"
                  >
                    Manage Members
                  </button>
                  <button
                    type="button"
                    id={`delete-project-${project.id}`}
                    onClick={(e) => handleDelete(e, project.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20"
                    title="Delete project"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </Link>
        </div>
      ))}

      <ProjectMembersModal 
        isOpen={!!selectedProjectForMembers} 
        onClose={() => setSelectedProjectForMembers(null)} 
        project={selectedProjectForMembers}
        onUpdate={() => fetchProjects(dispatch)}
      />
    </div>
  );
}
