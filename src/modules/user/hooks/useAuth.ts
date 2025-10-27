// src/modules/user/hooks/useAuth.ts
"use client";

import { useSession } from "next-auth/react";

export function useAuth() {
  const { data: session, status } = useSession();

  const userId = session?.user?.id;
  const userRole = session?.user?.role;
  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";

  return {
    userId,
    userRole,
    isAuthenticated,
    isLoading,
    session,
  };
}
