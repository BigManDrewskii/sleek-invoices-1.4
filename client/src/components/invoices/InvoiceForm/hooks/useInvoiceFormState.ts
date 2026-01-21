import { useState } from "react";
import { nanoid } from "nanoid";
import type { LineItem } from "../../LineItemRow";

export interface InvoiceFormState {
  clientId: number | null;
  issueDate: string;
  dueDate: string;
  lineItems: LineItem[];
  taxRate: number;
  discountType: "percentage" | "fixed";
  discountValue: number;
  notes: string;
  paymentTerms: string;
  currency: string;
  templateId: number | null;
}

export interface InvoiceFormActions {
  setClientId: (id: number | null) => void;
  setIssueDate: (date: string) => void;
  setDueDate: (date: string) => void;
  setLineItems: (items: LineItem[]) => void;
  setTaxRate: (rate: number) => void;
  setDiscountType: (type: "percentage" | "fixed") => void;
  setDiscountValue: (value: number) => void;
  setNotes: (notes: string) => void;
  setPaymentTerms: (terms: string) => void;
  setCurrency: (currency: string) => void;
  setTemplateId: (id: number | null) => void;
  addLineItem: () => void;
  updateLineItem: (id: string, updated: LineItem) => void;
  deleteLineItem: (id: string) => void;
  reset: () => void;
}

export function getEmptyLineItem(): LineItem {
  return { id: nanoid(), description: "", quantity: 1, rate: 0 };
}

export function getDefaultFormState(): InvoiceFormState {
  const today = new Date().toISOString().split("T")[0];
  const dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];
  return {
    clientId: null,
    issueDate: today,
    dueDate,
    lineItems: [getEmptyLineItem()],
    taxRate: 0,
    discountType: "percentage",
    discountValue: 0,
    notes: "",
    paymentTerms: "Net 30",
    currency: "USD",
    templateId: null,
  };
}

interface UseInvoiceFormStateOptions {
  initialData?: Partial<InvoiceFormState>;
  lineItems?: Array<{ description: string; quantity: number; rate: number }>;
}

export function useInvoiceFormState(
  options: UseInvoiceFormStateOptions = {}
): [InvoiceFormState, InvoiceFormActions] {
  const { initialData, lineItems: initialLineItems } = options;
  const defaultState = getDefaultFormState();

  const processLineItems = (
    items:
      | LineItem[]
      | Array<{ description: string; quantity: number; rate: number }>
      | undefined
  ): LineItem[] => {
    if (!items) return defaultState.lineItems;
    return items.map(item => {
      if ("id" in item && (item as LineItem).id) {
        return item as LineItem;
      }
      return { ...getEmptyLineItem(), ...item };
    });
  };

  const [state, setState] = useState<InvoiceFormState>({
    ...defaultState,
    ...initialData,
    lineItems: processLineItems(initialLineItems ?? initialData?.lineItems),
  });

  const actions: InvoiceFormActions = {
    setClientId: clientId => setState(prev => ({ ...prev, clientId })),
    setIssueDate: issueDate => setState(prev => ({ ...prev, issueDate })),
    setDueDate: dueDate => setState(prev => ({ ...prev, dueDate })),
    setLineItems: lineItems => setState(prev => ({ ...prev, lineItems })),
    setTaxRate: taxRate => setState(prev => ({ ...prev, taxRate })),
    setDiscountType: discountType =>
      setState(prev => ({ ...prev, discountType })),
    setDiscountValue: discountValue =>
      setState(prev => ({ ...prev, discountValue })),
    setNotes: notes => setState(prev => ({ ...prev, notes })),
    setPaymentTerms: paymentTerms =>
      setState(prev => ({ ...prev, paymentTerms })),
    setCurrency: currency => setState(prev => ({ ...prev, currency })),
    setTemplateId: templateId => setState(prev => ({ ...prev, templateId })),
    addLineItem: () =>
      setState(prev => ({
        ...prev,
        lineItems: [...prev.lineItems, getEmptyLineItem()],
      })),
    updateLineItem: (id, updated) =>
      setState(prev => ({
        ...prev,
        lineItems: prev.lineItems.map(item =>
          item.id === id ? updated : item
        ),
      })),
    deleteLineItem: id =>
      setState(prev => ({
        ...prev,
        lineItems:
          prev.lineItems.length > 1
            ? prev.lineItems.filter(item => item.id !== id)
            : prev.lineItems,
      })),
    reset: () => setState(getDefaultFormState()),
  };

  return [state, actions];
}
