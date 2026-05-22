import { useEffect } from 'react';
import { useDashboardStore } from '../stores/dashboardStore';
import { useCurrency }       from '../hooks/useCurrency';
import BalanceCard    from '../components/ui/BalanceCard';
import StatCard       from '../components/ui/StatCard';
import SpendingDonut  from '../components/charts/SpendingDonut';
import DebtProgressCard from '../components/ui/DebtProgressCard';

export default function DashboardPage() {
  const { data, isLoading, fetch } = useDashboardStore();
  const { format } = useCurrency();

  useEffect(() => { fetch(); }, []);

  if (isLoading) return <p className="text-sm text-gray-400">Cargando...</p>;
  if (!data)     return null;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>

      {/* Balance + stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <BalanceCard title="Balance total" amount={data.total_balance} color="indigo" />
        <StatCard title="Fijos pagados"   value={data.expenses?.paid}    icon="✅" />
        <StatCard title="Fijos pendientes" value={data.expenses?.pending} icon="⏳" />
        <StatCard title="Deudas activas"  value={data.active_debts?.length} icon="💳" />
      </div>

      {/* Gráfico por categoría */}
      <div className="bg-white rounded-xl border p-5">
        <h2 className="font-semibold text-gray-700 mb-4">Gastos del mes por categoría</h2>
        <SpendingDonut data={data.spending_by_category} />
      </div>

      {/* Deudas activas */}
      {data.active_debts?.length > 0 && (
        <div>
          <h2 className="font-semibold text-gray-700 mb-3">Deudas activas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.active_debts.map((d) => (
              <DebtProgressCard key={d.id} debt={d} onPay={() => {}} />
            ))}
          </div>
        </div>
      )}

      {/* Top 5 gastos */}
      {data.top5_spending?.length > 0 && (
        <div className="bg-white rounded-xl border p-5">
          <h2 className="font-semibold text-gray-700 mb-3">Top 5 gastos del mes</h2>
          <ul className="divide-y">
            {data.top5_spending.map((s) => (
              <li key={s.id} className="flex justify-between py-2 text-sm">
                <span className="text-gray-700">{s.description ?? s.category?.name}</span>
                <span className="font-medium text-gray-900">{format(s.amount)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Gastos por miembro */}
      {data.spending_by_member?.length > 0 && (
        <div className="bg-white rounded-xl border p-5">
          <h2 className="font-semibold text-gray-700 mb-3">Gastos por miembro</h2>
          <ul className="divide-y">
            {data.spending_by_member.map((m) => (
              <li key={m.id} className="flex justify-between py-2 text-sm">
                <span className="text-gray-700">{m.name}</span>
                <span className="font-medium">{format(m.total)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
