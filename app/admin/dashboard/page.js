// app/admin/dashboard/page.js
'use client';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

const Dashboard = () => {
    const { data: session, status } = useSession();
    const [pedidos, setPedidos] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        console.log('Session in Dashboard:', session);

        if (status === 'authenticated' && session?.user?.id) {
            console.log('session.user.id:', session.user.id);

            const fetchPedidos = async () => {
                setIsLoading(true);
                let url = '/api/pedidos';

                if (session.user.rol === 'usuario') {
                    url += `?userId=${session.user.id}`;
                }

                const response = await fetch(url);
                const data = await response.json();

                console.log('Pedidos from API:', data);
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
        return <p>Cargando...</p>;
    }

    if (status === 'unauthenticated') {
        return <p>Acceso denegado. Inicia sesión para ver el dashboard.</p>;
    }

    if (session?.user?.rol === 'admin') {
        return (
            <div>
                <h1>Dashboard de Administrador</h1>
                <h2>Usuarios y sus Pedidos</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Usuario</th>
                            <th>Email</th>
                            <th>Pedidos</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map((usuario) => (
                            <tr key={usuario._id}>
                                <td>{usuario.nombre}</td>
                                <td>{usuario.email}</td>
                                <td>
                                    <ul>
                                        {pedidos &&
                                            Array.isArray(pedidos) &&
                                            pedidos
                                                .filter((pedido) => {
                                                    console.log("Pedido siendo filtrado:", pedido);
                                                    console.log("Objeto usuario:", pedido.usuario);
                                                    console.log("ID usuario (pedidos):", pedido?.usuario?.id);
                                                    console.log("ID usuario (usuarios):", usuario._id);

                                                    if (pedido?.usuario?.id) {
                                                        let pedidoUserId = pedido.usuario.id;
                                                        if (typeof pedidoUserId === 'string') {
                                                            pedidoUserId = { $oid: pedidoUserId };
                                                        }
                                                        if (pedidoUserId?.$oid) {
                                                            console.log(
                                                                "Comparando:",
                                                                pedidoUserId.$oid,
                                                                usuario._id
                                                            );
                                                            return pedidoUserId.$oid === usuario._id;
                                                        }
                                                    }
                                                    console.log("Pedido incompleto:", pedido);
                                                    return false;
                                                })
                                                .map((pedido) => (
                                                    <li key={pedido._id}>
                                                        Pedido #{pedido._id}: {pedido.items.map((item) => item.nombre).join(", ")} - Total: $
                                                        {pedido.total}
                                                    </li>
                                                ))}
                                    </ul>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    } else {
        return (
            <div>
                <h1>Dashboard</h1>
                <h2>Mis Pedidos</h2>
                <ul>
                    {pedidos &&
                        Array.isArray(pedidos) &&
                        pedidos.map((pedido) => (
                            <li key={pedido._id}>
                                Pedido #{pedido._id}: {pedido.items.map((item) => item.nombre).join(", ")} - Total: $
                                {pedido.total}
                            </li>
                        ))}
                </ul>
            </div>
        );
    }
};

export default Dashboard;