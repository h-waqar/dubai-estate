// src/types/next-auth.d.ts

// import NextAuth, {DefaultSession, DefaultUser} from "next-auth"
import "next-auth";
import {DefaultSession, DefaultUser} from "next-auth"
import {JWT} from "next-auth/jwt";

declare module "next-auth" {
    interface Session {
        user: {
            id: number
            role: string
        } & DefaultSession["user"]
    }

    interface User extends DefaultUser {
        id: number
        role: string
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: number;
        role: string
    }
}

declare module "next/server" {
    interface NextRequest {
        nextauth: {
            token: JWT | null;
        };
    }


}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        role: string;
    }
}
