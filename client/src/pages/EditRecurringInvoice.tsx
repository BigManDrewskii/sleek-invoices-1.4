import { useState, useMemo, useEffect, useId } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useLocation, useParams } from "wouter";
import { ArrowLeft, Plus } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { ClientSelector } from "@/components/invoices/ClientSelector";
import { LineItemRow, LineItem } from "@/components/invoices/LineItemRow";
import { InvoiceFormCalculations } from "@/components/invoices/InvoiceFormCalculations";

interface RecurringLineItem {
  id: number;
  description: string;
  quantity: string;
  rate: string;
  sortOrder: number;
}

export default function EditRecurringInvoice() {
  const [, setLocation] = useLocation();
  const params = useParams();
  const recurringId = parseInt(params.id || "0");

  const [clientId, setClientId] = useState<number | undefined>();
  const [frequency, setFrequency] = useState<"weekly" | "monthly" | "yearly">(
    "monthly"
  );
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState("");
  const [invoiceNumberPrefix, setInvoiceNumberPrefix] = useState("INV");
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: crypto.randomUUID(), description: "", quantity: 1, rate: 0 },
  ]);
  const [taxRate, setTaxRate] = useState(0);
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">(
    "percentage"
  );
  const [discountValue, setDiscountValue] = useState(0);
  const [notes, setNotes] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("Net 30");

  const ids = {
    startDate: useId(),
    endDate: useId(),
    invoiceNumberPrefix: useId(),
    paymentTerms: useId(),
    notes: useId(),
  };

  const { data: recurringData, isLoading } =
    trpc.recurringInvoices.get.useQuery(
      { id: recurringId },
      { enabled: recurringId > 0 }
    );

  useEffect(() => {
    if (recurringData?.recurring) {
      const r = recurringData.recurring;
      setClientId(r.clientId);
      setFrequency(r.frequency as "weekly" | "monthly" | "yearly");
      setStartDate(
        r.startDate ? new Date(r.startDate).toISOString().split("T")[0] : ""
      );
      setEndDate(
        r.endDate ? new Date(r.endDate).toISOString().split("T")[0] : ""
      );
      setInvoiceNumberPrefix(r.invoiceNumberPrefix);
      setTaxRate(parseFloat(r.taxRate) || 0);
      setDiscountType(
        (r.discountType as "percentage" | "fixed") || "percentage"
      );
      setDiscountValue(parseFloat(r.discountValue) || 0);
      setNotes(r.notes || "");
      setPaymentTerms(r.paymentTerms || "Net 30");
    }
    if (recurringData?.lineItems && recurringData.lineItems.length > 0) {
      setLineItems(
        recurringData.lineItems.map((item: RecurringLineItem) => ({
          id: item.id.toString(),
          description: item.description,
          quantity: parseFloat(item.quantity) || 0,
          rate: parseFloat(item.rate) || 0,
        }))
      );
    }
  }, [recurringData]);

  const updateMutation = trpc.recurringInvoices.update.useMutation();

  const calculations = useMemo(() => {
    const subtotal = lineItems.reduce(
      (sum, item) => sum + item.quantity * item.rate,
      0
    );

    let discountAmount = 0;
    if (discountValue > 0) {
      if (discountType === "percentage") {
        discountAmount = (subtotal * discountValue) / 100;
      } else {
        discountAmount = discountValue;
      }
    }

    const afterDiscount = subtotal - discountAmount;
    const taxAmount = (afterDiscount * taxRate) / 100;
    const total = afterDiscount + taxAmount;

    return { subtotal, discountAmount, taxAmount, total };
  }, [lineItems, taxRate, discountType, discountValue]);

  const handleLineItemChange = (index: number, updatedItem: LineItem) => {
    const updated = [...lineItems];
    updated[index] = updatedItem;
    setLineItems(updated);
  };

  const handleRemoveLineItem = (index: number) => {
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const handleAddLineItem = () => {
    setLineItems([
      ...lineItems,
      { id: crypto.randomUUID(), description: "", quantity: 1, rate: 0 },
    ]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!clientId) {
      toast.error("Please select a client");
      return;
    }

    if (
      lineItems.some(
        item => !item.description || item.quantity <= 0 || item.rate <= 0
      )
    ) {
      toast.error("Please fill in all line items");
      return;
    }

    try {
      await updateMutation.mutateAsync({
        id: recurringId,
        clientId,
        frequency,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : undefined,
        invoiceNumberPrefix,
        lineItems: lineItems.map(item => ({
          description: item.description,
          quantity: item.quantity,
          rate: item.rate,
        })),
        taxRate,
        discountType,
        discountValue,
        notes,
        paymentTerms,
      });

      toast.success("Recurring invoice updated successfully!");
      setLocation("/recurring-invoices");
    } catch (error) {
      toast.error("Failed to update recurring invoice");
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <PageLayout title="Loading...">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-2">
              Loading recurring invoice...
            </p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!recurringData?.recurring) {
    return (
      <PageLayout title="Not Found">
        <div className="flex items-center justify-center py-12">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Recurring Invoice Not Found</CardTitle>
              <CardDescription>
                The recurring invoice you are trying to edit does not exist or
                has been deleted.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => setLocation("/recurring-invoices")}
                className="w-full"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Recurring Invoices
              </Button>
            </CardContent>
          </Card>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Edit Recurring Invoice"
      subtitle="Update your recurring invoice settings"
      narrow
      headerActions={
        <Button
          variant="ghost"
          onClick={() => setLocation("/recurring-invoices")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Schedule Settings</CardTitle>
            <CardDescription>
              Configure how often this invoice should be generated and sent
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={ids.invoiceNumberPrefix}>
                  Invoice Number Prefix
                </Label>
                <Input
                  id={ids.invoiceNumberPrefix}
                  value={invoiceNumberPrefix}
                  onChange={e => setInvoiceNumberPrefix(e.target.value)}
                  placeholder="INV"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Select
                  value={frequency}
                  onValueChange={(v: "weekly" | "monthly" | "yearly") =>
                    setFrequency(v)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={ids.startDate}>Start Date</Label>
                <Input
                  id={ids.startDate}
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={ids.endDate}>End Date (Optional)</Label>
                <Input
                  id={ids.endDate}
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={ids.paymentTerms}>Payment Terms</Label>
                <Input
                  id={ids.paymentTerms}
                  value={paymentTerms}
                  onChange={e => setPaymentTerms(e.target.value)}
                  placeholder="Net 30"
                />
              </div>

              <ClientSelector
                value={clientId ?? null}
                onChange={v => setClientId(v ?? undefined)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Line Items</CardTitle>
                <CardDescription>
                  Products or services to include on each invoice
                </CardDescription>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddLineItem}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {lineItems.map((item, index) => (
                <LineItemRow
                  key={item.id}
                  item={item}
                  onChange={updatedItem =>
                    handleLineItemChange(index, updatedItem)
                  }
                  onDelete={() => handleRemoveLineItem(index)}
                  canDelete={lineItems.length > 1}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Totals</CardTitle>
            <CardDescription>
              Tax, discounts, and calculations for each invoice
            </CardDescription>
          </CardHeader>
          <CardContent>
            <InvoiceFormCalculations
              subtotal={calculations.subtotal}
              taxRate={taxRate}
              onTaxRateChange={setTaxRate}
              discountType={discountType}
              onDiscountTypeChange={setDiscountType}
              discountValue={discountValue}
              onDiscountValueChange={setDiscountValue}
              discountAmount={calculations.discountAmount}
              taxAmount={calculations.taxAmount}
              total={calculations.total}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Additional Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={ids.notes}>Notes</Label>
              <Textarea
                id={ids.notes}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Additional notes to include on the invoice..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" disabled={updateMutation.isPending}>
            {updateMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setLocation("/recurring-invoices")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </PageLayout>
  );
}
