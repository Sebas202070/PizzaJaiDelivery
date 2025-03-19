'use client';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

const Dashboard = () => {
    const { data: session, status } = useSession();
    const [pedidos, setPedidos] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (status === 'authenticated' && session?.user?.id) {
            const fetchPedidos = async () => {
                setIsLoading(true);
                let url = '/api/pedidos';
                if (session.user.rol !== 'admin') {
                    url = `/api/pedidos?userId=${session?.user?.id}`;
                }
                const response = await fetch(url);
                const data = await response.json();
                setPedidos(data);
                setIsLoading(false);
            };

            const fetchUsuarios = async () => {
                if (session.user.rol === 'admin') {
                    const response = await fetch('/api/usuarios');
                    const data = await response.json();
                    setUsuarios(data);
                }
            };

            fetchPedidos();
            fetchUsuarios();
        } else if (status === 'unauthenticated') {
            setIsLoading(false);
        }
    }, [status, session]);

    if (isLoading) {
        return <p className="p-4">Cargando...</p>;
    }

    if (status === 'unauthenticated') {
        return <p className="p-4">Acceso denegado. Inicia sesión para ver el dashboard.</p>;
    }

    const renderPedidoItems = (pedido) => {
        return pedido.items.map((item) => {
            if (item.nombre) {
                return item.nombre;
            } else if (item.name) {
                return item.name;
            }
            return 'Ítem desconocido'; // Manejar casos inesperados
        }).join(', ');
    };

    const renderEstadoPago = (pedido) => {
        const estado = pedido.pagado ? 'Pagado' : 'Pendiente';
        const bgColor = pedido.pagado ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800';
        return <span className={`p-1 rounded ${bgColor}`}>{estado}</span>;
    };

    if (session?.user?.rol === 'admin') {
        const totalPedidos = pedidos.length;
        const totalUsuarios = usuarios.length;
        const totalVentas = pedidos.reduce((acc, pedido) => acc + pedido.total, 0);

        return (
            <div className="p-8 font-sans">
                <h1 className="text-3xl font-bold mb-8 text-gray-800">Dashboard de Administrador</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded shadow">
                        <h2 className="text-lg font-semibold mb-2">Total Pedidos</h2>
                        <p className="text-3xl font-bold text-blue-600">{totalPedidos}</p>
                    </div>
                    <div className="bg-white p-6 rounded shadow">
                        <h2 className="text-lg font-semibold mb-2">Total Usuarios</h2>
                        <p className="text-3xl font-bold text-green-600">{totalUsuarios}</p>
                    </div>
                    <div className="bg-white p-6 rounded shadow">
                        <h2 className="text-lg font-semibold mb-2">Total Ventas</h2>
                        <p className="text-3xl font-bold text-indigo-600">${totalVentas}</p>
                    </div>
                </div>

                <div className="bg-white rounded shadow p-6">
                    <h2 className="text-2xl font-semibold mb-4">Usuarios y sus Pedidos</h2>
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="p-3 text-left">Usuario</th>
                                <th className="p-3 text-left">Email</th>
                                <th className="p-3 text-left">Pedidos</th>
                                <th className="p-3 text-left">Estado del Pago</th>
                                <th className="p-3 text-left">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuarios.map((usuario) => (
                                <tr key={usuario._id} className="border-b border-gray-200">
                                    <td className="p-3">{usuario.nombre}</td>
                                    <td className="p-3">{usuario.email}</td>
                                    <td className="p-3">
                                        <ul className="list-none p-0">
                                            {pedidos &&
                                                Array.isArray(pedidos) &&
                                                pedidos
                                                    .filter((pedido) => pedido.usuario && pedido.usuario.id === usuario._id) // Verificación aquí
                                                    .map((pedido) => (
                                                        <li key={pedido._id} className="mb-2">
                                                            Pedido #{pedido.orderId || pedido._id}: {renderPedidoItems(pedido)} - ${pedido.total}
                                                        </li>
                                                    ))}
                                        </ul>
                                    </td>
                                    <td className="p-3">
                                        <ul className="list-none p-0">
                                            {pedidos &&
                                                Array.isArray(pedidos) &&
                                                pedidos
                                                    .filter((pedido) => pedido.usuario && pedido.usuario.id === usuario._id) // Verificación aquí
                                                    .map((pedido) => (
                                                        <li key={pedido._id} className="mb-2">
                                                            {renderEstadoPago(pedido)}
                                                        </li>
                                                    ))}
                                        </ul>
                                    </td>
                                    <td className="p-3">
                                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                            Ver Detalles
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    } else {
        const userPedidos = pedidos.filter((pedido) => pedido.usuario && pedido.usuario.id === session?.user?.id); // Verificación aquí
        const totalPedidos = userPedidos.length;
        const totalGastado = userPedidos.reduce((acc, pedido) => acc + pedido.total, 0);

        return (
            <div className="p-8 font-sans">
                <h1 className="text-3xl font-bold mb-8 text-gray-800">Dashboard</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white p-6 rounded shadow">
                        <h2 className="text-lg font-semibold mb-2">Total Pedidos</h2>
                        <p className="text-3xl font-bold text-blue-600">{totalPedidos}</p>
                    </div>
                    <div className="bg-white p-6 rounded shadow">
                        <h2 className="text-lg font-semibold mb-2">Total Gastado</h2>
                        <p className="text-3xl font-bold text-green-600">${totalGastado}</p>
                    </div>
                </div>

                <div className="bg-white rounded shadow p-6">
                    <h2 className="text-2xl font-semibold mb-4">Mis Pedidos</h2>
                    <ul className="list-none p-0">
                        {userPedidos.map((pedido) => (
                            <li key={pedido._id} className="mb-4 border-b border-gray-200 pb-4">
                                <h3 className="text-lg font-semibold">Pedido #{pedido.orderId || pedido._id}</h3>
                                <p>
                                    {renderPedidoItems(pedido)} - Total: ${pedido.total} - Estado: {renderEstadoPago(pedido)}
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    }
};

export default Dashboard;