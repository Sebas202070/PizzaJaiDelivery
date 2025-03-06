import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getUsuarios } from '@/lib/queries';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Buscar el usuario en la base de datos
    const usuarios = await getUsuarios();
    const user = usuarios.find((u) => u.email === email);

    if (!user) {
      return NextResponse.json({ message: 'Credenciales inválidas' }, { status: 401 });
    }

    // Verificar la contraseña
    const passwordMatch = await bcrypt.compare(password, user.contraseña);

    if (!passwordMatch) {
      return NextResponse.json({ message: 'Credenciales inválidas' }, { status: 401 });
    }

    // Crear una sesión o token JWT
    // ... (Implementa la creación de la sesión o token JWT)

    return NextResponse.json({ message: 'Inicio de sesión exitoso' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}