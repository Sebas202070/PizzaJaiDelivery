import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { createUsuario, getUsuarios, getUsuarioPorEmail } from '@/lib/queries';

export async function POST(request) {
  try {
    const {nombre, email, contraseña } = await request.json();

    // Validación de datos (ejemplo)
    if (!nombre || !email || !contraseña) {
      return NextResponse.json({ message: 'Todos los campos son requeridos' }, { status: 400 });
    }

    // Verificar si el usuario ya existe en la base de datos
    const usuarios = await getUsuarios();
    const existingUser = usuarios.find((user) => user.email === email);
    const existingUsername = usuarios.find((user) => user.nombre === nombre);

    if (existingUser) {
      return NextResponse.json({ message: 'El correo electrónico ya está en uso' }, { status: 400 });
    }

    if (existingUsername) {
      return NextResponse.json({ message: 'El nombre de usuario ya está en uso' }, { status: 400 });
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(contraseña, 10);

    // Crear el usuario en la base de datos
    const newUser = {
      nombre: nombre,
      email,
      contraseña: hashedPassword,
      rol: 'usuario',
    };

    const result = await createUsuario(newUser);

    return NextResponse.json({ message: 'Usuario registrado con éxito', userId: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    return NextResponse.json({ message: 'Error interno del servidor: ' + error.message }, { status: 500 });
  }
}