import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import prisma from './server/db/prisma';
import bcrypt from 'bcryptjs';

export const { handlers, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        });

        if (!user || !user.passwordHash) return null;

        const passwordsMatch = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        );

        if (passwordsMatch) {
          return {
            id: user.id,
            name: user.fullName || null, 
            email: user.email,
            role: user.role
          };
        }
        return null;
      }
    })
  ],
  pages: {
    signIn: '/login', // Redirects unauthenticated users to our custom page
  },
  session: { strategy: 'jwt' },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callbacks
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callbacks to the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    }
  }
});
