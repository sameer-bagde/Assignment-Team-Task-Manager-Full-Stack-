import React, { useEffect, useState } from "react";
import { useDashboardState, useDashboardDispatch } from "../../context/dashboard/context";
import { fetchDashboard } from "../../context/dashboard/actions";
import { useAuth } from "../../context/auth/context";
import DashboardStatsGrid from "./DashboardStats";
import { Link } from "react-router-dom";

const Dashboard: React.FC = () => {
  const state    = useDashboardState();
  const dispatch = useDashboardDispatch();
  const { user, isAdmin } = useAuth();

  const [projectFilter, setProjectFilter] = useState("");
  const [userFilter,    setUserFilter]    = useState("");

  // Initial fetch
  useEffect(() => {
    if (dispatch) fetchDashboard(dispatch, {});
  }, [dispatch]);

  const applyFilters = () => {
    if (dispatch)
      fetchDashboard(dispatch, {
        projectId: projectFilter || undefined,
        userId:    userFilter    || undefined,
      });
  };

  const resetFilters = () => {
    setProjectFilter("");
    setUserFilter("");
    if (dispatch) fetchDashboard(dispatch, {});
  };

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
          {greeting()},{" "}
          <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            {user?.name ?? "there"}
          </span>{" "}
          👋
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Here's a snapshot of your team's progress today.
        </p>
      </div>

      {/* Filters (Admin only) */}
      {isAdmin && state?.stats && state.stats.projects.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">
              Filter by Project
            </label>
            <select
              id="project-filter"
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm px-3 py-2 focus:ring-2 focus:ring-indigo-300 outline-none"
            >
              <option value="">All Projects</option>
              {state.stats.projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <button
            id="apply-filter-btn"
            onClick={applyFilters}
            className="rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 transition-colors"
          >
            Apply
          </button>
          <button
            id="reset-filter-btn"
            onClick={resetFilters}
            className="rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-medium px-4 py-2 transition-colors"
          >
            Reset
          </button>
        </div>
      )}

      {/* Loading */}
      {state?.isLoading && (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin h-10 w-10 rounded-full border-4 border-indigo-200 border-t-indigo-600" />
        </div>
      )}

      {/* Error */}
      {state?.isError && (
        <div className="rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 px-5 py-4 text-rose-700 dark:text-rose-300 text-sm">
          {state.errorMessage}
        </div>
      )}

      {/* Stats */}
      {!state?.isLoading && state?.stats && (
        <>
          <DashboardStatsGrid stats={state.stats} />

          {/* My Assigned Tasks (Members only) */}
          {!isAdmin && state.stats.myTasks && state.stats.myTasks.length > 0 && (
            <div className="mt-8 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm p-6">
              <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">📋 My Assigned Tasks</h2>
              <div className="space-y-3">
                {state.stats.myTasks.map((task) => {
                  const stateBadge = {
                    pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
                    in_progress: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
                    done: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
                  }[task.state] ?? 'bg-slate-100 text-slate-600';
                  const stateLabel = { pending: 'Pending', in_progress: 'In Progress', done: 'Done' }[task.state];
                  return (
                    <Link
                      key={task.id}
                      to={`/account/projects/${task.projectId}/tasks/${task.id}`}
                      className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">{task.title}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{task.projectName} · Due {new Date(task.dueDate).toDateString()}</p>
                      </div>
                      <span className={`ml-3 flex-shrink-0 px-2 py-1 rounded-md text-xs font-medium ${stateBadge}`}>
                        {stateLabel}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Progress bar */}
          <div className="mt-8 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm p-6">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Overall Completion
              </h2>
              <span className="text-sm font-bold text-indigo-600">
                {state.stats.total > 0
                  ? Math.round((state.stats.completed / state.stats.total) * 100)
                  : 0}%
              </span>
            </div>
            <div className="h-3 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
              <div
                id="completion-bar"
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-700"
                style={{
                  width: `${
                    state.stats.total > 0
                      ? (state.stats.completed / state.stats.total) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
            <div className="mt-3 flex gap-6 text-xs text-slate-400">
              <span>✅ {state.stats.completed} done</span>
              <span>⚡ {state.stats.inProgress} in progress</span>
              <span>🕐 {state.stats.pending} pending</span>
              {state.stats.overdue > 0 && (
                <span className="text-rose-500 font-medium">🚨 {state.stats.overdue} overdue</span>
              )}
            </div>
          </div>
        </>
      )}

      {/* Empty state */}
      {!state?.isLoading && state?.stats && state.stats.total === 0 && (
        <div className="mt-8 text-center py-16">
          <div className="text-5xl mb-4">🚀</div>
          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
            No tasks yet
          </h3>
          <p className="text-slate-400 text-sm mt-1">
            Create a project and add tasks to get started.
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
