export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

/**
 * Check if we're in local development mode with auth bypass enabled.
 * This is determined by the VITE_SKIP_AUTH environment variable.
 */
export const isLocalDevMode = () => {
  return (
    import.meta.env.VITE_SKIP_AUTH === "true" ||
    (import.meta.env.MODE === "development" &&
      !import.meta.env.VITE_OAUTH_PORTAL_URL)
  );
};

/**
 * Generate login URL at runtime so redirect URI reflects the current origin.
 * In local dev mode with SKIP_AUTH, returns a placeholder that won't be used.
 */
export const getLoginUrl = (provider?: "google" | "github") => {
  if (isLocalDevMode()) {
    return "/"; // Auth bypassed anyway
  }

  // Better Auth sign-in endpoint
  const baseUrl = "/api/auth/sign-in";
  const url = new URL(baseUrl, window.location.origin);

  if (provider) {
    url.searchParams.set("provider", provider);
  }

  // Redirect back to dashboard after login
  url.searchParams.set("callbackUrl", "/dashboard");

  return url.toString();
};

export const getSignUpUrl = (provider?: "google" | "github") => {
  return getLoginUrl(provider); // Auth.js handles both sign-in and sign-up
};

export const getLogoutUrl = () => {
  return "/api/auth/sign-out?callbackUrl=/";
};
