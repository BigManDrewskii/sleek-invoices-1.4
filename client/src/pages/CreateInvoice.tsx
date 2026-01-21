import { GearLoader } from "@/components/ui/gear-loader";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Link, useLocation, useSearch } from "wouter";
import { toast } from "sonner";
import { PageLayout } from "@/components/layout/PageLayout";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { useState, useEffect } from "react";
import {
  InvoiceForm,
  type InvoiceFormData,
} from "@/components/invoices/InvoiceForm";
import { InvoicePreviewModal } from "@/components/invoices/InvoicePreviewModal";
import { UpgradeDialog } from "@/components/UpgradeDialog";
import { getEmptyLineItem } from "@/components/invoices/InvoiceForm/hooks/useInvoiceFormState";

export default function CreateInvoice() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const searchString = useSearch();

  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const [prefillClientName, setPrefillClientName] = useState<string | null>(
    null
  );
  const [prefillCurrency, setPrefillCurrency] = useState<string>("USD");
  const [prefillDueDate, setPrefillDueDate] = useState<string | null>(null);
  const [prefillNotes, setPrefillNotes] = useState<string>("");
  const [prefillLineItems, setPrefillLineItems] = useState<
    Array<{ description: string; quantity: number; rate: number }>
  >([]);

  useEffect(() => {
    if (!searchString) return;

    const params = new URLSearchParams(searchString);

    const clientName = params.get("clientName");
    if (clientName && clientName !== "null") {
      setPrefillClientName(clientName);
    }

    const urlCurrency = params.get("currency");
    if (urlCurrency && urlCurrency !== "null") {
      setPrefillCurrency(urlCurrency);
    }

    const urlDueDate = params.get("dueDate");
    if (
      urlDueDate &&
      urlDueDate !== "null" &&
      urlDueDate.match(/^\d{4}-\d{2}-\d{2}$/)
    ) {
      setPrefillDueDate(urlDueDate);
    }

    const urlNotes = params.get("notes");
    if (urlNotes && urlNotes !== "null") {
      setPrefillNotes(urlNotes);
    }

    const lineItemsParam = params.get("lineItems");
    if (lineItemsParam) {
      try {
        const parsedItems = JSON.parse(lineItemsParam) as Array<{
          description: string;
          quantity: number;
          rate: number;
        }>;
        if (Array.isArray(parsedItems) && parsedItems.length > 0) {
          setPrefillLineItems(
            parsedItems.map(item => ({
              description: item.description || "",
              quantity: item.quantity || 1,
              rate: item.rate || 0,
            }))
          );
        }
      } catch (e) {
        if (import.meta.env.DEV) {
          console.error("Failed to parse line items from URL:", e);
        }
      }
    }
  }, [searchString]);

  const utils = trpc.useUtils();
  const createInvoice = trpc.invoices.create.useMutation({
    onSuccess: data => {
      toast.success("Invoice created successfully");
      utils.invoices.list.invalidate();
      setLocation(`/invoices/${data.id}`);
    },
    onError: error => {
      if (
        error.message?.includes("Monthly invoice limit reached") ||
        error.message?.includes("invoice limit")
      ) {
        setShowUpgradeDialog(true);
      } else {
        toast.error(error.message || "Failed to create invoice");
      }
    },
  });

  const { data: nextNumber } = trpc.invoices.getNextNumber.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const handleSubmit = async (
    data: InvoiceFormData,
    status: "draft" | "sent"
  ) => {
    createInvoice.mutate({
      ...data,
      status,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="opacity-70">
          <GearLoader size="md" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    window.location.href = getLoginUrl();
    return null;
  }

  const initialData = {
    currency: prefillCurrency,
    dueDate: prefillDueDate || undefined,
    notes: prefillNotes || undefined,
    lineItems:
      prefillLineItems.length > 0
        ? prefillLineItems.map(item => ({
            ...getEmptyLineItem(),
            description: item.description,
            quantity: item.quantity,
            rate: item.rate,
          }))
        : undefined,
  };

  return (
    <>
      <PageLayout
        narrow
        title="Create Invoice"
        subtitle="Fill in the details to create a new invoice"
      >
        <InvoiceForm
          mode="create"
          initialData={initialData}
          invoiceNumber={nextNumber || undefined}
          onSubmit={handleSubmit}
          onCancel={() => setLocation("/invoices")}
          isLoading={createInvoice.isPending}
          showPreview={showPreview}
          onPreviewChange={setShowPreview}
          previewData={
            user
              ? {
                  clientName: "Client Name",
                  companyName: user.companyName ?? undefined,
                  companyAddress: user.companyAddress ?? undefined,
                }
              : undefined
          }
        />
      </PageLayout>

      <InvoicePreviewModal
        open={showPreview}
        onClose={() => setShowPreview(false)}
        invoiceNumber={nextNumber || "INV-0001"}
        clientName={"Client Name"}
        issueDate={new Date()}
        dueDate={
          new Date(prefillDueDate || Date.now() + 30 * 24 * 60 * 60 * 1000)
        }
        lineItems={initialData.lineItems || [getEmptyLineItem()]}
        subtotal={0}
        discountAmount={0}
        taxAmount={0}
        total={0}
        notes={prefillNotes}
        paymentTerms="Net 30"
        companyName={user?.companyName ?? undefined}
        companyAddress={user?.companyAddress ?? undefined}
        templateId={undefined}
        onTemplateChange={() => {}}
      />

      <UpgradeDialog
        open={showUpgradeDialog}
        onOpenChange={setShowUpgradeDialog}
        reason="invoice_limit"
      />
    </>
  );
}
