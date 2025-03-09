import type { NextAuthConfig } from "next-auth";
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/db/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import { compareSync } from "bcrypt-ts-edge";

export const config = {
    pages: {
        signIn: "/sign-in",
        error: "/sign-in",
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60,
    },
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            credentials: {
                email: { type: "email" },
                password: { type: "password" },
            },
            async authorize(credentials) {
                if (credentials == null) return null;

                // Find user in the database
                const user = await prisma.user.findFirst({
                    where: {
                        email: credentials.email as string,
                    },
                });

                // check if user exists and if password is matching
                if (user && user.password) {
                    const isMatch = compareSync(
                        credentials.password as string,
                        user.password,
                    );

                    // if password is matching return user
                    if (isMatch) {
                        return {
                            id: user.id,
                            email: user.email,
                            name: user.name,
                            role: user.role,
                        };
                    }
                }

                // if no user or password is not matching return null
                return null;
            },
        }),
    ],
    callbacks: {
        async session({ session, user, trigger, token }: any) {
            // Set the user ID from the token
            session.user.id = token.sub;

            // if there is an update, set the user.name
            if (trigger === "update") {
                session.user.name = user.name;
            }

            return session;
        },
    },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
