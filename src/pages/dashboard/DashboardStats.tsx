import { DashboardStats } from "../../types";

interface StatCardProps {
  label: string;
  value: number;
  color: "indigo" | "emerald" | "amber" | "rose" | "violet";
  icon: string;
}

const iconBgMap: Record<StatCardProps["color"], string> = {
  indigo: "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400",
  emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
  amber: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
  rose: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400",
  violet: "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400",
};

const StatCard: React.FC<StatCardProps> = ({ label, value, color, icon }) => (
  <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700/60 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-4 group">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${iconBgMap[color]} transition-transform duration-300 group-hover:scale-110`}>
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
      <p className="text-2xl font-bold text-slate-900 dark:text-slate-50 mt-0.5">
        {value}
      </p>
    </div>
  </div>
);

interface DashboardStatsProps {
  stats: DashboardStats;
}

const DashboardStatsGrid: React.FC<DashboardStatsProps> = ({ stats }) => {
  const cards: StatCardProps[] = [
    { label: "Total Tasks",       value: stats.total,      color: "indigo",  icon: "📋" },
    { label: "Completed",         value: stats.completed,  color: "emerald", icon: "✅" },
    { label: "In Progress",       value: stats.inProgress, color: "violet",  icon: "⚡" },
    { label: "Pending",           value: stats.pending,    color: "amber",   icon: "🕐" },
    { label: "Overdue",           value: stats.overdue,    color: "rose",    icon: "🚨" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {cards.map((card) => (
        <StatCard key={card.label} {...card} />
      ))}
    </div>
  );
};

export default DashboardStatsGrid;
