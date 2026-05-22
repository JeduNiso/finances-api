import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuthStore } from '../stores/authStore';

export default function RegisterPage() {
  const navigate  = useNavigate();
  const register  = useAuthStore((s) => s.register);
  const [form,    setForm]    = useState({ name: '', username: '', email: '', password: '', password_confirmation: '' });
  const [error,   setError]   = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      const errors = err.response?.data?.errors;
      setError(errors ? Object.values(errors).flat().join(' ') : 'Error al registrar');
    } finally {
      setLoading(false);
    }
  };

  const field = (name, placeholder, type = 'text') => (
    <input
      type={type}
      placeholder={placeholder}
      required
      className="border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
      value={form[name]}
      onChange={(e) => setForm({ ...form, [name]: e.target.value })}
    />
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-indigo-600 mb-6">Crear cuenta</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {field('name',                  'Nombre completo')}
          {field('username',              'Nombre de usuario')}
          {field('email',                 'Correo electrónico', 'email')}
          {field('password',              'Contraseña',         'password')}
          {field('password_confirmation', 'Confirmar contraseña', 'password')}
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>
        <p className="text-xs text-center mt-4 text-gray-500">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-indigo-600 hover:underline">Ingresar</Link>
        </p>
      </div>
    </div>
  );
}
