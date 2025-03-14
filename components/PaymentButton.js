'use client';

import { useState, useEffect, useContext } from 'react';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import { useSession } from 'next-auth/react';
import { CartContext } from '@/app/context/CartContext';
import { v4 as uuidv4 } from 'uuid'; // Importa uuidv4

const MercadoPagoButton = ({ cartItems }) => {
    const [preferenceId, setPreferenceId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { data: session } = useSession();
    const { clearCart, total } = useContext(CartContext);

    useEffect(() => {
        initMercadoPago(process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY, {
            locale: 'es-AR',
        });

        const createPreference = async () => {
            setLoading(true);
            setError(null);
            try {
                if (!session) {
                    setError('Usuario no autenticado');
                    return;
                }

                const usuario = {
                    id: session.user.id,
                    nombre: session.user.name,
                    email: session.user.email,
                };

                const orderId = uuidv4(); // Genera el orderId aquí
                console.log("OrderId Generado:", orderId);

                const response = await fetch('/api/create-preference', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ cartItems, usuario, orderId }), // Incluye orderId aquí
                });

                if (!response.ok) {
                    throw new Error('Error al crear la preferencia');
                }

                const data = await response.json();
                setPreferenceId(data.preferenceId);
            } catch (error) {
                console.error(error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        createPreference();
    }, [cartItems, session]);

    const handlePaymentStart = async () => {
        setLoading(true);
        setError(null);
        try {
            console.log('Total antes de crear pedido:', total);
            console.log('Tipo de dato de total:', typeof total);
            const pedido = {
                usuario: {
                    id: session.user.id,
                    nombre: session.user.name,
                    email: session.user.email,
                },
                items: cartItems.map((item) => ({
                    nombre: item.name,
                    precio: item.price,
                    cantidad: item.cantidad,
                })),
                total,
                pagado: false,
            };
            console.log('Pedido a guardar:', pedido);
            const response = await fetch('/api/pedidos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(pedido),
            });

            if (response.ok) {
                console.log('Pedido guardado con éxito (pago iniciado)');
            } else {
                throw new Error('Error al guardar el pedido');
            }
        } catch (error) {
            console.error(error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentSuccess = async () => {
        setLoading(true);
        setError(null);
        try {
            console.log('Pago exitoso, actualizando estado del pedido');
            clearCart();
        } catch (error) {
            console.error(error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <p>Cargando botón de pago...</p>;
    }

    if (error) {
        return <p>Error al cargar el botón de pago: {error}</p>;
    }

    if (!preferenceId || !Wallet) {
        return null;
    }

    return (
        <Wallet
            initialization={{ preferenceId: preferenceId }}
            customization={{ texts: { valueProp: 'smart_option' } }}
            onReady={() => console.log('Wallet cargado')}
            onSubmit={handlePaymentStart}
            onSuccess={handlePaymentSuccess}
            onError={(error) => {
                console.error('Error en el pago:', error);
                setError('Error en el pago');
            }}
            onClose={() => console.log('Wallet cerrado')}
        />
    );
};

export default MercadoPagoButton;