import { useEffect, useState } from 'react';
import { useFamilyStore } from '../stores/familyStore';
import { useAuthStore }   from '../stores/authStore';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';

const ROLE_COLORS = { owner: 'bg-indigo-100 text-indigo-700', admin: 'bg-yellow-100 text-yellow-700', member: 'bg-gray-100 text-gray-600' };

export default function FamilyPage() {
  const { family, members, isLoading, fetchMembers, invite, removeMember } = useFamilyStore();
  const { user } = useAuthStore();

  const [inviteModal, setInviteModal] = useState(false);
  const [email,       setEmail]       = useState('');
  const [role,        setRole]        = useState('member');
  const [sending,     setSending]     = useState(false);
  const [confirm,     setConfirm]     = useState(null);

  useEffect(() => { fetchMembers(); }, []);

  const handleInvite = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await invite({ email, role });
      setInviteModal(false);
      setEmail('');
      fetchMembers();
    } finally {
      setSending(false);
    }
  };

  const isOwnerOrAdmin = members.some((m) => m.id === user?.id && ['owner','admin'].includes(m.pivot?.role));

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Familia</h1>
          {family && <p className="text-sm text-gray-500">{family.name}</p>}
        </div>
        {isOwnerOrAdmin && (
          <button onClick={() => setInviteModal(true)} className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700">
            + Invitar miembro
          </button>
        )}
      </div>

      {isLoading ? <p className="text-sm text-gray-400">Cargando...</p> : (
        <ul className="space-y-3">
          {members.map((m) => (
            <li key={m.id} className="bg-white border rounded-xl px-5 py-4 flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-800">{m.name}</p>
                <p className="text-xs text-gray-400">{m.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${ROLE_COLORS[m.pivot?.role] ?? ROLE_COLORS.member}`}>
                  {m.pivot?.role}
                </span>
                {isOwnerOrAdmin && m.id !== user?.id && (
                  <button onClick={() => setConfirm(m)} className="text-xs text-red-400 hover:underline">Eliminar</button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <Modal open={inviteModal} onClose={() => setInviteModal(false)} title="Invitar miembro">
        <form onSubmit={handleInvite} className="flex flex-col gap-4">
          <input type="email" placeholder="Correo electrónico" required className="border rounded-lg px-4 py-2 text-sm" value={email} onChange={(e) => setEmail(e.target.value)} />
          <select className="border rounded-lg px-4 py-2 text-sm" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="member">Miembro</option>
            <option value="admin">Administrador</option>
          </select>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setInviteModal(false)} className="text-sm px-4 py-2 border rounded-lg">Cancelar</button>
            <button type="submit" disabled={sending} className="text-sm px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-60">
              {sending ? 'Enviando...' : 'Invitar'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={async () => { await removeMember(confirm.id); setConfirm(null); fetchMembers(); }}
        title="Eliminar miembro"
        message={`¿Deseas eliminar a ${confirm?.name} de la familia?`}
      />
    </div>
  );
}
