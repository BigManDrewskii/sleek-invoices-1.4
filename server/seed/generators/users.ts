import type { MySql2Database } from "drizzle-orm/mysql2";
import type { ExtractTablesWithRelations } from "drizzle-orm";
import { users, type InsertUser } from "../../../drizzle/schema";
import { USER_COMPANIES } from "../data/realistic-data";

export interface SeededUser {
  id: number;
  openId: string;
  name: string;
  email: string;
  subscriptionStatus: "free" | "active" | "past_due" | "canceled";
}

export async function seedUsers(db: any): Promise<SeededUser[]> {
  const now = new Date();
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const usersData: InsertUser[] = [
    {
      openId: "seed-user-free",
      name: "Free User",
      email: "free@sleek-invoices.test",
      loginMethod: "manus",
      role: "user",
      avatarType: "initials",
      subscriptionStatus: "free",
      companyName: USER_COMPANIES[0]!.name,
      companyAddress: USER_COMPANIES[0]!.address,
      companyPhone: USER_COMPANIES[0]!.phone,
      taxId: USER_COMPANIES[0]!.taxId,
      baseCurrency: "USD",
      createdAt: new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000),
      updatedAt: now,
      lastSignedIn: now,
    },
    {
      openId: "seed-user-pro",
      name: "Pro User",
      email: "pro@sleek-invoices.test",
      loginMethod: "manus",
      role: "user",
      avatarType: "boring",
      subscriptionStatus: "active",
      stripeCustomerId: "cus_seed_pro_12345",
      subscriptionId: "sub_seed_pro_67890",
      currentPeriodEnd: thirtyDaysFromNow,
      subscriptionSource: "stripe",
      companyName: USER_COMPANIES[1]!.name,
      companyAddress: USER_COMPANIES[1]!.address,
      companyPhone: USER_COMPANIES[1]!.phone,
      taxId: USER_COMPANIES[1]!.taxId,
      logoUrl: "https://example.com/logos/techconsulting.png",
      baseCurrency: "USD",
      createdAt: new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000),
      updatedAt: now,
      lastSignedIn: now,
    },
    {
      openId: "seed-user-past-due",
      name: "Past Due User",
      email: "pastdue@sleek-invoices.test",
      loginMethod: "manus",
      role: "user",
      avatarType: "upload",
      avatarUrl: "https://example.com/avatars/user3.png",
      subscriptionStatus: "past_due",
      stripeCustomerId: "cus_seed_pastdue_11111",
      subscriptionId: "sub_seed_pastdue_22222",
      currentPeriodEnd: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      subscriptionSource: "stripe",
      companyName: USER_COMPANIES[2]!.name,
      companyAddress: USER_COMPANIES[2]!.address,
      companyPhone: USER_COMPANIES[2]!.phone,
      taxId: USER_COMPANIES[2]!.taxId,
      baseCurrency: "USD",
      createdAt: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000),
      updatedAt: now,
      lastSignedIn: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
    },
  ];

  const result = await db.insert(users).values(usersData);

  const insertId = Number(result[0].insertId);
  return usersData.map((user, index) => ({
    id: insertId + index,
    openId: user.openId!,
    name: user.name!,
    email: user.email!,
    subscriptionStatus: user.subscriptionStatus!,
  }));
}
