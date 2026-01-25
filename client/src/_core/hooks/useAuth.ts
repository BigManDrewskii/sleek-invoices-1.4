import { getLoginUrl, isLocalDevMode } from "@/const";
import { trpc } from "@/lib/trpc";
import { TRPCClientError } from "@trpc/client";
import { useCallback, useEffect, useMemo } from "react";

type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

export function useAuth(options?: UseAuthOptions) {
  const {
    redirectOnUnauthenticated = false,
    redirectPath = "/api/auth/sign-in/google?callbackUrl=/dashboard",
  } = options ?? {};
  const utils = trpc.useUtils();

  const meQuery = trpc.auth.me.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });

  const logout = useCallback(async () => {
    try {
      // Call Better Auth sign-out endpoint
      const response = await fetch("/api/auth/sign-out", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      // Clear local state
      utils.auth.me.setData(undefined, null);

      // Redirect to home
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
      // Force redirect even on error
      window.location.href = "/";
    }
  }, [utils]);

  const state = useMemo(() => {
    return {
      user: meQuery.data ?? null,
      loading: meQuery.isLoading,
      error: meQuery.error ?? null,
      isAuthenticated: Boolean(meQuery.data),
    };
  }, [meQuery.data, meQuery.error, meQuery.isLoading]);

  useEffect(() => {
    // In local dev mode, don't redirect to OAuth - the backend handles auth bypass
    if (isLocalDevMode()) {
      return;
    }

    if (!redirectOnUnauthenticated) return;
    if (meQuery.isLoading) return;
    if (state.user) return;
    if (typeof window === "undefined") return;
    if (window.location.pathname === redirectPath) return;

    window.location.href = redirectPath;
  }, [redirectOnUnauthenticated, redirectPath, meQuery.isLoading, state.user]);

  return {
    ...state,
    refresh: () => meQuery.refetch(),
    logout,
  };
}
