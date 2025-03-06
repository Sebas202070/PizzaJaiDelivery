'use client';
import { useState } from 'react';

const AdminDashboard = ({ initialData }) => {
  const [usuarios, setUsuarios] = useState(initialData.usuarios);
  const [pedidos, setPedidos] = useState(initialData.pedidos);

  // Agrupar pedidos por usuario
  const pedidosPorUsuario = usuarios.map((usuario) => {
    return {
      ...usuario,
      pedidos: pedidos.filter((pedido) => pedido.usuario.email === usuario.email),
    };
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Dashboard de Administrador</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pedidosPorUsuario.map((usuario) => (
          <div key={usuario._id} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Usuario: {usuario.nombre}</h2>
            <p className="text-gray-600 mb-2">Email: {usuario.email}</p>

            {usuario.pedidos.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b">Pedido #</th>
                      <th className="py-2 px-4 border-b">Detalle</th>
                      <th className="py-2 px-4 border-b">Total</th>
                      <th className="py-2 px-4 border-b">Pagado</th>
                      <th className="py-2 px-4 border-b">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuario.pedidos.map((pedido) => (
                      <tr key={pedido._id}>
                        <td className="py-2 px-4 border-b">{pedido._id.substring(20)}</td>
                        <td className="py-2 px-4 border-b">
                          {pedido.items.map((item) => (
                            <div key={item.nombre}>
                              {item.nombre} - ${item.precio} x {item.cantidad}
                            </div>
                          ))}
                        </td>
                        <td className="py-2 px-4 border-b">
                          {pedido.total !== undefined && pedido.total !== null
                            ? `$${pedido.total}`
                            : 'N/A'}
                        </td>
                        <td className="py-2 px-4 border-b">{pedido.pagado ? 'Sí' : 'No'}</td>
                        <td className="py-2 px-4 border-b">
                          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded">
                            Ver Detalles
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500">No tiene pedidos.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;