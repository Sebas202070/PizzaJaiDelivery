// components/AdminDashboard.js
'use client';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

const AdminDashboard = () => {
  const { data: session, status } = useSession();
  const [pedidos, setPedidos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('Session in AdminDashboard:', session);

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
        <ul>
          {usuarios.map((usuario) => (
            <li key={usuario._id}>
              <h3>{usuario.nombre} ({usuario.email})</h3>
              <h4>Pedidos:</h4>
              <ul>
                {pedidos && Array.isArray(pedidos) && pedidos
                  .filter((pedido) => {
                    // Corrección: Accede a pedido.usuario.id.$oid
                    console.log("Comparando:", pedido.usuario.id.$oid, usuario._id); // Log de depuración
                    return pedido.usuario.id.$oid === usuario._id; // Asegúrate de que esta comparación sea correcta
                  })
                  .map((pedido) => (
                    <li key={pedido._id}>
                      Pedido #{pedido._id}: {pedido.items.map((producto) => producto.nombre).join(', ')} - Total: ${pedido.total}
                    </li>
                  ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    );
  } else {
    return (
      <div>
        <h1>Dashboard</h1>
        <h2>Mis Pedidos</h2>
        <ul>
          {pedidos && Array.isArray(pedidos) && pedidos.map((pedido) => (
            <li key={pedido._id}>
              Pedido #{pedido._id}: {pedido.items.map((producto) => producto.nombre).join(', ')} - Total: ${pedido.total}
            </li>
          ))}
        </ul>
      </div>
    );
  }
};

export default AdminDashboard;