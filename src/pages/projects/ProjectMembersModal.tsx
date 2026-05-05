import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { useMembersState } from "../../context/members/context";
import { API_ENDPOINT } from "../../config/constants";

interface ProjectMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: any;
  onUpdate: () => void;
}

export default function ProjectMembersModal({ isOpen, onClose, project, onUpdate }: ProjectMembersModalProps) {
  const memberState = useMembersState();
  const allUsers = memberState?.members || [];
  
  // Local state for current members of this project
  const [projectMembers, setProjectMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && project?.id) {
      fetchProjectMembers();
    }
  }, [isOpen, project]);

  const fetchProjectMembers = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("authToken") ?? "";
      const res = await fetch(`${API_ENDPOINT}/projects/${project.id}/members`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProjectMembers(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const isMemberAssigned = (userId: number) => {
    return projectMembers.some(m => m.id === userId);
  };

  const toggleMember = async (userId: number, isAssigned: boolean) => {
    const token = localStorage.getItem("authToken") ?? "";
    try {
      if (isAssigned) {
        // Remove
        await fetch(`${API_ENDPOINT}/projects/${project.id}/members/${userId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        // Add
        await fetch(`${API_ENDPOINT}/projects/${project.id}/members`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}` 
          },
          body: JSON.stringify({ userId })
        });
      }
      // Refresh list
      await fetchProjectMembers();
      onUpdate(); // refresh parent projects list
    } catch (e) {
      console.error(e);
    }
  };

  if (!project) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-slate-800 p-6 text-left align-middle shadow-xl transition-all border border-slate-100 dark:border-slate-700">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-semibold leading-6 text-slate-900 dark:text-slate-100 mb-4"
                >
                  Manage Members: {project.name}
                </Dialog.Title>
                
                {isLoading ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin h-6 w-6 rounded-full border-2 border-indigo-200 border-t-indigo-600" />
                  </div>
                ) : (
                  <div className="mt-2 max-h-60 overflow-y-auto pr-2 space-y-2">
                    {allUsers.filter((u: any) => u.role !== "ADMIN").map((user) => {
                      const assigned = isMemberAssigned(user.id);
                      return (
                        <div key={user.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                          <div>
                            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{user.name}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                          </div>
                          <button
                            onClick={() => toggleMember(user.id, assigned)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                              assigned 
                                ? "bg-rose-100 text-rose-700 hover:bg-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:hover:bg-rose-900/50" 
                                : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50"
                            }`}
                          >
                            {assigned ? "Remove" : "Assign"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-lg border border-transparent bg-slate-100 dark:bg-slate-700 px-4 py-2 text-sm font-medium text-slate-900 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                    onClick={onClose}
                  >
                    Done
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
