import { useState, useMemo, useId } from "react";
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
import { useLocation } from "wouter";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { ClientSelector } from "@/components/invoices/ClientSelector";
import { LineItemRow, LineItem } from "@/components/invoices/LineItemRow";
import { InvoiceFormCalculations } from "@/components/invoices/InvoiceFormCalculations";

export default function CreateRecurringInvoice() {
  const [, setLocation] = useLocation();
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

  // Form field IDs
  const ids = {
    invoiceNumberPrefix: useId(),
    startDate: useId(),
    endDate: useId(),
    paymentTerms: useId(),
    notes: useId(),
  };

  const createMutation = trpc.recurringInvoices.create.useMutation();

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

  const handleAddLineItem = () => {
    setLineItems([
      ...lineItems,
      { id: crypto.randomUUID(), description: "", quantity: 1, rate: 0 },
    ]);
  };

  const handleRemoveLineItem = (index: number) => {
    if (lineItems.length === 1) {
      toast.error("At least one line item is required");
      return;
    }
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const handleLineItemChange = (index: number, item: LineItem) => {
    const updated = [...lineItems];
    updated[index] = item;
    setLineItems(updated);
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
      await createMutation.mutateAsync({
        clientId,
        frequency,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : undefined,
        invoiceNumberPrefix,
        lineItems: lineItems.map(({ id, ...item }) => item),
        taxRate,
        discountType,
        discountValue,
        notes,
        paymentTerms,
      });

      toast.success("Recurring invoice created successfully");
      setLocation("/recurring-invoices");
    } catch (error) {
      toast.error("Failed to create recurring invoice");
    }
  };

  return (
    <PageLayout
      title="Create Recurring Invoice"
      subtitle="Set up automatic invoice generation"
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
                <Label htmlFor="frequency">Frequency</Label>
                <Select
                  value={frequency}
                  onValueChange={(v: any) => setFrequency(v)}
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
                  placeholder="Leave blank for no end date"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Client</CardTitle>
            <CardDescription>
              Select the client who will receive these recurring invoices
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ClientSelector
              value={clientId ?? null}
              onChange={v => setClientId(v ?? undefined)}
            />
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
            <div className="hidden md:grid grid-cols-12 gap-4 text-sm font-medium text-muted-foreground pb-2 border-b">
              <div className="col-span-5">Description</div>
              <div className="col-span-2">Quantity</div>
              <div className="col-span-2">Rate</div>
              <div className="col-span-2 text-right">Amount</div>
              <div className="col-span-1"></div>
            </div>

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
            <CardTitle>Additional Information</CardTitle>
            <CardDescription>
              Payment terms and notes to include on each invoice
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={ids.paymentTerms}>Payment Terms</Label>
              <Input
                id={ids.paymentTerms}
                value={paymentTerms}
                onChange={e => setPaymentTerms(e.target.value)}
                placeholder="Net 30"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={ids.notes}>Notes</Label>
              <Textarea
                id={ids.notes}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Additional notes for the invoice..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3 pt-4">
          <Button type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending
              ? "Creating..."
              : "Create Recurring Invoice"}
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
