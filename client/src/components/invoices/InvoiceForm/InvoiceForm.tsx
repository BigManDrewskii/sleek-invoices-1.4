import { useState, useId } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GearLoader } from "@/components/ui/gear-loader";
import { ClientSelector } from "../ClientSelector";
import { TemplateSelector } from "../TemplateSelector";
import { LineItemRow } from "../LineItemRow";
import { InvoiceFormCalculations } from "../InvoiceFormCalculations";
import { ProductSelector } from "../ProductSelector";
import { CurrencySelector } from "@/components/CurrencySelector";
import { isCryptoCurrency } from "../../../../../shared/currencies";
import { Plus, Save, Send, Eye } from "lucide-react";
import {
  useInvoiceFormState,
  getEmptyLineItem,
} from "./hooks/useInvoiceFormState";
import { useInvoiceCalculations } from "./hooks/useInvoiceCalculations";
import {
  validateInvoiceForm,
  hasValidationErrors,
} from "./hooks/useInvoiceValidation";
import type { InvoiceFormState } from "./hooks/useInvoiceFormState";
import type { LineItem } from "../LineItemRow";

export interface InvoiceFormProps {
  mode: "create" | "edit";
  initialData?: Partial<InvoiceFormState>;
  lineItems?: LineItem[];
  invoiceNumber?: string;
  onSubmit: (data: InvoiceFormData, status: "draft" | "sent") => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  showPreview?: boolean;
  onPreviewChange?: (show: boolean) => void;
  previewData?: {
    clientName: string;
    companyName?: string;
    companyAddress?: string;
  };
}

export interface InvoiceFormData {
  clientId: number;
  invoiceNumber: string;
  issueDate: Date;
  dueDate: Date;
  lineItems: Array<{ description: string; quantity: number; rate: number }>;
  taxRate: number;
  discountType: "percentage" | "fixed";
  discountValue: number;
  notes: string;
  paymentTerms: string;
  templateId?: number;
  currency: string;
}

export function InvoiceForm({
  mode,
  initialData,
  lineItems,
  invoiceNumber,
  onSubmit,
  onCancel,
  isLoading = false,
  showPreview = false,
  onPreviewChange,
  previewData,
}: InvoiceFormProps) {
  const [formState, actions] = useInvoiceFormState({ initialData, lineItems });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const calculations = useInvoiceCalculations({
    lineItems: formState.lineItems,
    taxRate: formState.taxRate,
    discountType: formState.discountType,
    discountValue: formState.discountValue,
  });

  const formId = useId();
  const issueDateErrorId = `${formId}-issueDate-error`;
  const dueDateErrorId = `${formId}-dueDate-error`;
  const notesId = `${formId}-notes`;
  const paymentTermsId = `${formId}-paymentTerms`;

  const handleAddProductAsLineItem = (product: {
    name: string;
    description: string | null;
    rate: string;
    unit: string | null;
  }) => {
    const description = product.description
      ? `${product.name} - ${product.description}`
      : product.name;
    actions.setLineItems([
      ...formState.lineItems,
      {
        ...getEmptyLineItem(),
        description,
        rate: parseFloat(product.rate),
      },
    ]);
  };

  const handleValidation = (): boolean => {
    const validationErrors = validateInvoiceForm(formState);
    setErrors(validationErrors);
    return !hasValidationErrors(validationErrors);
  };

  const handleSubmitDraft = async () => {
    if (!handleValidation()) {
      return;
    }
    const data = buildFormData();
    await onSubmit(data, "draft");
  };

  const handleSubmitSend = async () => {
    if (!handleValidation()) {
      return;
    }
    const data = buildFormData();
    await onSubmit(data, "sent");
  };

  const buildFormData = (): InvoiceFormData => ({
    clientId: formState.clientId!,
    invoiceNumber: invoiceNumber || "INV-0001",
    issueDate: new Date(formState.issueDate),
    dueDate: new Date(formState.dueDate),
    lineItems: formState.lineItems.map(item => ({
      description: item.description,
      quantity: item.quantity,
      rate: item.rate,
    })),
    taxRate: formState.taxRate,
    discountType: formState.discountType,
    discountValue: formState.discountValue,
    notes: formState.notes,
    paymentTerms: formState.paymentTerms,
    templateId: formState.templateId || undefined,
    currency: formState.currency,
  });

  if (isLoading && mode === "edit") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="opacity-70">
          <GearLoader size="md" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Invoice Details</CardTitle>
          <CardDescription>Basic information about the invoice</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ClientSelector
            value={formState.clientId}
            onChange={actions.setClientId}
            error={errors.clientId}
          />

          <TemplateSelector
            value={formState.templateId}
            onChange={actions.setTemplateId}
          />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`${formId}-invoiceNumber`}>Invoice Number</Label>
              <Input
                id={`${formId}-invoiceNumber`}
                value={invoiceNumber || "Loading..."}
                disabled
                aria-label="Invoice number (auto-generated)"
              />
            </div>

            <div className="space-y-2">
              <Label>Currency</Label>
              <CurrencySelector
                value={formState.currency}
                onChange={actions.setCurrency}
                className="w-full"
              />
              {isCryptoCurrency(formState.currency) && (
                <p className="text-xs text-amber-500">
                  Crypto invoice - amounts in {formState.currency}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor={`${formId}-issueDate`}>
                Issue Date <span className="text-destructive">*</span>
              </Label>
              <Input
                id={`${formId}-issueDate`}
                type="date"
                value={formState.issueDate}
                onChange={e => actions.setIssueDate(e.target.value)}
                className={errors.issueDate ? "border-destructive" : ""}
                aria-label="Invoice issue date"
                aria-required="true"
                aria-invalid={!!errors.issueDate}
                aria-describedby={
                  errors.issueDate ? issueDateErrorId : undefined
                }
              />
              {errors.issueDate && (
                <p
                  id={issueDateErrorId}
                  className="text-sm text-destructive"
                  role="alert"
                >
                  {errors.issueDate}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor={`${formId}-dueDate`}>
                Due Date <span className="text-destructive">*</span>
              </Label>
              <Input
                id={`${formId}-dueDate`}
                type="date"
                value={formState.dueDate}
                onChange={e => actions.setDueDate(e.target.value)}
                className={errors.dueDate ? "border-destructive" : ""}
                aria-label="Invoice due date"
                aria-required="true"
                aria-invalid={!!errors.dueDate}
                aria-describedby={errors.dueDate ? dueDateErrorId : undefined}
              />
              {errors.dueDate && (
                <p
                  id={dueDateErrorId}
                  className="text-sm text-destructive"
                  role="alert"
                >
                  {errors.dueDate}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Line Items</CardTitle>
              <CardDescription>
                Add products or services to the invoice
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <ProductSelector onSelect={handleAddProductAsLineItem} />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={actions.addLineItem}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="hidden md:grid grid-cols-12 gap-4 text-sm font-medium text-muted-foreground pb-2 border-b">
            <div className="col-span-5">Description</div>
            <div className="col-span-2">Quantity</div>
            <div className="col-span-2">Rate</div>
            <div className="col-span-2 text-right">Amount</div>
            <div className="col-span-1"></div>
          </div>

          {formState.lineItems.map(item => (
            <LineItemRow
              key={item.id}
              item={item}
              onChange={updated => actions.updateLineItem(item.id, updated)}
              onDelete={() => actions.deleteLineItem(item.id)}
              canDelete={formState.lineItems.length > 1}
            />
          ))}

          {errors.lineItems && (
            <p className="text-sm text-destructive">{errors.lineItems}</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Totals</CardTitle>
          <CardDescription>Tax, discounts, and final total</CardDescription>
        </CardHeader>
        <CardContent>
          <InvoiceFormCalculations
            subtotal={calculations.subtotal}
            taxRate={formState.taxRate}
            onTaxRateChange={actions.setTaxRate}
            discountType={formState.discountType}
            onDiscountTypeChange={actions.setDiscountType}
            discountValue={formState.discountValue}
            onDiscountValueChange={actions.setDiscountValue}
            discountAmount={calculations.discountAmount}
            taxAmount={calculations.taxAmount}
            total={calculations.total}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
          <CardDescription>
            Notes and payment terms for the client
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={notesId}>Notes</Label>
            <Textarea
              id={notesId}
              placeholder="Add any additional notes or comments..."
              value={formState.notes}
              onChange={e => actions.setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={paymentTermsId}>Payment Terms</Label>
            <Input
              id={paymentTermsId}
              placeholder="e.g., Net 30, Due on receipt"
              value={formState.paymentTerms}
              onChange={e => actions.setPaymentTerms(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-end gap-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          variant="outline"
          onClick={() => onPreviewChange?.(true)}
          type="button"
        >
          <Eye className="h-4 w-4 mr-2" />
          Preview
        </Button>
        <Button
          variant="outline"
          onClick={handleSubmitDraft}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save as Draft
            </>
          )}
        </Button>
        <Button onClick={handleSubmitSend} disabled={isLoading}>
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Save & Send
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
