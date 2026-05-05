import { useContext, Fragment } from "react";
import { Menu, Transition, Switch } from "@headlessui/react";
import { UserCircleIcon, ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import { ThemeContext } from "../../context/theme";
import { useAuth } from "../../context/auth/context";
import { logoutAction } from "../../context/auth/actions";
import { useNavigate } from "react-router-dom";

const classNames = (...classes: string[]) => classes.filter(Boolean).join(" ");

export default function Header() {
  const { theme, setTheme } = useContext(ThemeContext);
  const { user, isAdmin, dispatch } = useAuth();
  const navigate = useNavigate();

  const enabled = theme === "dark";

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleLogout = () => {
    logoutAction(dispatch);
    navigate("/signin");
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 flex-shrink-0 items-center gap-x-4 border-b border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8 transition-colors">
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 justify-end items-center">
        {/* Role badge */}
        {user && (
          <span
            className={classNames(
              isAdmin
                ? "bg-purple-50 text-purple-700 ring-1 ring-purple-600/10 dark:bg-purple-500/10 dark:text-purple-300 dark:ring-purple-500/20"
                : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/10 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/20",
              "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium"
            )}
          >
            {user.role}
          </span>
        )}

        {/* Dark mode toggle */}
        <div className="flex items-center">
          <Switch
            checked={enabled}
            onChange={toggleTheme}
            className={classNames(
              enabled ? "bg-indigo-500" : "bg-slate-200",
              "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
            )}
          >
            <span className="sr-only">Toggle dark mode</span>
            <span
              className={classNames(
                enabled ? "translate-x-5" : "translate-x-0",
                "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
              )}
            />
          </Switch>
        </div>

        {/* Separator */}
        <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-slate-200 dark:lg:bg-slate-700" aria-hidden="true" />

        {/* User menu */}
        <Menu as="div" className="relative">
          <Menu.Button className="-m-1.5 flex items-center p-1.5 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <span className="sr-only">Open user menu</span>
            <UserCircleIcon className="h-8 w-8 text-slate-400 dark:text-slate-500" aria-hidden="true" />
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 z-10 mt-2.5 w-64 origin-top-right rounded-2xl bg-white dark:bg-slate-800 py-2 shadow-lg ring-1 ring-slate-900/5 focus:outline-none border border-slate-100 dark:border-slate-700">
              {user && (
                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700/50">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {user.email}
                  </p>
                </div>
              )}
              <div className="p-1">
                <Menu.Item>
                  {({ active }) => (
                      <button
                      onClick={handleLogout}
                      className={classNames(
                        active ? "bg-slate-50 dark:bg-slate-700/50" : "",
                        "flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm text-rose-600 dark:text-rose-400 font-medium transition-colors"
                      )}
                    >
                      <ArrowRightOnRectangleIcon className="h-4 w-4" />
                      Sign out
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </header>
  );
}
