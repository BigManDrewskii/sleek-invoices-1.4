import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Link, useLocation, useParams } from "wouter";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { InvoiceFormSkeleton } from "@/components/skeletons";
import {
  InvoiceForm,
  type InvoiceFormData,
  useInvoiceFormState,
} from "@/components/invoices/InvoiceForm";
import { getEmptyLineItem } from "@/components/invoices/InvoiceForm/hooks/useInvoiceFormState";

export default function EditInvoice() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const params = useParams();
  const invoiceId = parseInt(params.id || "0");

  const { data, isLoading } = trpc.invoices.get.useQuery(
    { id: invoiceId },
    { enabled: isAuthenticated && invoiceId > 0 }
  );

  const utils = trpc.useUtils();
  const updateInvoice = trpc.invoices.update.useMutation({
    onSuccess: () => {
      toast.success("Invoice updated successfully");
      utils.invoices.list.invalidate();
      utils.invoices.get.invalidate({ id: invoiceId });
      setLocation(`/invoices/${invoiceId}`);
    },
    onError: error => {
      toast.error(error.message || "Failed to update invoice");
    },
  });

  const handleSubmit = async (
    data: InvoiceFormData,
    status: "draft" | "sent"
  ) => {
    updateInvoice.mutate({
      id: invoiceId,
      clientId: data.clientId,
      status,
      issueDate: data.issueDate,
      dueDate: data.dueDate,
      lineItems: data.lineItems,
      taxRate: data.taxRate,
      discountType: data.discountType,
      discountValue: data.discountValue,
      notes: data.notes,
      paymentTerms: data.paymentTerms,
      templateId: data.templateId,
    });
  };

  if (loading || isLoading) {
    return <InvoiceFormSkeleton />;
  }

  if (!isAuthenticated) {
    window.location.href = getLoginUrl();
    return null;
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 md:px-6 py-12 md:py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Invoice Not Found
          </h1>
          <Link href="/invoices">
            <Button>Back to Invoices</Button>
          </Link>
        </div>
      </div>
    );
  }

  const { invoice, lineItems: fetchedLineItems } = data;

  const initialData = {
    clientId: invoice.clientId,
    issueDate: new Date(invoice.issueDate).toISOString().split("T")[0],
    dueDate: new Date(invoice.dueDate).toISOString().split("T")[0],
    taxRate: parseFloat(invoice.taxRate),
    discountType: invoice.discountType as "percentage" | "fixed",
    discountValue: parseFloat(invoice.discountValue),
    notes: invoice.notes || "",
    paymentTerms: invoice.paymentTerms || "",
    currency: invoice.currency || "USD",
    templateId: invoice.templateId || null,
  };

  const lineItems = fetchedLineItems.map(item => ({
    ...getEmptyLineItem(),
    description: item.description,
    quantity: parseFloat(item.quantity),
    rate: parseFloat(item.rate),
  }));

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Edit Invoice
              </h1>
              <p className="text-muted-foreground">
                Update invoice {invoice.invoiceNumber}
              </p>
            </div>
            <Link href={`/invoices/${invoiceId}`}>
              <Button variant="outline">Cancel</Button>
            </Link>
          </div>

          <InvoiceForm
            mode="edit"
            initialData={initialData}
            lineItems={lineItems}
            invoiceNumber={invoice.invoiceNumber}
            onSubmit={handleSubmit}
            onCancel={() => setLocation(`/invoices/${invoiceId}`)}
            isLoading={updateInvoice.isPending}
          />
        </div>
      </div>
    </div>
  );
}
