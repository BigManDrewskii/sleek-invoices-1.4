import { useMemo } from "react";
import type { LineItem } from "../../LineItemRow";
import {
  toDecimal,
  add,
  subtract,
  multiply,
  percentage as calcPercentage,
  formatDecimal,
} from "@/lib/decimal";

export interface InvoiceCalculations {
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  total: number;
}

interface UseInvoiceCalculationsOptions {
  lineItems: LineItem[];
  taxRate: number;
  discountType: "percentage" | "fixed";
  discountValue: number;
}

export function useInvoiceCalculations(
  options: UseInvoiceCalculationsOptions
): InvoiceCalculations {
  const { lineItems, taxRate, discountType, discountValue } = options;

  return useMemo(() => {
    const subtotal = lineItems.reduce((sum, item) => {
      const itemAmount = multiply(item.quantity, item.rate);
      return add(sum, itemAmount);
    }, toDecimal(0));

    let discountAmount = toDecimal(0);
    if (discountValue > 0) {
      if (discountType === "percentage") {
        discountAmount = calcPercentage(subtotal, discountValue);
      } else {
        discountAmount = toDecimal(discountValue);
      }
    }

    const afterDiscount = subtract(subtotal, discountAmount);
    const taxAmount = calcPercentage(afterDiscount, taxRate);
    const total = add(afterDiscount, taxAmount);

    return {
      subtotal: parseFloat(formatDecimal(subtotal, 2)),
      discountAmount: parseFloat(formatDecimal(discountAmount, 2)),
      taxAmount: parseFloat(formatDecimal(taxAmount, 2)),
      total: parseFloat(formatDecimal(total, 2)),
    };
  }, [lineItems, taxRate, discountType, discountValue]);
}
