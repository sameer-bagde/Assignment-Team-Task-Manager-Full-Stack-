import { DashboardStats } from "../../types";

interface StatCardProps {
  label: string;
  value: number;
  color: "indigo" | "emerald" | "amber" | "rose" | "violet";
  icon: string;
  description?: string;
}

const colorMap: Record<StatCardProps["color"], string> = {
  indigo: "from-indigo-500 to-indigo-600",
  emerald: "from-emerald-500 to-emerald-600",
  amber: "from-amber-500 to-amber-600",
  rose: "from-rose-500 to-rose-600",
  violet: "from-violet-500 to-violet-600",
};

const bgMap: Record<StatCardProps["color"], string> = {
  indigo: "bg-indigo-50 dark:bg-indigo-900/20",
  emerald: "bg-emerald-50 dark:bg-emerald-900/20",
  amber: "bg-amber-50 dark:bg-amber-900/20",
  rose: "bg-rose-50 dark:bg-rose-900/20",
  violet: "bg-violet-50 dark:bg-violet-900/20",
};

const StatCard: React.FC<StatCardProps> = ({ label, value, color, icon, description }) => (
  <div className={`relative overflow-hidden rounded-2xl p-6 ${bgMap[color]} border border-white/60 dark:border-white/10 shadow-sm hover:shadow-md transition-all duration-200 group`}>
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
        <p className={`mt-2 text-4xl font-bold bg-gradient-to-br ${colorMap[color]} bg-clip-text text-transparent`}>
          {value}
        </p>
        {description && (
          <p className="mt-1 text-xs text-slate-400">{description}</p>
        )}
      </div>
      <div className={`text-3xl select-none group-hover:scale-110 transition-transform duration-200`}>
        {icon}
      </div>
    </div>
    {/* Bottom accent bar */}
    <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${colorMap[color]}`} />
  </div>
);

interface DashboardStatsProps {
  stats: DashboardStats;
}

const DashboardStatsGrid: React.FC<DashboardStatsProps> = ({ stats }) => {
  const cards: StatCardProps[] = [
    { label: "Total Tasks",       value: stats.total,      color: "indigo",  icon: "📋", description: "All tasks across projects" },
    { label: "Completed",         value: stats.completed,  color: "emerald", icon: "✅", description: "Tasks marked as done" },
    { label: "In Progress",       value: stats.inProgress, color: "violet",  icon: "⚡", description: "Currently being worked on" },
    { label: "Pending",           value: stats.pending,    color: "amber",   icon: "🕐", description: "Not yet started" },
    { label: "Overdue",           value: stats.overdue,    color: "rose",    icon: "🚨", description: "Past due date, not done" },
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
