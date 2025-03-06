import { NextResponse } from 'next/server';
import { getUsuarios } from '@/lib/queries';

export async function GET(request) {
  try {
    // Obtén todos los usuarios de la base de datos
    const usuarios = await getUsuarios();

    if (usuarios.length > 0) {
      return NextResponse.json({ usuarios });
    } else {
      return NextResponse.json({ message: 'No se encontraron usuarios' }, { status: 404 });
    }
  } catch (error) {
    console.error('❌ Error al obtener los usuarios:', error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}
