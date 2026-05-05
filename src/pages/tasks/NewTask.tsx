import { Transition, Listbox } from "@headlessui/react";
import { Fragment, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { useProjectsState } from "../../context/projects/context";
import { useTasksDispatch } from "../../context/task/context";
import { addTask } from "../../context/task/actions";
import { TaskDetailsPayload } from "../../context/task/types";

const NewTask = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedPersons, setSelectedPersons] = useState<number[]>([]);

  const { projectID } = useParams();
  const navigate = useNavigate();

  const { register, handleSubmit } = useForm<TaskDetailsPayload>();
  const projectState = useProjectsState();
  const taskDispatch = useTasksDispatch();


  const selectedProject = projectState?.projects.filter(
    (project) => `${project.id}` === projectID,
  )?.[0];
  if (!selectedProject) {
    return <>No such Project!</>;
  }
  function closeModal() {
    setIsOpen(false);
    navigate("../../");
  }
  const onSubmit: SubmitHandler<TaskDetailsPayload> = async (data) => {
    try {
      const assignees = selectedPersons;
      
      const payload = {
        ...data,
        assignees
      };

      await addTask(taskDispatch, projectID ?? "", payload as TaskDetailsPayload);
      closeModal();
    } catch (error) {
      console.error("Operation failed:", error);
    }
  };
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <div className="relative z-50">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
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
                <div className="w-full max-w-md transform rounded-2xl bg-white dark:bg-slate-800 p-6 text-left align-middle shadow-xl">
                  <h3
                    className="text-lg font-medium leading-6 text-gray-900 dark:text-white"
                  >
                    Create new Task
                  </h3>
                  <div className="mt-2">
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <input
                        type="text"
                        required
                        placeholder="Enter title"
                        autoFocus
                        id="title"
                        // Register the title field
                        {...register("title", { required: true })}
                        className="w-full border dark:border-slate-600 rounded-md py-2 px-3 my-4 bg-white dark:bg-slate-700 text-gray-700 dark:text-white leading-tight focus:outline-none focus:border-blue-500 focus:shadow-outline-blue"
                      />
                      <input
                        type="text"
                        required
                        placeholder="Enter description"
                        autoFocus
                        id="description"
                        // register the description field
                        {...register("description", { required: true })}
                        className="w-full border dark:border-slate-600 rounded-md py-2 px-3 my-4 bg-white dark:bg-slate-700 text-gray-700 dark:text-white leading-tight focus:outline-none focus:border-blue-500 focus:shadow-outline-blue"
                      />
                      <input
                        type="date"
                        required
                        placeholder="Enter due date"
                        autoFocus
                        id="dueDate"
                        // register due date field
                        {...register("dueDate", { required: true })}
                        className="w-full border dark:border-slate-600 rounded-md py-2 px-3 my-4 bg-white dark:bg-slate-700 text-gray-700 dark:text-white leading-tight focus:outline-none focus:border-blue-500 focus:shadow-outline-blue"
                      />
                      <div className="mt-4 mb-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 text-left mb-1">Assignees</label>
                        <Listbox
                          value={selectedPersons}
                          onChange={setSelectedPersons}
                          multiple
                        >
                          <div className="relative">
                            <Listbox.Button className="w-full border dark:border-slate-600 rounded-md py-2 px-3 bg-white dark:bg-slate-700 text-gray-700 dark:text-white text-base text-left focus:outline-none focus:border-blue-500">
                              {selectedPersons.length > 0 
                                ? selectedProject?.members?.filter((m: any) => m.role !== "ADMIN" && selectedPersons.includes(m.id)).map((m: any) => m.name).join(", ") 
                                : "Unassigned"}
                            </Listbox.Button>
                            <Listbox.Options className="absolute z-[9999] bottom-full mb-1 max-h-48 w-full overflow-auto rounded-md bg-white dark:bg-slate-700 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                              {(selectedProject?.members?.filter((m: any) => m.role !== 'ADMIN') ?? []).length === 0 && (
                                <li className="py-2 px-4 text-gray-400 text-sm">No members assigned to this project yet</li>
                              )}
                              {selectedProject?.members?.filter((m: any) => m.role !== 'ADMIN').map((person: any) => (
                                <Listbox.Option
                                  key={person.id}
                                  className={({ active }) =>
                                    `relative cursor-default select-none py-2 pl-8 pr-4 ${
                                      active ? "bg-blue-100 dark:bg-slate-600 text-blue-900 dark:text-blue-100" : "text-gray-900 dark:text-white"
                                    }`
                                  }
                                  value={person.id}
                                >
                                  {({ selected }) => (
                                    <>
                                      <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>
                                        {person.name}
                                      </span>
                                      {selected && (
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-blue-600">
                                          ✓
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

                      <div className="mt-6 flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={closeModal}
                          className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 dark:bg-slate-700 px-4 py-2 text-sm font-medium text-blue-900 dark:text-white hover:bg-blue-200 dark:hover:bg-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          id="newTaskSubmitBtn"
                          className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        >
                          Submit
                        </button>
                      </div>
                    </form>
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
export default NewTask;
