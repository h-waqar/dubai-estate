// src/modules/user/hooks/useAuth.ts
"use client";

import { useSession } from "next-auth/react";

export function useAuth() {
  const { data: session, status, update } = useSession();

  const userId = session?.user?.id;
  const userRoles = session?.user?.roles;
  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";

  return {
    userId,
    userRoles,
    isAuthenticated,
    isLoading,
    session,
    update,
  };
}
