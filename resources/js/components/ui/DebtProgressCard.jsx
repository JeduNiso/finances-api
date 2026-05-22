import { useCurrency } from '../../hooks/useCurrency';

export default function DebtProgressCard({ debt, onPay }) {
  const { format } = useCurrency();
  const pct = debt.progress_percentage ?? 0;

  return (
    <div className="bg-white rounded-xl border p-5 flex flex-col gap-3">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-semibold text-gray-800">{debt.creditor}</p>
          {debt.description && <p className="text-xs text-gray-500">{debt.description}</p>}
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
          debt.status === 'paid' ? 'bg-green-100 text-green-700' :
          debt.status === 'paused' ? 'bg-yellow-100 text-yellow-700' :
          'bg-red-100 text-red-700'
        }`}>{debt.status}</span>
      </div>

      <div>
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Saldo: {format(debt.current_balance)}</span>
          <span>{pct.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div
            className="bg-indigo-500 h-2 rounded-full transition-all"
            style={{ width: `${Math.min(pct, 100)}%` }}
          />
        </div>
      </div>

      {debt.due_date && (
        <p className="text-xs text-gray-400">Vence: {debt.due_date}</p>
      )}

      {debt.status !== 'paid' && (
        <button
          onClick={() => onPay(debt)}
          className="mt-1 text-sm bg-indigo-600 text-white rounded-lg py-1.5 hover:bg-indigo-700 transition"
        >
          Abonar
        </button>
      )}
    </div>
  );
}
