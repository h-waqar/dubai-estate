// src/types/next-auth.d.ts

// import NextAuth, {DefaultSession, DefaultUser} from "next-auth"
import "next-auth";
import {DefaultSession, DefaultUser} from "next-auth"
import {JWT} from "next-auth/jwt";

declare module "next-auth" {
    interface Session {
        user: {
            id: number
            roles: string[]
        } & DefaultSession["user"]
    }

    interface User extends DefaultUser {
        id: number
        roles: string[]
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: number;
        roles: string[]
    }
}

declare module "next/server" {
    interface NextRequest {
        nextauth: {
            token: JWT | null;
        };
    }


}


