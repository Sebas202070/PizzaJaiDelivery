'use client';
import { useContext, useState,useEffect } from 'react';
import { EnvioContext } from '../context/EnvioContext';
import { CartContext } from '../context/CartContext'; // Importa el contexto del carrito
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const DatosEnvio = () => {

    // datos-envio/page.js



    // ... tu código existente ...
    
    // ... el resto de tu código ...

    const { address, updateAddress } = useContext(EnvioContext);
    console.log("Datos de dirección enviados al contexto:", address);
    const { cartItems } = useContext(CartContext); // Obtén los items del carrito
    const [localAddress, setLocalAddress] = useState(address || { // Inicializa con address o un objeto vacío
        street: '',
        number: '',
        floor: '',
        apartment: '',
        postalCode: '',
        city: '',
        province: '',
    });
    const router = useRouter();

    useEffect(() => {
        setLocalAddress(address || {
            street: '',
            number: '',
            floor: '',
            apartment: '',
            postalCode: '',
            city: '',
            province: '',
        });
    }, [address]);
    const handleAddressChange = (e) => {
       
        setLocalAddress({ ...localAddress, [e.target.name]: e.target.value });
    };

    const handleConfirm = () => {
        updateAddress(localAddress);
        router.push('/carrito');
    };
    const handleModify = () => {
        updateAddress(localAddress);
        router.push('/carrito?edit=true'); // Agregar parámetro de consulta
    };

    const calculateSubtotal = () => {
        return cartItems.reduce((total, item) => {
            console.log("item.price:", item.price, "item.cantidad", item.cantidad); // Cambiado a item.cantidad
            const price = parseFloat(item.price);
            const quantity = parseInt(item.cantidad); // Cambiado a item.cantidad
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

            {/* Resumen del Carrito */}
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

            {/* Datos de Envío */}
            <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Datos de Envío:</h3>
                <p>Calle: {localAddress.street} {localAddress.number}</p>
                <p>Piso: {localAddress.floor}, Depto: {localAddress.apartment}</p>
                <p>Código Postal: {localAddress.postalCode}</p>
                <p>Ciudad: {localAddress.city}, Provincia: {localAddress.province}</p>
            </div>

            {/* Opciones */}
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