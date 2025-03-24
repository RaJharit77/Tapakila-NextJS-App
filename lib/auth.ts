import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import authconfig from "./auth.config";
import { prisma } from "./prisma";

export interface CustomUser {
    id: string,
    email: string,
    name: string,
    password: string
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    session: { strategy: "jwt" },
    providers: [...authconfig.providers,

    Credentials({
        name: "Codev Provider",
        credentials: {
            email: { label: "Email", type: "email" },
            password: { label: "Password", type: "password" }
        },

        async authorize(credentials) {
            const user = await prisma.user.findUnique({
                where: {
                    user_email: credentials?.email as string
                }
            })

            if (user && user.user_password === credentials.password) {
                const customUser: CustomUser = {
                    id: user.user_id,
                    email: user.user_email,
                    name: user.user_name,
                    password: user.user_password
                };
                return customUser;
            } else {
                return null;
            }

        }
    }),

    ],

    callbacks: {
        async jwt({ token, user }: { token: JWT, user?: any }) {
            if (user) {
                token.name = user.name;
                token.email = user.email;
            }
            return token;
        },

        async session({ session, token, }) {
            session.user.id = token.id as string
            session.user.email = token.email ?? ""
            session.user.name = token.name

            return session
        },

    },

    pages: {
        signIn: "/login",
    },
})