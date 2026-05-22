import { useEffect, useState } from 'react';
import { useDebtsStore }   from '../stores/debtsStore';
import { useAccountsStore } from '../stores/accountsStore';
import { useCurrency }     from '../hooks/useCurrency';
import DebtProgressCard from '../components/ui/DebtProgressCard';
import Modal from '../components/ui/Modal';

export default function DebtsPage() {
  const { items, summary, isLoading, fetch, fetchSummary, addPayment } = useDebtsStore();
  const { accounts, fetch: fetchAccounts } = useAccountsStore();
  const { format } = useCurrency();

  const [payTarget, setPayTarget] = useState(null);
  const [payForm,   setPayForm]   = useState({ amount: '', paid_at: '', account_id: '', notes: '' });
  const [saving,    setSaving]    = useState(false);

  useEffect(() => { fetch(); fetchSummary(); fetchAccounts(); }, []);

  const handlePayment = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await addPayment(payTarget.id, payForm);
      setPayTarget(null);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-gray-800">Deudas</h1>

      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-red-50 border border-red-100 rounded-xl p-5">
            <p className="text-xs text-red-400">Total adeudado</p>
            <p className="text-2xl font-bold text-red-700">{format(summary.total_owed)}</p>
          </div>
          <div className="bg-green-50 border border-green-100 rounded-xl p-5">
            <p className="text-xs text-green-400">Pagado este mes</p>
            <p className="text-2xl font-bold text-green-700">{format(summary.paid_this_month)}</p>
          </div>
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5">
            <p className="text-xs text-indigo-400">Proyección mensual</p>
            <p className="text-2xl font-bold text-indigo-700">{format(summary.monthly_projection)}</p>
          </div>
        </div>
      )}

      {isLoading ? <p className="text-sm text-gray-400">Cargando...</p> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((d) => (
            <DebtProgressCard key={d.id} debt={d} onPay={(d) => {
              setPayTarget(d);
              setPayForm({ amount: d.monthly_payment ?? '', paid_at: new Date().toISOString().slice(0,10), account_id: '', notes: '' });
            }} />
          ))}
        </div>
      )}

      <Modal open={!!payTarget} onClose={() => setPayTarget(null)} title={`Abonar a: ${payTarget?.creditor}`}>
        <form onSubmit={handlePayment} className="flex flex-col gap-4">
          <input type="number" step="0.01" placeholder="Monto" required className="border rounded-lg px-4 py-2 text-sm" value={payForm.amount} onChange={(e) => setPayForm({ ...payForm, amount: e.target.value })} />
          <input type="date" required className="border rounded-lg px-4 py-2 text-sm" value={payForm.paid_at} onChange={(e) => setPayForm({ ...payForm, paid_at: e.target.value })} />
          <select required className="border rounded-lg px-4 py-2 text-sm" value={payForm.account_id} onChange={(e) => setPayForm({ ...payForm, account_id: e.target.value })}>
            <option value="">Seleccionar cuenta</option>
            {accounts.map((a) => <option key={a.id} value={a.id}>{a.account_number}</option>)}
          </select>
          <input type="text" placeholder="Notas" className="border rounded-lg px-4 py-2 text-sm" value={payForm.notes} onChange={(e) => setPayForm({ ...payForm, notes: e.target.value })} />
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setPayTarget(null)} className="text-sm px-4 py-2 border rounded-lg">Cancelar</button>
            <button type="submit" disabled={saving} className="text-sm px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-60">
              {saving ? 'Guardando...' : 'Confirmar abono'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
