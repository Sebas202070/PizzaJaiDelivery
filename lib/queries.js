import clientPromise from './db';
import bcrypt from 'bcryptjs'
import { ObjectId } from 'mongodb';

export async function getUsuarios() {
  const client = await clientPromise;
  const db = client.db('pizzas_jai');
  const collection = db.collection('usuarios');
  return await collection.find({}).toArray();
}

// app/api/auth/[...nextauth]/route.js
async function verificarUsuario(email, contraseña) {
  try {
    console.log('Verificando usuario:', email); // Log de depuración
    // ... (Tu código para consultar la base de datos) ...
    console.log('Usuario encontrado:', usuario); // Log de depuración
    // ... (Tu código para comparar contraseñas) ...
    console.log('Contraseña correcta:', contraseñaCorrecta); // Log de depuración
    return {
      _id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
    };
  } catch (error) {
    console.error('Error en verificarUsuario:', error);
    return null;
  }
}
export async function createUsuario(usuario) {
  const client = await clientPromise;
  const db = client.db('pizzas_jai');
  const collection = db.collection('usuarios');
  return await collection.insertOne(usuario);
}

export async function getUsuarioPorId(id) {
  try {
    const client = await clientPromise;
    const db = client.db('pizzas_jai');
    const collection = db.collection('usuarios');
    return await collection.findOne({ _id: new ObjectId(id) });
  } catch (error) {
    console.error('Error en getUsuarioPorId:', error);
    return null;
  }
}



export async function getUsuarioPorEmail(email) {
  const client = await clientPromise;
  const db = client.db('pizzas_jai');
  const collection = db.collection('usuarios');
  return await collection.findOne({ email });
}



export async function getUsuarioPorEmailOptimizado(email) {
  if (!email || typeof email !== 'string') {
    console.error('getUsuarioPorEmailOptimizado: Email inválido');
    return { error: true, message: 'Email inválido' };
  }

  try {
    const client = await clientPromise;
    
    if (!client) {
      console.error('getUsuarioPorEmailOptimizado: No se pudo conectar a la base de datos');
      return { error: true, message: 'Error de conexión a la base de datos' };
    }

    const db = client.db('pizzas_jai');
    const collection = db.collection('usuarios');

    const usuario = await collection.findOne(
      { email: email },
      { projection: { nombre: 1 } }
    );

    if (!usuario) {
      return { error: true, message: 'Usuario no encontrado' };
    }

    return usuario;
  } catch (error) {
    console.error('Error en getUsuarioPorEmailOptimizado:', error);
    return { error: true, message: 'Error interno al obtener usuario' };
  }
}


// ... otras funciones ...

// ... otras funciones