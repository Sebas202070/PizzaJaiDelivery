'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const Login = () => {
    const [email, setEmail] = useState('');
    const [contraseña, setContraseña] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await signIn('credentials', {
            email,
            contraseña,
            redirect: false,
        });
        console.log('result:', result);

        if (result?.error) {
            console.error('Error al iniciar sesión:', result.error);
        } else {
            console.log('result.user:', result.user);
            if (result.user) {
                localStorage.setItem('user', JSON.stringify(result.user));
            } else {
                console.error('result.user es undefined');
            }
            console.log('localStorage user:', localStorage.getItem('user'));
            router.push('/');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl font-semibold mb-4">Iniciar Sesión</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Correo electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={contraseña}
                        onChange={(e) => setContraseña(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                    >
                        Iniciar Sesión
                    </button>
                </form>
                <button
                    type="button"
                    onClick={() => router.push('/registro')}
                    className="w-full mt-4 bg-green-500 text-white p-2 rounded hover:bg-green-600"
                >
                    Si no estás registrado aún, regístrate
                </button>
            </div>
        </div>
    );
};

export default Login;