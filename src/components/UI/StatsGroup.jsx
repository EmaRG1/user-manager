export default function StatsGroup({ children, columns }) {
  const columnsMap = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
  };

  const colClass = columnsMap[columns] || "md:grid-cols-1";
  return (
    <div className={`gap-4 grid grid-cols-1 ${colClass} mb-8`}>
      {children}
    </div>
  );
} 