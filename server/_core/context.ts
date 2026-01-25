import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  // SKIP_AUTH bypass (KEEP THIS!) - Development mode
  if (process.env.SKIP_AUTH === "true") {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "CRITICAL SECURITY ERROR: SKIP_AUTH is enabled in production"
      );
    }

    const { getUserByOpenId, upsertUser } = await import("../db");

    let devUser = await getUserByOpenId("dev-user-local");

    if (!devUser) {
      await upsertUser({
        openId: "dev-user-local",
        name: "Local Dev User",
        email: "dev@localhost.test",
        loginMethod: "dev",
        lastSignedIn: new Date(),
      });
      devUser = await getUserByOpenId("dev-user-local");
    }

    return {
      req: opts.req,
      res: opts.res,
      user: devUser || null,
    };
  }

  // Better Auth session validation
  try {
    const cookieHeader = opts.req.headers.cookie;
    if (cookieHeader) {
      const { auth } = await import("./better-auth");
      const session = await auth.api.getSession({
        headers: opts.req.headers as HeadersInit,
      });

      if (session?.user?.id) {
        const userId = parseInt(session.user.id);
        const { getUserById } = await import("../db");
        user = (await getUserById(userId)) || null;
      }
    }
  } catch (error) {
    // Session validation failed (no session or invalid session)
    // This is expected for unauthenticated requests
    user = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
