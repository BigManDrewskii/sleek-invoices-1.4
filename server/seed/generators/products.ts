import type { MySql2Database } from "drizzle-orm/mysql2";
import { products, type InsertProduct } from "../../../drizzle/schema";
import type { SeededUser } from "./users";
import { PRODUCTS } from "../data/realistic-data";
import { SEED_CONFIG } from "../data/constants";
import { randomInt } from "../utils";

export interface SeededProduct {
  id: number;
  userId: number;
  name: string;
  rate: string;
}

export async function seedProducts(
  db: any,
  seededUsers: SeededUser[]
): Promise<SeededProduct[]> {
  const allProducts: InsertProduct[] = [];

  for (const user of seededUsers) {
    for (let i = 0; i < SEED_CONFIG.productsPerUser; i++) {
      const productData = PRODUCTS[i % PRODUCTS.length]!;

      let usageCount = 0;
      if (i < 5) {
        usageCount = randomInt(10, 20);
      } else if (i < 8) {
        usageCount = randomInt(3, 7);
      } else {
        usageCount = randomInt(0, 2);
      }

      allProducts.push({
        userId: user.id,
        name: productData.name,
        description: productData.description,
        rate: productData.rate,
        unit: productData.unit,
        category: productData.category,
        taxable: productData.taxable,
        usageCount,
      });
    }
  }

  const result = await db.insert(products).values(allProducts);
  const insertId = Number(result[0].insertId);

  return allProducts.map((product, index) => ({
    id: insertId + index,
    userId: product.userId,
    name: product.name,
    rate: product.rate,
  }));
}
