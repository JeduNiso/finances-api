import { useEffect, useState } from 'react';
import { useExpensesStore } from '../stores/expensesStore';
import { useAccountsStore } from '../stores/accountsStore';
import { useCurrency }      from '../hooks/useCurrency';
import Modal  from '../components/ui/Modal';

export default function ExpensesPage() {
  const { calendar, isLoading, fetchCalendar, pay } = useExpensesStore();
  const { accounts, fetch: fetchAccounts } = useAccountsStore();
  const { format } = useCurrency();

  const [payModal, setPayModal] = useState(null);
  const [payForm,  setPayForm]  = useState({ amount_paid: '', paid_at: '', account_id: '', notes: '' });
  const [saving,   setSaving]   = useState(false);

  useEffect(() => { fetchCalendar(); fetchAccounts(); }, []);

  const handlePay = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await pay(payModal.id, payForm);
      setPayModal(null);
    } finally {
      setSaving(false);
    }
  };

  const paid    = calendar.filter((e) => e.paid);
  const pending = calendar.filter((e) => !e.paid);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-gray-800">Gastos Fijos</h1>

      {isLoading ? <p className="text-sm text-gray-400">Cargando...</p> : (
        <>
          {pending.length > 0 && (
            <section>
              <h2 className="font-semibold text-yellow-600 mb-3">⏳ Pendientes ({pending.length})</h2>
              <ul className="space-y-2">
                {pending.map((e) => (
                  <li key={e.id} className="bg-white border rounded-xl px-5 py-4 flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-800">{e.name}</p>
                      <p className="text-xs text-gray-400">Día {e.day_of_month} · {e.frequency}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-gray-900">{format(e.amount)}</span>
                      <button
                        onClick={() => { setPayModal(e); setPayForm({ amount_paid: e.amount, paid_at: new Date().toISOString().slice(0,10), account_id: '', notes: '' }); }}
                        className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700"
                      >
                        Pagar
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {paid.length > 0 && (
            <section>
              <h2 className="font-semibold text-green-600 mb-3">✅ Pagados ({paid.length})</h2>
              <ul className="space-y-2">
                {paid.map((e) => (
                  <li key={e.id} className="bg-gray-50 border rounded-xl px-5 py-4 flex justify-between items-center opacity-70">
                    <div>
                      <p className="font-medium text-gray-700">{e.name}</p>
                      <p className="text-xs text-gray-400">Día {e.day_of_month} · {e.frequency}</p>
                    </div>
                    <span className="font-semibold text-gray-600">{format(e.amount)}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}

      <Modal open={!!payModal} onClose={() => setPayModal(null)} title={`Pagar: ${payModal?.name}`}>
        <form onSubmit={handlePay} className="flex flex-col gap-4">
          <input type="number" step="0.01" placeholder="Monto pagado" required className="border rounded-lg px-4 py-2 text-sm" value={payForm.amount_paid} onChange={(e) => setPayForm({ ...payForm, amount_paid: e.target.value })} />
          <input type="date" required className="border rounded-lg px-4 py-2 text-sm" value={payForm.paid_at} onChange={(e) => setPayForm({ ...payForm, paid_at: e.target.value })} />
          <select required className="border rounded-lg px-4 py-2 text-sm" value={payForm.account_id} onChange={(e) => setPayForm({ ...payForm, account_id: e.target.value })}>
            <option value="">Seleccionar cuenta</option>
            {accounts.map((a) => <option key={a.id} value={a.id}>{a.account_number}</option>)}
          </select>
          <input type="text" placeholder="Notas (opcional)" className="border rounded-lg px-4 py-2 text-sm" value={payForm.notes} onChange={(e) => setPayForm({ ...payForm, notes: e.target.value })} />
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setPayModal(null)} className="text-sm px-4 py-2 border rounded-lg">Cancelar</button>
            <button type="submit" disabled={saving} className="text-sm px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-60">
              {saving ? 'Guardando...' : 'Confirmar pago'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
