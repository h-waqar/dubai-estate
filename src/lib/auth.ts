import {signIn} from "next-auth/react";

export async function login(email: string, password: string) {
    const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
    });

    if (!res?.ok) throw new Error(res?.error || "Login failed");
    return res;
}
