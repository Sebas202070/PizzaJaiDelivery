'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al registrar usuario');
      }

      router.push('/login'); // Redirige al inicio de sesión después del registro
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500">{error}</p>}
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">Nombre de usuario</label>
          <input type="text" name="username" id="username" value={username} onChange={(e) => setUsername(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo electrónico</label>
          <input type="email" name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
          <input type="password" name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required />
        </div>
        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          Registrarse
        </button>
      </form>
      <button onClick={() => signIn('google')} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded mt-4">
        Registrarse con Google
      </button>
    </div>
  );
};

export default Register;