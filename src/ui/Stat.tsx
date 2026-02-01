interface StatProps {
  value: string;
  label: string;
  className?: string;
}

export function Stat({ value, label, className = "" }: StatProps) {
  return (
    <div className={`text-center ${className}`.trim()}>
      <p className="stat-value">{value}</p>
      <p className="stat-label">{label}</p>
    </div>
  );
}

interface StatGridProps {
  stats: { value: string; label: string }[];
  className?: string;
  columns?: 2 | 3 | 4;
}

export function StatGrid({ stats, className = "", columns = 4 }: StatGridProps) {
  const gridCols = {
    2: "grid-cols-2",
    3: "grid-cols-2 md:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-4",
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-8 ${className}`.trim()}>
      {stats.map((stat, index) => (
        <Stat key={index} value={stat.value} label={stat.label} />
      ))}
    </div>
  );
}
