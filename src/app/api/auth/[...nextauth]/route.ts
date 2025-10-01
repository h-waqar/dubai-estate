// src/app/api/auth/[...nextauth]/route.ts

import NextAuth, {AuthOptions} from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import {PrismaAdapter} from "@next-auth/prisma-adapter"
import {prisma} from "@/lib/prisma"
import bcrypt from "bcryptjs"

// --- NextAuth configuration ---
export const authOptions: AuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {label: "Email", type: "text"},
                password: {label: "Password", type: "password"},
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials.password) return null

                // Find the user by email
                const user = await prisma.user.findUnique({
                    where: {email: credentials.email},
                })
                if (!user || !user.password) return null

                // Compare password
                const isValid = await bcrypt.compare(credentials.password, user.password)
                if (!isValid) return null

                // Return a user object with id and role
                return {
                    id: user.id.toString(), // string is required by NextAuth
                    name: user.name ?? null,
                    email: user.email,
                    role: user.role,
                }
            },
        }),
    ],
    session: {
        strategy: "jwt", // JWT-based sessions
    },
    callbacks: {
        // Adds id & role to session.user
        async session({session, token}) {
            if (session.user) {
                session.user.id = token.sub as string
                session.user.role = token.role
            }
            return session
        },

        // Persist role in JWT
        async jwt({token, user}) {
            if (user) {
                token.role = user.role
            }
            return token
        },
    },
    pages: {
        signIn: "/auth/login", // Custom login page
    },
    debug: process.env.NODE_ENV === "development",
}

// Export as GET & POST for Next 13 Route Handlers
const handler = NextAuth(authOptions)
export {handler as GET, handler as POST}
