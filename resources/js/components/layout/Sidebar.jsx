import { NavLink } from 'react-router';

const links = [
  { to: '/dashboard', label: 'Dashboard',    icon: '🏠' },
  { to: '/spending',  label: 'Gastos',        icon: '💸' },
  { to: '/expenses',  label: 'Fijos',         icon: '📋' },
  { to: '/debts',     label: 'Deudas',        icon: '💳' },
  { to: '/accounts',  label: 'Cuentas',       icon: '🏦' },
  { to: '/family',    label: 'Familia',        icon: '👨‍👩‍👧' },
];

export default function Sidebar() {
  return (
    <aside className="w-56 bg-white border-r flex flex-col py-6 px-4 shrink-0">
      <p className="text-xl font-bold text-indigo-600 mb-8 px-2">Finances</p>
      <nav className="flex flex-col gap-1">
        {links.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`
            }
          >
            <span>{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
