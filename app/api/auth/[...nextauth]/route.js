import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from '@/lib/db.mjs';
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
            rol: usuario.rol,
          };

          console.log('Authorize Callback user:', user);
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
    async session({ session, token, user }) {
      console.log('Session Callback:', { session, token, user });
      if (session?.user) {
        session.user.rol = token.rol;
        session.user.id = token.id; // Agrega el id a la sesión
      }
      return session;
    },
    async jwt({ token, user, account }) {
      console.log('JWT Callback:', { token, user, account });
      if (user) {
        token.rol = user.rol;
        token.id = user.id; // Agrega el id al token
      }
      return token;
    },
    async signIn({ user, account, profile, email, credentials }) {
      console.log('SignIn Callback:', { user, account, profile, email, credentials });
      return true;
    }
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };