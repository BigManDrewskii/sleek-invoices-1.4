import type { InvoiceFormState } from "./useInvoiceFormState";

export type ValidationErrors = Record<string, string> & {
  clientId?: string;
  issueDate?: string;
  dueDate?: string;
  lineItems?: string;
  taxRate?: string;
  discountValue?: string;
};

export function validateInvoiceForm(state: InvoiceFormState): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!state.clientId) {
    errors.clientId = "Please select a client";
  }

  if (!state.issueDate) {
    errors.issueDate = "Issue date is required";
  }

  if (!state.dueDate) {
    errors.dueDate = "Due date is required";
  }

  if (state.issueDate && state.dueDate) {
    const issueDateObj = new Date(state.issueDate);
    const dueDateObj = new Date(state.dueDate);
    if (dueDateObj < issueDateObj) {
      errors.dueDate = "Due date must be after issue date";
    }
  }

  if (state.lineItems.length === 0) {
    errors.lineItems = "At least one line item is required";
  }

  state.lineItems.forEach((item, index) => {
    if (!item.description.trim()) {
      errors[`lineItem_${index}_description`] = "Description is required";
    }
    if (item.quantity <= 0) {
      errors[`lineItem_${index}_quantity`] = "Quantity must be greater than 0";
    }
    if (item.rate < 0) {
      errors[`lineItem_${index}_rate`] = "Rate cannot be negative";
    }
  });

  if (state.taxRate < 0 || state.taxRate > 100) {
    errors.taxRate = "Tax rate must be between 0 and 100";
  }

  if (state.discountValue < 0) {
    errors.discountValue = "Discount cannot be negative";
  }

  return errors;
}

export function hasValidationErrors(errors: ValidationErrors): boolean {
  return Object.keys(errors).length > 0;
}
