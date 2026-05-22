import { useCurrency } from '../../hooks/useCurrency';

export default function BalanceCard({ title, amount, subtitle, color = 'indigo' }) {
  const { format } = useCurrency();
  const colors = {
    indigo: 'bg-indigo-600',
    green:  'bg-green-600',
    red:    'bg-red-600',
    yellow: 'bg-yellow-500',
  };

  return (
    <div className={`rounded-xl p-5 text-white ${colors[color] ?? colors.indigo}`}>
      <p className="text-sm opacity-80">{title}</p>
      <p className="text-2xl font-bold mt-1">{format(amount)}</p>
      {subtitle && <p className="text-xs opacity-70 mt-1">{subtitle}</p>}
    </div>
  );
}
