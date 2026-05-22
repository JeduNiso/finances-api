import { useAuthStore } from '../../stores/authStore';

export default function Topbar() {
  const { user, family, logout } = useAuthStore();

  return (
    <header className="h-14 bg-white border-b flex items-center justify-between px-6 shrink-0">
      <p className="text-sm font-medium text-gray-500">
        {family ? `Familia: ${family.name}` : 'Sin familia'}
      </p>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-700">{user?.name}</span>
        <button
          onClick={logout}
          className="text-xs text-red-500 hover:underline"
        >
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}
