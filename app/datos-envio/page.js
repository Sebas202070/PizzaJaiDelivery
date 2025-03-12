// DatosEnvio.jsx
'use client';
import { useContext, useState, useEffect } from 'react';
import { EnvioContext } from '../context/EnvioContext';
import { CartContext } from '../context/CartContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const DatosEnvio = () => {
    const { address, updateAddress } = useContext(EnvioContext);
    console.log("DatosEnvio: address del contexto:", address); 
    const { cartItems } = useContext(CartContext);
    const [localAddress, setLocalAddress] = useState(address || {});
    const router = useRouter();

    useEffect(() => {
        setLocalAddress(address || {});
    }, [address]);

    const handleAddressChange = (e) => {
        setLocalAddress({ ...localAddress, [e.target.name]: e.target.value });
    };

    const handleConfirm = () => {
        updateAddress(localAddress);
        router.push('/carrito');
    };

    const handleModify = () => {
        router.back(); // Navegar hacia atrás en el historial
    };

    const calculateSubtotal = () => {
        return cartItems.reduce((total, item) => {
            const price = parseFloat(item.price);
            const quantity = parseInt(item.cantidad);
            if (!isNaN(price) && !isNaN(quantity)) {
                return total + price * quantity;
            } else {
                console.error("Precio o cantidad no válidos:", item);
                return total;
            }
        }, 0);
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Resumen de la Orden</h2>
            <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Productos:</h3>
                <ul>
                    {cartItems.map((item) => (
                        <li key={item.id} className="flex items-center mb-2">
                            <Image src={item.image} alt={item.name} width={50} height={50} className="mr-2" />
                            <span>{item.name} - Cantidad: {item.cantidad} - Precio: ${item.price}</span>
                        </li>
                    ))}
                </ul>
                <p className="font-semibold">Subtotal: ${calculateSubtotal()}</p>
            </div>

            {localAddress.retirarEnLocal ? (
                <div>
                    <h3 className="text-lg font-semibold">Retiro en el local</h3>
                </div>
            ) : (
                <div>
                    <h3 className="text-lg font-semibold">Datos de Envío:</h3>
                    <p>Calle: {localAddress.street} {localAddress.number}</p>
                    <p>Piso: {localAddress.floor}, Departamento: {localAddress.apartment}</p>
                    <p>Código Postal: {localAddress.postalCode}, Ciudad: {localAddress.city}, Provincia: {localAddress.province}</p>
                </div>
            )}

            <p className="text-green-600 font-semibold mb-2">¿Todo correcto?</p>
            <button onClick={handleConfirm} className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mr-2">
                Continuar con la Compra
            </button>
            <p className="text-blue-500 cursor-pointer" onClick={handleModify}>
                ¿Deseas modificar? Haz clic aquí.
            </p>
        </div>
    );
};

export default DatosEnvio;