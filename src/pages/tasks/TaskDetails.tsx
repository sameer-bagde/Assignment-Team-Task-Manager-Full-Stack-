/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment, useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { useTasksDispatch, useTasksState } from "../../context/task/context";
import { updateTask } from "../../context/task/actions";
import { Transition, Listbox } from "@headlessui/react";
import CheckIcon from "@heroicons/react/24/outline/CheckIcon";
import { useAuth } from "../../context/auth/context";
import { useProjectsState } from "../../context/projects/context";
import { addComment, fetchComments } from "../../context/comment/actions";
import { useCommentsState, useCommentsDispatch } from "../../context/comment/context";

// Only the fields the admin can edit via the form
type TaskEditFormValues = {
  title: string;
  description: string;
  dueDate: string;
};

const formatDateForPicker = (isoDate: string) => {
  if (!isoDate) return "";
  const d = new Date(isoDate);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const getInitials = (name: string) =>
  name ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "?";

const stateBadge: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  in_progress: "bg-blue-100 text-blue-700",
  done: "bg-green-100 text-green-700",
};
const stateLabel: Record<string, string> = {
  pending: "Pending",
  in_progress: "In Progress",
  done: "Done",
};

const TaskDetails = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  const { projectID, taskID } = useParams();
  const navigate = useNavigate();
  const { isAdmin, user } = useAuth();

  const projectState = useProjectsState();
  const taskListState = useTasksState();
  const taskDispatch = useTasksDispatch();
  const commentState = useCommentsState();
  const commentDispatch = useCommentsDispatch();

  const selectedProject = projectState?.projects.filter(
    (p) => `${p.id}` === projectID
  )[0];

  const selectedTask = taskListState.projectData.tasks[`task_${taskID}`];
  const canEdit = isAdmin;

  // Track assignee IDs in local state — initialize from selectedTask
  const [selectedPersons, setSelectedPersons] = useState<number[]>(
    selectedTask?.assignees?.map((a) => a.id) ?? []
  );

  const { register, handleSubmit, reset } = useForm<TaskEditFormValues>({
    defaultValues: {
      title: selectedTask?.title ?? "",
      description: selectedTask?.description ?? "",
      dueDate: selectedTask?.dueDate ? formatDateForPicker(selectedTask.dueDate) : "",
    },
  });

  // When selectedTask changes (e.g. after refresh), sync form + assignee state
  useEffect(() => {
    if (selectedTask) {
      reset({
        title: selectedTask.title ?? "",
        description: selectedTask.description ?? "",
        dueDate: selectedTask.dueDate ? formatDateForPicker(selectedTask.dueDate) : "",
      });
      setSelectedPersons(selectedTask.assignees?.map((a) => a.id) ?? []);
    }
  }, [selectedTask?.id]); // only re-run when a different task is loaded

  useEffect(() => {
    if (projectID && taskID) fetchComments(commentDispatch, projectID, taskID);
  }, [projectID, commentDispatch, taskID]);

  // Auto-scroll chat to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [commentState.comments]);

  if (!selectedTask) return <>No such Task!</>;
  if (isAdmin && !selectedProject) return <>No such Project!</>;

  const closeModal = () => {
    setIsOpen(false);
    navigate("../../");
  };

  // Build a clean payload with only the fields the backend expects
  const onSubmit: SubmitHandler<TaskEditFormValues> = async (data) => {
    setIsSaving(true);
    try {
      // Build the exact payload the backend PATCH endpoint expects
      const payload = {
        id: selectedTask.id,
        title: data.title,
        description: data.description,
        dueDate: data.dueDate,
        state: selectedTask.state,
        assignees: selectedPersons, // number[] of user IDs
      };

      await updateTask(taskDispatch, projectID ?? "", payload as any);
      closeModal();
    } catch (err) {
      console.error("Failed to update task:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendComment = async () => {
    const text = commentText.trim();
    if (!text) return;
    setIsSending(true);
    try {
      await addComment(commentDispatch, projectID ?? "", taskID ?? "", { description: text });
      if (projectID && taskID) await fetchComments(commentDispatch, projectID, taskID);
      setCommentText("");
    } catch (e) {
      console.error("Failed to add comment:", e);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendComment();
    }
  };

  const sortedComments = [...(commentState.comments ?? [])].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  // Get project members excluding admins for the assignee dropdown
  const availableMembers = selectedProject?.members?.filter((m: any) => m.role !== "ADMIN") ?? [];

  // Resolve selected IDs back to display names for the Listbox button
  const selectedNames = availableMembers
    .filter((m: any) => selectedPersons.includes(m.id))
    .map((m: any) => m.name);

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <div className="relative z-50">
          {/* Backdrop */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-3">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-200"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-150"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                {/* Wide panel: left = task info/edit, right = chat */}
                <div className="w-full max-w-3xl transform rounded-2xl bg-white dark:bg-slate-800 shadow-2xl flex flex-col md:flex-row overflow-hidden" style={{ minHeight: "520px", maxHeight: "85vh" }}>

                  {/* ─── LEFT: Task Details ─────────────────────────────── */}
                  {canEdit ? (
                    <form id="task-update-form" onSubmit={handleSubmit(onSubmit)} className="md:w-[45%] flex flex-col border-r border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                      {/* Header */}
                      <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">Task Details</p>
                            <h2 className="text-base font-bold text-slate-800 dark:text-white leading-tight truncate">{selectedTask.title}</h2>
                          </div>
                          <span className={`flex-shrink-0 text-xs font-semibold px-2 py-1 rounded-full ${stateBadge[selectedTask.state] ?? "bg-slate-100 text-slate-600"}`}>
                            {stateLabel[selectedTask.state] ?? selectedTask.state}
                          </span>
                        </div>
                      </div>

                      {/* Body - scrollable */}
                      <div className="flex-1 overflow-y-auto px-5 py-4">
                        <div className="space-y-3">
                          <div>
                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Title</label>
                            <input
                              type="text" required id="title" autoFocus
                              {...register("title", { required: true })}
                              className="mt-1 w-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-white rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-500"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Description</label>
                            <textarea
                              required id="description" rows={3}
                              {...register("description", { required: true })}
                              className="mt-1 w-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-white rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-500 resize-none"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Due Date</label>
                            <input
                              type="date" required id="dueDate"
                              {...register("dueDate", { required: true })}
                              className="mt-1 w-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-white rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-500"
                            />
                          </div>
                          <div className="relative">
                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Assignees</label>
                            <Listbox value={selectedPersons} onChange={setSelectedPersons} multiple>
                              <div className="relative mt-1">
                                <Listbox.Button className="w-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-white rounded-lg py-2 px-3 text-sm text-left focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-500">
                                  {selectedNames.length > 0 ? selectedNames.join(", ") : "Unassigned"}
                                </Listbox.Button>
                                <Listbox.Options className="absolute z-[9999] bottom-full mb-1 max-h-40 w-full overflow-auto rounded-lg bg-white dark:bg-slate-700 py-1 text-sm shadow-lg ring-1 ring-black/5 focus:outline-none">
                                  {availableMembers.length === 0 && (
                                    <li className="py-2 px-4 text-slate-400 text-xs">No members in this project</li>
                                  )}
                                  {availableMembers.map((person: any) => (
                                    <Listbox.Option key={person.id} value={person.id}
                                      className={({ active }) => `relative cursor-default select-none py-2 pl-9 pr-4 ${active ? "bg-indigo-50 dark:bg-slate-600 text-indigo-700 dark:text-indigo-200" : "text-slate-700 dark:text-slate-200"}`}
                                    >
                                      {({ selected }) => (
                                        <>
                                          <span className={`block truncate ${selected ? "font-semibold" : ""}`}>{person.name}</span>
                                          {selected && (
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-600">
                                              <CheckIcon className="h-4 w-4" aria-hidden="true" />
                                            </span>
                                          )}
                                        </>
                                      )}
                                    </Listbox.Option>
                                  ))}
                                </Listbox.Options>
                              </div>
                            </Listbox>
                          </div>
                        </div>
                      </div>

                      {/* Footer buttons */}
                      <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex gap-2">
                        <button type="submit" disabled={isSaving}
                          className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-semibold py-2 rounded-lg transition-colors">
                          {isSaving ? "Saving..." : "Save Changes"}
                        </button>
                        <button type="button" onClick={closeModal} ref={cancelButtonRef}
                          className="flex-1 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 text-sm font-semibold py-2 rounded-lg transition-colors">
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="md:w-[45%] flex flex-col border-r border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                      {/* Header */}
                      <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">Task Details</p>
                            <h2 className="text-base font-bold text-slate-800 dark:text-white leading-tight truncate">{selectedTask.title}</h2>
                          </div>
                          <span className={`flex-shrink-0 text-xs font-semibold px-2 py-1 rounded-full ${stateBadge[selectedTask.state] ?? "bg-slate-100 text-slate-600"}`}>
                            {stateLabel[selectedTask.state] ?? selectedTask.state}
                          </span>
                        </div>
                      </div>

                      {/* Body - scrollable */}
                      <div className="flex-1 overflow-y-auto px-5 py-4">
                        <div className="space-y-4">
                          <div>
                            <p className="text-xs font-semibold text-slate-400 uppercase">Description</p>
                            <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{selectedTask.description || "—"}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-slate-400 uppercase">Due Date</p>
                            <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                              {selectedTask.dueDate ? new Date(selectedTask.dueDate).toDateString() : "—"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-slate-400 uppercase">Assignees</p>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {selectedTask.assignees && selectedTask.assignees.length > 0
                                ? selectedTask.assignees.map((a: any) => (
                                  <span key={a.id} className="flex items-center gap-1.5 bg-indigo-50 dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 text-xs font-medium px-2 py-1 rounded-full">
                                    <span className="w-5 h-5 rounded-full bg-indigo-200 dark:bg-slate-600 text-indigo-700 dark:text-indigo-200 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                                      {getInitials(a.name)}
                                    </span>
                                    {a.name}
                                  </span>
                                ))
                                : <span className="text-sm text-slate-400">Unassigned</span>
                              }
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Footer buttons */}
                      <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex gap-2">
                        <button type="button" onClick={closeModal} ref={cancelButtonRef}
                          className="flex-1 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 text-sm font-semibold py-2 rounded-lg transition-colors">
                          Close
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ─── RIGHT: Chat / Comments ─────────────────────────── */}
                  <div className="md:w-[55%] flex flex-col bg-white dark:bg-slate-800">
                    {/* Chat Header */}
                    <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700 flex-shrink-0">
                      <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Discussion</p>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mt-0.5">Task Comments</p>
                    </div>

                    {/* Messages area */}
                    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4" id="commentsContainer">
                      {commentState.isLoading && (
                        <div className="flex justify-center pt-8">
                          <div className="animate-spin h-6 w-6 rounded-full border-2 border-indigo-200 border-t-indigo-600" />
                        </div>
                      )}

                      {!commentState.isLoading && sortedComments.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full text-center py-12">
                          <div className="text-4xl mb-3">💬</div>
                          <p className="text-sm font-medium text-slate-500">No messages yet</p>
                          <p className="text-xs text-slate-400 mt-1">Be the first to comment!</p>
                        </div>
                      )}

                      {!commentState.isLoading && sortedComments.map((comment) => {
                        const isOwn = comment.User?.id === user?.id;
                        const name = comment.User?.name ?? "Unknown";
                        const initials = getInitials(name);
                        const time = new Date(comment.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                        const date = new Date(comment.createdAt).toLocaleDateString([], { month: "short", day: "numeric" });

                        return (
                          <div key={comment.id} className={`flex items-end gap-2 ${isOwn ? "flex-row-reverse" : "flex-row"}`}>
                            {/* Avatar */}
                            <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-[11px] font-bold text-white ${isOwn ? "bg-indigo-500" : "bg-slate-400"}`}>
                              {initials}
                            </div>
                            {/* Bubble */}
                            <div className={`max-w-[72%] ${isOwn ? "items-end" : "items-start"} flex flex-col`}>
                              {!isOwn && (
                                <p className="text-[11px] font-semibold text-slate-500 mb-1 ml-1">{name}</p>
                              )}
                              <div className={`px-3 py-2 rounded-2xl text-sm leading-relaxed break-words ${
                                isOwn
                                  ? "bg-indigo-600 text-white rounded-br-sm"
                                  : "bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-bl-sm"
                              }`}>
                                {comment.description}
                              </div>
                              <p className={`text-[10px] text-slate-400 mt-1 ${isOwn ? "mr-1" : "ml-1"}`}>
                                {date} · {time}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={chatEndRef} />
                    </div>

                    {/* Chat Input */}
                    <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex-shrink-0">
                      <div className="flex items-end gap-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-300 dark:focus-within:ring-indigo-500 transition-shadow">
                        <textarea
                          id="commentBox"
                          rows={1}
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          onKeyDown={handleKeyDown}
                          placeholder="Type a message… (Enter to send)"
                          className="flex-1 resize-none bg-transparent text-sm text-slate-700 dark:text-white placeholder-slate-400 dark:placeholder-slate-400 focus:outline-none"
                          style={{ maxHeight: "100px" }}
                        />
                        <button
                          id="addCommentBtn"
                          type="button"
                          onClick={handleSendComment}
                          disabled={isSending || !commentText.trim()}
                          className="flex-shrink-0 w-8 h-8 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center transition-colors"
                        >
                          {isSending ? (
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                            </svg>
                          ) : (
                            <svg className="h-4 w-4 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                          )}
                        </button>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1.5 ml-1">Shift+Enter for new line</p>
                    </div>
                  </div>

                </div>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Transition>
    </>
  );
};

export default TaskDetails;
