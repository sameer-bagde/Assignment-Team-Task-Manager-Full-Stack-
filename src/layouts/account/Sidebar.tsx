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
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-transparent">
        <Link to="/account/dashboard" className="flex items-center gap-3">
          <span className="font-serif font-bold text-xl text-slate-800 dark:text-slate-100">Smarter Tasker</span>
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
