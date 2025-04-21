export default function StatCard({ title, subtitle, value }) {
  return (
    <article className="bg-white shadow p-4 border border-gray-200 rounded-lg">
      <h3 className="mb-1 font-semibold text-gray-900 text-lg">{title}</h3>
      <p className="mb-4 text-gray-500 text-sm">{subtitle}</p>
      <p className="font-bold text-4xl">{value}</p>
    </article>
  );
} 