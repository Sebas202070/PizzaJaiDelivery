import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from '@/lib/db';
import bcrypt from 'bcrypt';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "email" },
        contraseña: { label: "contraseña", type: "password" },
      },
      async authorize(credentials) {
        console.log('authorize: Inicio de la función authorize');
        console.log('authorize: Credenciales recibidas:', credentials);

        if (!credentials?.email || !credentials?.contraseña) {
          console.log('authorize: Credenciales incompletas.');
          return null;
        }

        try {
          const client = await clientPromise;
          const db = client.db('pizzas_jai');
          const collection = db.collection('usuarios');

          const usuario = await collection.findOne({ email: credentials.email });
          console.log('authorize: Usuario encontrado en la base de datos:', usuario);

          if (!usuario) {
            console.log('authorize: Usuario no encontrado en la base de datos.');
            return null;
          }

          const contraseñaCorrecta = await bcrypt.compare(credentials.contraseña, usuario.contraseña);
          console.log('authorize: Contraseña correcta:', contraseñaCorrecta);

          if (!contraseñaCorrecta) {
            console.log('authorize: Contraseña incorrecta.');
            return null;
          }

          const user = {
            id: usuario._id.toString(),
            name: usuario.nombre,
            email: usuario.email,
          };

          console.log('authorize: Usuario autenticado correctamente:', user);
          return user;
        } catch (error) {
          console.error('authorize: Error en authorize:', error);
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET);
      console.log('clientPromise:', clientPromise);
      return true;
    }
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };