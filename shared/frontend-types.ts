/**
 * Frontend type definitions for client-side use.
 * These types represent data as it flows through tRPC to the frontend.
 */

import type {
  Client,
  Expense,
  Estimate,
  Invoice,
  Payment,
} from "../drizzle/schema";

/* ==========================================================================
   EXPENSE TYPES
   ========================================================================== */

export type ExpensePaymentMethod =
  | "cash"
  | "credit_card"
  | "debit_card"
  | "bank_transfer"
  | "check"
  | "other";

export interface ExpenseWithRelations extends Expense {
  category?: {
    id: number;
    name: string;
    color: string;
  };
  client?: Client;
}

export interface ExpenseWithDetails {
  id: number;
  userId: number;
  categoryId: number;
  categoryName: string | null;
  categoryColor: string | null;
  amount: string;
  currency: string;
  date: Date;
  vendor: string | null;
  description: string;
  notes: string | null;
  receiptUrl: string | null;
  receiptKey: string | null;
  paymentMethod: string | null;
  taxAmount: string;
  isBillable: boolean;
  clientId: number | null;
  clientName: string | null;
  invoiceId: number | null;
  billedAt: Date | null;
  isRecurring: boolean;
  isTaxDeductible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface EstimateWithClient {
  id: number;
  estimateNumber: string;
  status: string;
  issueDate: Date;
  validUntil: Date;
  total: string;
  currency: string;
  title: string | null;
  clientId: number;
  clientName: string | null;
  clientEmail: string | null;
  convertedToInvoiceId: number | null;
}

export interface ExpenseFormData {
  categoryId: number;
  amount: number;
  date: Date;
  description: string;
  vendor?: string;
  paymentMethod?: ExpensePaymentMethod;
  taxAmount?: number;
  receiptUrl?: string;
  receiptKey?: string;
  isBillable: boolean;
  clientId?: number;
}

export interface ExpenseStats {
  totalAmount: number;
  totalTax: number;
  totalWithTax: number;
  count: number;
  billableCount: number;
  nonBillableCount: number;
  billableAmount: number;
  byPaymentMethod: Record<string, number>;
  byCategory: Record<string, { name: string; color: string; amount: number }>;
}

/* ==========================================================================
   ESTIMATE TYPES
   ========================================================================== */

export type EstimateStatus =
  | "draft"
  | "sent"
  | "viewed"
  | "accepted"
  | "rejected"
  | "expired"
  | "converted";

export interface EstimateWithRelations extends Estimate {
  client?: Client;
}

export interface EstimateFormData {
  clientId: number;
  estimateNumber: string;
  issueDate: Date;
  validUntil: Date;
  title?: string;
  notes?: string;
  terms?: string;
  templateId?: number;
  currency: string;
  taxRate: number;
  discountType: "percentage" | "fixed";
  discountValue: number;
  lineItems: EstimateLineItemFormData[];
}

export interface EstimateLineItemFormData {
  description: string;
  quantity: number;
  rate: number;
}

/* ==========================================================================
   INVOICE TYPES
   ========================================================================== */

export type InvoiceStatus =
  | "draft"
  | "sent"
  | "viewed"
  | "paid"
  | "overdue"
  | "canceled";

export type PaymentStatus = "unpaid" | "partial" | "paid";

export interface InvoiceWithRelations extends Invoice {
  client?: Client;
}

export interface InvoiceFormData {
  clientId: number;
  invoiceNumber: string;
  issueDate: Date;
  dueDate: Date;
  currency: string;
  taxRate: number;
  discountType: "percentage" | "fixed";
  discountValue: number;
  notes?: string;
  paymentTerms?: string;
  templateId?: number;
  lineItems: InvoiceLineItemFormData[];
}

export interface InvoiceLineItemFormData {
  description: string;
  quantity: number;
  rate: number;
}

export interface BatchInvoiceResult {
  clientId: number;
  status: "success" | "error";
  invoiceId?: number;
  invoiceNumber?: string;
  error?: string;
}

export interface BatchInvoiceClientSelection {
  client: Client;
  templateId?: number;
  dueDate?: Date;
  lineItems?: InvoiceLineItemFormData[];
}

/* ==========================================================================
   CLIENT TYPES
   ========================================================================== */

export interface ClientWithStats extends Client {
  totalInvoiced: number;
  totalPaid: number;
  outstandingBalance: number;
  invoiceCount: number;
  paidInvoiceCount: number;
}

export interface ClientFormData {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  companyName?: string;
  notes?: string;
  vatNumber?: string;
  taxExempt: boolean;
}

export interface ClientTagLabel {
  id: number;
  name: string;
  color: string;
  description?: string;
}

/* ==========================================================================
   PAYMENT TYPES
   ========================================================================== */

export type PaymentMethod =
  | "stripe"
  | "manual"
  | "bank_transfer"
  | "check"
  | "cash"
  | "crypto";

export interface PaymentWithRelations extends Payment {
  invoice?: Invoice;
}

export interface PaymentFormData {
  invoiceId: number;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  paymentDate: Date;
  notes?: string;
}

/* ==========================================================================
   FILTER TYPES
   ========================================================================== */

export type DateRangeFilter =
  | "all"
  | "today"
  | "7days"
  | "30days"
  | "90days"
  | "year";

export interface FilterState {
  client: string | number;
  dateRange: DateRangeFilter;
  status: string;
  paymentStatus?: PaymentStatus;
  minAmount?: string;
  maxAmount?: string;
}

/* ==========================================================================
   BATCH OPERATION TYPES
   ========================================================================== */

export interface BatchOperationResult<T> {
  items: Array<{
    item: T;
    status: "success" | "error";
    error?: string;
  }>;
  summary: {
    total: number;
    succeeded: number;
    failed: number;
  };
}

export interface BatchProgressState {
  total: number;
  current: number;
  results: BatchOperationResult<unknown>["items"];
  isComplete: boolean;
}
