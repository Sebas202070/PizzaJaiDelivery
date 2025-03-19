'use client';

import { useState, useEffect, useContext } from 'react';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import { useSession } from 'next-auth/react';
import { CartContext } from '@/app/context/CartContext';

const MercadoPagoButton = ({ cartItems, orderId, onPaymentSuccess }) => {
    const [preferenceId, setPreferenceId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { data: session } = useSession();
    const { clearCart } = useContext(CartContext);
    const [preferenceCreated, setPreferenceCreated] = useState(false);

    useEffect(() => {
        if (cartItems && cartItems.length > 0 && session && orderId && !preferenceCreated) {
            initMercadoPago(process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY, {
                locale: 'es-AR',
            });

            const createPreference = async () => {
                setLoading(true);
                setError(null);
                try {
                    const usuario = {
                        id: session.user.id,
                        nombre: session.user.name,
                        email: session.user.email,
                    };

                    console.log("OrderId Recibido:", orderId);

                    const response = await fetch('/api/create-preference', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ cartItems, usuario, orderId }),
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.message || 'Error al crear la preferencia');
                    }

                    const data = await response.json();
                    setPreferenceId(data.preferenceId);
                    setPreferenceCreated(true);
                } catch (error) {
                    console.error(error);
                    setError(error.message);
                } finally {
                    setLoading(false);
                }
            };

            createPreference();
        }
    }, [cartItems, session, orderId, preferenceCreated]);

    const handlePaymentStart = async () => {
        setLoading(true);
        setError(null);
        try {
            console.log('Iniciando pago con Mercado Pago');
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
            if (onPaymentSuccess) {
                await onPaymentSuccess();
            }
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