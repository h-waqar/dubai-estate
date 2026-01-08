// src/modules/user/routes/auth.ts

import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// --- NextAuth configuration ---
export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          firstName: profile.given_name,
          lastName: profile.family_name,
          email: profile.email,
          image: profile.picture,
          role: "USER", // Default role
          // Generate a unique-ish username: "john.doe" + random 4 chars
          username: `${profile.email.split("@")[0]}_${Math.random().toString(36).slice(2, 6)}`,
        };
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        // Find the user by email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user || !user.password) return null;

        // Compare password
        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValid) return null;

        // Return a user object with id and role
        const returnedUser = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.image,
        };
        console.log("Returned user from authorize:", returnedUser);
        return returnedUser;
      },
    }),
  ],
  session: {
    strategy: "jwt", // JWT-based sessions
  },
  callbacks: {
    // Existing session callback
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as number;
        session.user.role = token.role as string;
        session.user.image = token.picture as string | null | undefined; // Ensure image is passed
      }
      return session;
    },

    // Existing jwt callback
    async jwt({ token, user, trigger, session }) {
      // console.log("User in JWT callback:", user);
      // console.log("Token in JWT callback (before modification):", token);
      
      if (trigger === "update" && session?.user) {
         // Allow updating session from client
         return { ...token, ...session.user };
      }

      if (user) {
        token.id = Number(user.id);
        token.role = user.role;
        token.picture = user.image;
      }
      // console.log("Token in JWT callback (after modification):", token);
      return token;
    },

    // NEW: role-aware redirect
    async redirect({ url, baseUrl }) {
      // Don’t allow redirects to external URLs
      if (url.startsWith(baseUrl)) return url;

      // Decide based on role
      // ⚠️ At this stage we don't have session(), but token.role is persisted in JWT
      // So we need to check the token
      return baseUrl; // default fallback
    },
  },

  pages: {
    signIn: "/login", // Custom login page
    error: "/login", // Error code passed in query string as ?error=
  },
  debug: process.env.NODE_ENV === "development",
};

// Export as GET & POST for Next 13 Route Handlers
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
