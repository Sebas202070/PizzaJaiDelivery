// DatosEnvio.jsx
'use client';
import { useContext, useState, useEffect } from 'react';
import { EnvioContext } from '../context/EnvioContext';
import { CartContext } from '../context/CartContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import PaymentButton from '@/components/PaymentButton';
import TransferenciaBancaria from '@/components/TransferenciaBancaria';
import TarjetaCreditoDebito from '@/components/TarjetaCreditoDebito';

const DatosEnvio = () => {
    const { address, updateAddress } = useContext(EnvioContext);
    const { cartItems, total } = useContext(CartContext);
    const [localAddress, setLocalAddress] = useState(address || {});
    const router = useRouter();
    const [showPaymentOptions, setShowPaymentOptions] = useState(false);
    const [paymentOption, setPaymentOption] = useState(null);

    useEffect(() => {
        setLocalAddress(address || {});
    }, [address]);

    const handleAddressChange = (e) => {
        setLocalAddress({ ...localAddress, [e.target.name]: e.target.value });
    };

    const handleConfirm = () => {
        setShowPaymentOptions(true);
    };

    const handleModify = () => {
        router.back();
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

    const handlePaymentSuccess = async () => {
        console.log("Pago exitoso");
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-start">
                    <div className="w-1/2 mr-4">
                        <h2 className="text-3xl font-bold mb-6">Resumen de la Orden</h2>
                        <div className="bg-white rounded-lg shadow-md p-6 mb-4">
                            <h3 className="text-xl font-semibold mb-4">Productos:</h3>
                            <ul>
                                {cartItems.map((item) => (
                                    <li key={item.id} className="flex items-center mb-4">
                                        <Image src={item.image} alt={item.name} width={60} height={60} className="mr-4 rounded" />
                                        <span>{item.name} - Cantidad: {item.cantidad} - Precio: ${item.price}</span>
                                    </li>
                                ))}
                            </ul>
                            <p className="font-semibold text-lg mt-4">Subtotal: ${calculateSubtotal()}</p>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-6 mb-4">
                            {localAddress.retirarEnLocal ? (
                                <div>
                                    <h3 className="text-xl font-semibold mb-4">Retiro en el local</h3>
                                </div>
                            ) : (
                                <div>
                                    <h3 className="text-xl font-semibold mb-4">Datos de Envío:</h3>
                                    <p>Calle: {localAddress.street} {localAddress.number}</p>
                                    <p>Piso: {localAddress.floor}, Departamento: {localAddress.apartment}</p>
                                    <p>Código Postal: {localAddress.postalCode}, Ciudad: {localAddress.city}, Provincia: {localAddress.province}</p>
                                </div>
                            )}
                        </div>

                        <p className="text-green-600 font-semibold mb-4">¿Todo correcto?</p>
                        {!showPaymentOptions ? (
                            <button onClick={handleConfirm} className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg mr-4">
                                Continuar con la Compra
                            </button>
                        ) : (
                            <div>
                                {/* Opciones de pago se mueven a la derecha */}
                            </div>
                        )}
                        <p className="text-blue-500 cursor-pointer" onClick={handleModify}>
                            ¿Deseas modificar? Haz clic aquí.
                        </p>
                    </div>

                    <div className="w-1/2 mt-14">
                        {showPaymentOptions && (
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-xl font-semibold mb-4">Opciones de Pago</h3>
                                <div className="space-y-4">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            value="mercadoPago"
                                            checked={paymentOption === "mercadoPago"}
                                            onChange={() => setPaymentOption("mercadoPago")}
                                            className="mr-2"
                                        />
                                        Mercado Pago
                                    </label>
                                    {paymentOption === "mercadoPago" && (
                                        <div className="mt-4">
                                            <PaymentButton cartItems={cartItems} onPaymentSuccess={handlePaymentSuccess} />
                                        </div>
                                    )}
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            value="transferencia"
                                            checked={paymentOption === "transferencia"}
                                            onChange={() => setPaymentOption("transferencia")}
                                            className="mr-2"
                                        />
                                        Transferencia Bancaria
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            value="tarjeta"
                                            checked={paymentOption === "tarjeta"}
                                            onChange={() => setPaymentOption("tarjeta")}
                                            className="mr-2"
                                        />
                                        Tarjeta de Crédito/Débito
                                    </label>
                                </div>

                                {paymentOption === "transferencia" && <TransferenciaBancaria />}
                                {paymentOption === "tarjeta" && <TarjetaCreditoDebito />}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DatosEnvio;