import { useEffect, useState } from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogBody } from "@/components/shared/DialogPatterns";
import { workerSrc } from "@/lib/pdfjsWorker";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { FileText, Loader2 } from "lucide-react";

interface PDFViewerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pdfUrl: string;
  fileName?: string;
}

export function PDFViewerModal({
  open,
  onOpenChange,
  pdfUrl,
  fileName,
}: PDFViewerModalProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  useEffect(() => {
    if (open) {
      setIsLoading(true);
      setError(null);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[95vh] h-[90vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-5 md:px-7 pt-5 md:pt-6 pb-3 shrink-0 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-base">PDF Preview</DialogTitle>
                <DialogDescription className="text-xs">
                  {fileName || "Invoice PDF document"}
                </DialogDescription>
              </div>
            </div>
          </div>
        </DialogHeader>

        <DialogBody className="flex-1 overflow-hidden p-0" spacing="compact">
          <div className="h-full flex flex-col">
            <Worker workerUrl={workerSrc as unknown as string}>
              <Viewer
                fileUrl={pdfUrl}
                plugins={[defaultLayoutPluginInstance]}
                onDocumentLoad={() => {
                  setIsLoading(false);
                }}
                theme="light"
              />
            </Worker>
          </div>
        </DialogBody>

        {isLoading && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Loading PDF...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 bg-background/90 flex items-center justify-center z-10">
            <div className="flex flex-col items-center gap-3 text-center px-4">
              <div className="p-3 rounded-full bg-destructive/10">
                <FileText className="h-6 w-6 text-destructive" />
              </div>
              <p className="text-sm text-destructive font-medium">{error}</p>
              <p className="text-xs text-muted-foreground">
                Please try downloading the PDF instead
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
