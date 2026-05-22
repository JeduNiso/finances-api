import { useEffect, useState } from 'react';
import { useSpendingStore } from '../stores/spendingStore';
import { useAccountsStore } from '../stores/accountsStore';
import { useCurrency }      from '../hooks/useCurrency';
import Modal         from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';

const MONTHS = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

export default function SpendingPage() {
  const { items, filters, isLoading, fetch, setFilters, create, update, remove } = useSpendingStore();
  const { accounts, fetch: fetchAccounts } = useAccountsStore();
  const { format } = useCurrency();

  const [modal,   setModal]   = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [form,    setForm]    = useState({ amount: '', description: '', spent_at: '', account_id: '', category_id: '' });
  const [saving,  setSaving]  = useState(false);

  useEffect(() => { fetch(); fetchAccounts(); }, []);

  const openCreate = () => { setEditing(null); setForm({ amount:'',description:'',spent_at:'',account_id:'',category_id:'' }); setModal(true); };
  const openEdit   = (s) => { setEditing(s); setForm({ amount: s.amount, description: s.description ?? '', spent_at: s.spent_at, account_id: s.account_id, category_id: s.category_id }); setModal(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      editing ? await update(editing.id, form) : await create(form);
      setModal(false);
      fetch();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    await remove(confirm.id);
    setConfirm(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Gastos</h1>
        <button onClick={openCreate} className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700">
          + Agregar
        </button>
      </div>

      {/* Filtros */}
      <div className="flex gap-3 flex-wrap">
        <select
          className="border rounded-lg px-3 py-1.5 text-sm"
          value={filters.month ?? ''}
          onChange={(e) => { setFilters({ month: e.target.value }); fetch(); }}
        >
          {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
        </select>
        <input
          type="number"
          className="border rounded-lg px-3 py-1.5 text-sm w-24"
          value={filters.year ?? new Date().getFullYear()}
          onChange={(e) => { setFilters({ year: e.target.value }); fetch(); }}
        />
      </div>

      {/* Tabla */}
      {isLoading ? <p className="text-sm text-gray-400">Cargando...</p> : (
        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-4 py-3 text-left">Fecha</th>
                <th className="px-4 py-3 text-left">Descripción</th>
                <th className="px-4 py-3 text-left">Categoría</th>
                <th className="px-4 py-3 text-right">Monto</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {items.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-600">{s.spent_at}</td>
                  <td className="px-4 py-3 text-gray-800">{s.description ?? '—'}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: s.category?.color + '22', color: s.category?.color }}>
                      {s.category?.name}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-gray-900">{format(s.amount)}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button onClick={() => openEdit(s)} className="text-indigo-500 hover:underline text-xs">Editar</button>
                    <button onClick={() => setConfirm(s)} className="text-red-400 hover:underline text-xs">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!items.length && <p className="text-center py-8 text-sm text-gray-400">Sin registros</p>}
        </div>
      )}

      {/* Modal form */}
      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Editar gasto' : 'Nuevo gasto'}>
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <input type="number" step="0.01" placeholder="Monto" required className="input" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
          <input type="text" placeholder="Descripción" className="input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <input type="date" required className="input" value={form.spent_at} onChange={(e) => setForm({ ...form, spent_at: e.target.value })} />
          <select required className="input" value={form.account_id} onChange={(e) => setForm({ ...form, account_id: e.target.value })}>
            <option value="">Seleccionar cuenta</option>
            {accounts.map((a) => <option key={a.id} value={a.id}>{a.account_number} — {a.bank?.name}</option>)}
          </select>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setModal(false)} className="text-sm px-4 py-2 border rounded-lg">Cancelar</button>
            <button type="submit" disabled={saving} className="text-sm px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-60">
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={handleDelete}
        title="Eliminar gasto"
        message="¿Deseas eliminar este gasto? Se revertirá el descuento en la cuenta."
      />
    </div>
  );
}
