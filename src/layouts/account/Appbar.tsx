import { useContext, Fragment } from "react";
import { Disclosure, Menu, Transition, Switch } from "@headlessui/react";
import {
  UserCircleIcon,
  ChartBarIcon,
  FolderIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import Logo from "../../assets/images/logo.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ThemeContext } from "../../context/theme";
import { useAuth } from "../../context/auth/context";
import { logoutAction } from "../../context/auth/actions";

const classNames = (...classes: string[]): string =>
  classes.filter(Boolean).join(" ");

const Appbar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme } = useContext(ThemeContext);
  const { user, isAdmin, dispatch } = useAuth();
  
  const enabled = theme === "dark";

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleLogout = () => {
    logoutAction(dispatch);
    navigate("/signin");
  };

  const navigation = [
    { name: "Dashboard", href: "/account/dashboard", icon: ChartBarIcon },
    { name: "Projects",  href: "/account/projects",  icon: FolderIcon },
    { name: "Members",   href: "/account/members",   icon: UsersIcon },
  ];

  return (
    <>
      <Disclosure
        as="nav"
        className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm"
      >
        {({}) => (
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              {/* Logo + Nav */}
              <div className="flex items-center gap-8">
                <img className="h-8" src={Logo} alt="Team Task Manager" />

                <div className="hidden md:flex items-baseline space-x-1">
                  {navigation.map((item) => {
                    const isCurrent = pathname.includes(item.href);
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={classNames(
                          isCurrent
                            ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
                            : "text-slate-500 hover:text-indigo-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800",
                          "flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150"
                        )}
                        aria-current={isCurrent ? "page" : undefined}
                      >
                        <item.icon className="h-4 w-4" />
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Right side */}
              <div className="flex items-center gap-3">
                {/* Role badge */}
                {user && (
                  <span
                    className={classNames(
                      isAdmin
                        ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                        : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
                      "hidden md:inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
                    )}
                  >
                    {user.role}
                  </span>
                )}

                {/* Dark mode toggle */}
                <Switch
                  checked={enabled}
                  onChange={toggleTheme}
                  className={`${
                    enabled ? "bg-indigo-600" : "bg-slate-200"
                  } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                >
                  <span className="sr-only">Toggle dark mode</span>
                  <span
                    className={`${
                      enabled ? "translate-x-6" : "translate-x-1"
                    } inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform`}
                  />
                </Switch>

                {/* User menu */}
                <Menu as="div" className="relative">
                  <Menu.Button className="flex items-center gap-2 rounded-full bg-white dark:bg-slate-800 p-1 text-slate-400 hover:text-indigo-600 transition-colors">
                    <UserCircleIcon className="h-7 w-7" aria-hidden="true" />
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
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-52 origin-top-right rounded-xl bg-white dark:bg-slate-800 py-1 shadow-lg ring-1 ring-black/10 focus:outline-none">
                      {user && (
                        <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
                          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                            {user.name}
                          </p>
                          <p className="text-xs text-slate-400 truncate">{user.email}</p>
                        </div>
                      )}
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            id="logout-btn"
                            onClick={handleLogout}
                            className={classNames(
                              active ? "bg-slate-50 dark:bg-slate-700" : "",
                              "w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400"
                            )}
                          >
                            Sign out
                          </button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>
        )}
      </Disclosure>
    </>
  );
};

export default Appbar;
