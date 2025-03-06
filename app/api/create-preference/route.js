import { MercadoPagoConfig, Preference } from 'mercadopago';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const data = await request.json();
    const { cartItems } = data;

    if (!cartItems || !Array.isArray(cartItems)) {
      return NextResponse.json({ error: 'cartItems is missing or not an array' }, { status: 400 });
    }

    console.log('cartItems en el backend:', cartItems);

    const client = new MercadoPagoConfig({
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
    });

    const preference = new Preference(client);

    const items = cartItems.map((item) => ({
      title: item.name,
      unit_price: item.price,
      quantity: item.cantidad,
    }));

    console.log('items a enviar a Mercado Pago:', items); // Registro de depuración

    const result = await preference.create({
        body:{
      items: items,
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_URL}`,
        failure: `${process.env.NEXT_PUBLIC_URL}/failure`,
        pending: `${process.env.NEXT_PUBLIC_URL}/pending`,
      },
      auto_return: 'approved',
    }
    });

    return NextResponse.json({ preferenceId: result.id });
  } catch (error) {
    console.error('Error al crear la preferencia:', error);
    return NextResponse.json({ error: 'Error al crear la preferencia' }, { status: 500 });
  }
}