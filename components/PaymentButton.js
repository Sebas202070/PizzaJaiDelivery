'use client';

import { useState, useEffect } from 'react';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';

const MercadoPagoButton = ({ cartItems }) => {
  const [preferenceId, setPreferenceId] = useState(null);
  

  useEffect(() => {
    initMercadoPago(process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY, {
      locale: 'es-AR',
    });

    const createPreference = async () => {
      try {
        const response = await fetch('/api/create-preference', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ cartItems }),
        });

        if (!response.ok) {
          throw new Error('Error al crear la preferencia');
        }

        const data = await response.json();
        setPreferenceId(data.preferenceId);
      } catch (error) {
        console.error(error);
      }
    };

    createPreference();
  }, [cartItems]);

  if (!preferenceId || !Wallet) {
    return <p>Cargando botón de pago...</p>;
  }

  return (
    <Wallet
      initialization={{ preferenceId: preferenceId }}
      customization={{ texts: { valueProp: 'smart_option' } }}
    />
  );
};

export default MercadoPagoButton;
