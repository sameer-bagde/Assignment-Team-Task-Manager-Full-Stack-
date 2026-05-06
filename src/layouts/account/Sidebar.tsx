import { Link, useLocation } from "react-router-dom";
import { ChartBarIcon, FolderIcon, UsersIcon } from "@heroicons/react/24/outline";

const classNames = (...classes: string[]) => classes.filter(Boolean).join(" ");

const navigation = [
  { name: "Dashboard", href: "/account/dashboard", icon: ChartBarIcon },
  { name: "Projects",  href: "/account/projects",  icon: FolderIcon },
  { name: "Members",   href: "/account/members",   icon: UsersIcon },
];

export default function Sidebar() {
  const { pathname } = useLocation();

  return (
    <div className="hidden md:flex md:w-64 md:flex-col border-r border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 transition-colors">
      <div className="flex h-20 shrink-0 items-center px-6">
        <Link to="/account/dashboard" className="flex items-center gap-3 group transition-all">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 dark:shadow-none group-hover:scale-105 transition-transform duration-200">
            <span className="text-white font-bold text-[10px] tracking-widest">TTM</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-base font-bold leading-tight text-slate-800 dark:text-white tracking-tight">
              Team Task
            </h1>
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400 -mt-0.5">
              Manager
            </p>
          </div>
        </Link>
      </div>
      <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4 px-4 space-y-1">
        {navigation.map((item) => {
          const isCurrent = pathname.includes(item.href);
          return (
            <Link
              key={item.name}
              to={item.href}
              className={classNames(
                isCurrent
                  ? "bg-indigo-50/80 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-200",
                "group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200"
              )}
            >
              <item.icon
                className={classNames(
                  isCurrent ? "text-indigo-700 dark:text-indigo-300" : "text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300",
                  "mr-3 flex-shrink-0 h-5 w-5 transition-colors"
                )}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
