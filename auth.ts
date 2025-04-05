import type { NextAuthConfig } from "next-auth";
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/db/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import { compareSync } from "bcrypt-ts-edge";
import { NextResponse } from "next/server";

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
            session.user.role = token.role;
            session.user.name = token.name;

            // if there is an update, set the user.name
            if (trigger === "update") {
                session.user.name = user.name;
            }

            return session;
        },
        async jwt({ token, user }: any) {
            // Assign user fields to token
            if (user) {
                token.role = user.role;

                // if user has no name the use the email
                if (user.name === "NO_NAME") {
                    token.name = user.email!.split("@")[0];

                    // Update database to reflect the token name
                    await prisma.user.update({
                        where: { id: user.id },
                        data: { name: token.name },
                    });
                }
            }
            return token;
        },
        authorized({ request, auth }: any) {
            // Check for session cart cookie
            if (!request.cookies.get("sessionCartId")) {
                // Generate new session cart id cookie
                const sessionCartId = crypto.randomUUID();

                // Clone the req headers
                const newRequestHeaders = new Headers(request.headers);

                // Create new response and add new headers
                const response = NextResponse.next({
                    request: {
                        headers: newRequestHeaders,
                    },
                });

                // Set newly generated sessionCartId  in the response cookies
                response.cookies.set("sessionCartId", sessionCartId);

                return response;
            } else {
                return true;
            }
        },
    },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
