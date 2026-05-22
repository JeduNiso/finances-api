export default function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white rounded-xl border p-5 flex items-center gap-4">
      {icon && <span className="text-3xl">{icon}</span>}
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}
