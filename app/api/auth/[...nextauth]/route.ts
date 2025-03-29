import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import authConfig from "@/lib/auth.config";

interface CustomUser {
  id: string;
  email: string;
  name: string;
}

const {
  handlers: { GET: nextAuthGET, POST: nextAuthPOST },
  auth,
} = NextAuth({
  ...authConfig,
  session: { strategy: "jwt" },
  providers: [
    ...authConfig.providers,
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email and password are required");
          }

          const user = await prisma.user.findUnique({
            where: { user_email: credentials.email as string },
            select: {
              user_id: true,
              user_email: true,
              user_name: true,
              user_password: true,
            },
          });

          if (!user?.user_password) {
            throw new Error("Invalid credentials");
          }

          const isValidPassword = await compare(
            credentials.password as string,
            user.user_password
          );

          if (!isValidPassword) {
            throw new Error("Invalid credentials");
          }

          return {
            id: user.user_id,
            email: user.user_email,
            name: user.user_name,
          } satisfies CustomUser;
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email ?? "";
        session.user.name = token.name ?? "";
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
});

export { nextAuthGET as GET, nextAuthPOST as POST, auth };