import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

// First I'll import the addProject function
import { addMembers, fetchMembers } from "../../context/members/actions";

// Then I'll import the useProjectsDispatch hook from projects context
import { useMembersDispatch } from "../../context/members/context";
type Inputs = {
  name: string;
  email: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  password: any;
};
const NewMember = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Next, I'll add a new state to handle errors.
  const [error, setError] = useState(null);

  const dispatchMembers = useMembersDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const closeModal = () => {
    setIsOpen(false);
    setError(null);
  };
  const openModal = () => {
    setIsOpen(true);
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const { name, email, password } = data;

    const response = await addMembers(dispatchMembers, {
      name,
      email,
      password,
    });

    if (response.ok) {
      setError(null);
      await fetchMembers(dispatchMembers);
      closeModal();
    } else {
      setError(response.error as React.SetStateAction<null>);
    }
  };
  return (
    <>
      <button
        type="button"
        id="new-member-btn"
        onClick={openModal}
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
      >
        Add User
      </button>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-slate-800 p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 dark:text-white"
                  >
                    Add new User
                  </Dialog.Title>
                  <div className="mt-2">
                    <form onSubmit={handleSubmit(onSubmit)}>
                      {error && (
                        <div className="mb-4 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-400">
                          {error}
                        </div>
                      )}
                      <input
                        type="text"
                        id="name"
                        placeholder="Enter usere name..."
                        autoFocus
                        {...register("name", { required: true })}
                        className={`w-full border dark:border-slate-600 rounded-md py-2 px-3 my-4 bg-white dark:bg-slate-700 text-gray-700 dark:text-white leading-tight focus:outline-none focus:border-blue-500 focus:shadow-outline-blue ${
                          errors.name ? "border-red-500" : ""
                        }`}
                      />
                      <input
                        type="email"
                        id="email"
                        placeholder="Enter email ID..."
                        autoFocus
                        {...register("email", { required: true })}
                        className={`w-full border dark:border-slate-600 rounded-md py-2 px-3 my-4 bg-white dark:bg-slate-700 text-gray-700 dark:text-white leading-tight focus:outline-none focus:border-blue-500 focus:shadow-outline-blue ${
                          errors.email ? "border-red-500" : ""
                        }`}
                      />
                      <input
                        type="password"
                        id="password"
                        placeholder="Enter Password..."
                        autoFocus
                        {...register("password", { required: true })}
                        className={`w-full border dark:border-slate-600 rounded-md py-2 px-3 my-4 bg-white dark:bg-slate-700 text-gray-700 dark:text-white leading-tight focus:outline-none focus:border-blue-500 focus:shadow-outline-blue ${
                          errors.password ? "border-red-500" : ""
                        }`}
                      />
                      {errors.name && <span className="text-red-500 text-xs">Name is required</span>}
                      <br />
                      {errors.email && <span className="text-red-500 text-xs">Email is required</span>}
                      <br />
                      {errors.password && <span className="text-red-500 text-xs">Password is required</span>}

                      <br />
                      <button
                        type="submit"
                        id="create-member-btn"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 mr-2 text-sm font-medium text-white hover:bg-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      >
                        Submit
                      </button>
                      <button
                        type="button"
                        onClick={closeModal}
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 dark:bg-slate-700 px-4 py-2 text-sm font-medium text-blue-900 dark:text-white hover:bg-blue-200 dark:hover:bg-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      >
                        Cancel
                      </button>
                    </form>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
export default NewMember;
