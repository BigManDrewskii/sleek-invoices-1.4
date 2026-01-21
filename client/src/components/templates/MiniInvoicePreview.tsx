/**
 * Mini Invoice Preview Component
 *
 * A compact, scaled-down invoice preview for template cards.
 * Shows the actual invoice structure with template styling applied.
 */

interface MiniInvoicePreviewProps {
  template: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    headingFont: string;
    bodyFont: string;
    templateType: string;
  };
}

export function MiniInvoicePreview({ template }: MiniInvoicePreviewProps) {
  return (
    <div
      className="w-full aspect-[8.5/11] bg-white rounded-md overflow-hidden shadow-inner"
      style={{
        fontFamily: template.bodyFont,
        fontSize: "4px",
      }}
    >
      {/* Scaled invoice preview */}
      <div className="p-3 h-full flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-start mb-2">
          <div
            className="w-8 h-3 rounded-sm"
            style={{ backgroundColor: template.primaryColor + "20" }}
          />
          <div className="text-right">
            <div
              className="font-bold text-[6px] tracking-tight"
              style={{
                color: template.primaryColor,
                fontFamily: template.headingFont,
              }}
            >
              INVOICE
            </div>
            <div
              className="text-[3px] mt-0.5"
              style={{ color: template.secondaryColor }}
            >
              #INV-001
            </div>
          </div>
        </div>

        {/* Divider */}
        <div
          className="h-px w-full mb-2"
          style={{ backgroundColor: template.primaryColor + "30" }}
        />

        {/* From / To */}
        <div className="flex gap-2 mb-2">
          <div className="flex-1">
            <div
              className="text-[3px] font-semibold mb-0.5"
              style={{
                color: template.primaryColor,
                fontFamily: template.headingFont,
              }}
            >
              From
            </div>
            <div className="space-y-px">
              <div className="h-1 w-10 rounded-sm bg-gray-200" />
              <div className="h-1 w-8 rounded-sm bg-gray-100" />
            </div>
          </div>
          <div className="flex-1">
            <div
              className="text-[3px] font-semibold mb-0.5"
              style={{
                color: template.primaryColor,
                fontFamily: template.headingFont,
              }}
            >
              Bill To
            </div>
            <div className="space-y-px">
              <div className="h-1 w-10 rounded-sm bg-gray-200" />
              <div className="h-1 w-8 rounded-sm bg-gray-100" />
            </div>
          </div>
        </div>

        {/* Table Header */}
        <div
          className="flex gap-1 py-1.5 border-b mb-1"
          style={{ borderColor: template.primaryColor }}
        >
          <div
            className="flex-1 text-[3px] font-semibold"
            style={{ color: template.primaryColor }}
          >
            Description
          </div>
          <div
            className="w-4 text-[3px] text-right font-semibold"
            style={{ color: template.primaryColor }}
          >
            Qty
          </div>
          <div
            className="w-6 text-[3px] text-right font-semibold"
            style={{ color: template.primaryColor }}
          >
            Rate
          </div>
          <div
            className="w-6 text-[3px] text-right font-semibold"
            style={{ color: template.primaryColor }}
          >
            Amt
          </div>
        </div>

        {/* Table Rows */}
        <div className="flex-1 space-y-1">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex gap-1 items-center">
              <div className="flex-1 h-1 rounded-sm bg-gray-100" />
              <div className="w-4 h-1 rounded-sm bg-gray-50" />
              <div className="w-6 h-1 rounded-sm bg-gray-50" />
              <div className="w-6 h-1 rounded-sm bg-gray-100" />
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="flex justify-end mt-auto pt-2">
          <div className="w-16 space-y-0.5">
            <div className="flex justify-between">
              <span
                className="text-[3px]"
                style={{ color: template.secondaryColor }}
              >
                Subtotal
              </span>
              <span
                className="text-[3px]"
                style={{ color: template.secondaryColor }}
              >
                $200
              </span>
            </div>
            <div className="flex justify-between">
              <span
                className="text-[3px]"
                style={{ color: template.accentColor }}
              >
                Discount
              </span>
              <span
                className="text-[3px]"
                style={{ color: template.accentColor }}
              >
                -$20
              </span>
            </div>
            <div
              className="flex justify-between pt-0.5 border-t font-semibold"
              style={{
                borderColor: template.primaryColor,
                color: template.primaryColor,
              }}
            >
              <span className="text-[4px]">Total</span>
              <span className="text-[4px]">$180</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
