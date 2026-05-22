import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function SpendingDonut({ data = [] }) {
  if (!data.length) return <p className="text-sm text-gray-400 text-center py-8">Sin datos</p>;

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          dataKey="total"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={3}
        >
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color ?? `hsl(${i * 45},70%,55%)`} />
          ))}
        </Pie>
        <Tooltip formatter={(v) => `$${Number(v).toLocaleString()}`} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
