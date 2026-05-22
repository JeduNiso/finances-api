import { useEffect, useState } from 'react';
import { useAccountsStore } from '../stores/accountsStore';
import { useCurrency }      from '../hooks/useCurrency';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { getBanks } from '../api/banks';

export default function AccountsPage() {
  const { accounts, isLoading, fetch, create, update, remove } = useAccountsStore();
  const { format } = useCurrency();

  const [banks,   setBanks]   = useState([]);
  const [modal,   setModal]   = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [form,    setForm]    = useState({ account_number: '', balance: '', bank_id: '' });
  const [saving,  setSaving]  = useState(false);

  useEffect(() => {
    fetch();
    getBanks().then(({ data }) => setBanks(data.data ?? data));
  }, []);

  const openCreate = () => { setEditing(null); setForm({ account_number: '', balance: '', bank_id: '' }); setModal(true); };
  const openEdit   = (a) => { setEditing(a); setForm({ account_number: a.account_number, balance: a.balance, bank_id: a.bank?.id ?? '' }); setModal(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      editing ? await update(editing.id, form) : await create(form);
      setModal(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Cuentas</h1>
        <button onClick={openCreate} className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700">+ Nueva cuenta</button>
      </div>

      {isLoading ? <p className="text-sm text-gray-400">Cargando...</p> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map((a) => (
            <div key={a.id} className="bg-white border rounded-xl p-5 space-y-2">
              <p className="text-xs text-gray-400">{a.bank?.name}</p>
              <p className="font-mono text-sm text-gray-700">{a.account_number}</p>
              <p className="text-2xl font-bold text-indigo-700">{format(a.balance)}</p>
              <div className="flex gap-3 pt-2">
                <button onClick={() => openEdit(a)} className="text-xs text-indigo-500 hover:underline">Editar</button>
                <button onClick={() => setConfirm(a)} className="text-xs text-red-400 hover:underline">Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Editar cuenta' : 'Nueva cuenta'}>
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <input type="text" placeholder="Número de cuenta" required className="border rounded-lg px-4 py-2 text-sm" value={form.account_number} onChange={(e) => setForm({ ...form, account_number: e.target.value })} />
          <input type="number" step="0.01" placeholder="Saldo inicial" required className="border rounded-lg px-4 py-2 text-sm" value={form.balance} onChange={(e) => setForm({ ...form, balance: e.target.value })} />
          <select required className="border rounded-lg px-4 py-2 text-sm" value={form.bank_id} onChange={(e) => setForm({ ...form, bank_id: e.target.value })}>
            <option value="">Seleccionar banco</option>
            {banks.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setModal(false)} className="text-sm px-4 py-2 border rounded-lg">Cancelar</button>
            <button type="submit" disabled={saving} className="text-sm px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-60">
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={async () => { await remove(confirm.id); setConfirm(null); }}
        title="Eliminar cuenta"
        message="¿Deseas eliminar esta cuenta? Esta acción no se puede deshacer."
      />
    </div>
  );
}
