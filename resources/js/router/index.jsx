import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import ProtectedRoute from './ProtectedRoute';
import AppLayout      from '../components/layout/AppLayout';
import LoginPage      from '../pages/LoginPage';
import RegisterPage   from '../pages/RegisterPage';
import DashboardPage  from '../pages/DashboardPage';
import SpendingPage   from '../pages/SpendingPage';
import ExpensesPage   from '../pages/ExpensesPage';
import DebtsPage      from '../pages/DebtsPage';
import AccountsPage   from '../pages/AccountsPage';
import FamilyPage     from '../pages/FamilyPage';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="spending"  element={<SpendingPage />} />
          <Route path="expenses"  element={<ExpensesPage />} />
          <Route path="debts"     element={<DebtsPage />} />
          <Route path="accounts"  element={<AccountsPage />} />
          <Route path="family"    element={<FamilyPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
