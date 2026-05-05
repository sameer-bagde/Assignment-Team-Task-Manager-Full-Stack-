import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { addProject } from "../../context/projects/actions";
import { useProjectsDispatch } from "../../context/projects/context";
import { useIsAdmin } from "../../context/auth/context";

type Inputs = { name: string; description: string };

const NewProject = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError]   = useState<string | null>(null);
  const isAdmin             = useIsAdmin();
  const dispatchProjects    = useProjectsDispatch();

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm<Inputs>();

  const closeModal = () => { setIsOpen(false); setError(null); reset(); };
  const openModal  = () => setIsOpen(true);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setError(null);
    const response = await addProject(dispatchProjects, {
      name: data.name,
      description: data.description,
    });
    if (response.ok) closeModal();
    else setError((response.error as string) ?? "Failed to create project.");
  };

  if (!isAdmin) return null; // Only ADMIN sees this button

  return (
    <>
      <button
        type="button"
        id="newProjectBtn"
        onClick={openModal}
        className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        New Project
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => {}}>
          <Transition.Child as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-150" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-2xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-bold text-slate-800 dark:text-slate-100">
                    Create New Project
                  </Dialog.Title>

                  <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
                    {error && (
                      <div className="rounded-lg bg-rose-50 border border-rose-200 px-3 py-2 text-sm text-rose-700">
                        {error}
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Project Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="project-name"
                        placeholder="e.g. Website Redesign"
                        autoFocus
                        {...register("name", { required: "Project name is required" })}
                        className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                      />
                      {errors.name && (
                        <p className="mt-1 text-xs text-rose-500">{errors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Description
                      </label>
                      <textarea
                        id="project-description"
                        placeholder="What is this project about?"
                        rows={3}
                        {...register("description")}
                        className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition resize-none"
                      />
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        type="submit"
                        id="submitNewProjectBtn"
                        disabled={isSubmitting}
                        className="flex-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold py-2 text-sm transition-colors"
                      >
                        {isSubmitting ? "Creating…" : "Create Project"}
                      </button>
                      <button
                        type="button"
                        onClick={closeModal}
                        className="flex-1 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 font-medium py-2 text-sm transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default NewProject;
