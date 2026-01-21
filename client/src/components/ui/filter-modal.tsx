import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FilterField {
  key: string;
  label: string;
  type: "select" | "text" | "number";
  options?: { value: string; label: string }[];
  placeholder?: string;
}

interface FilterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  fields: FilterField[];
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
  onClear: () => void;
}

function FilterFieldInput({
  field,
  value,
  onChange,
}: {
  field: FilterField;
  value: string;
  onChange: (key: string, value: string) => void;
}) {
  if (field.type === "select") {
    return (
      <div className="space-y-2">
        <label
          htmlFor={field.key}
          className="text-xs font-medium text-muted-foreground block ml-0.5"
        >
          {field.label}
        </label>
        <Select value={value} onValueChange={val => onChange(field.key, val)}>
          <SelectTrigger id={field.key}>
            <SelectValue placeholder={field.placeholder} />
          </SelectTrigger>
          <SelectContent>
            {field.options?.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  if (field.type === "number") {
    return (
      <div className="space-y-2">
        <label
          htmlFor={field.key}
          className="text-xs font-medium text-muted-foreground block ml-0.5"
        >
          {field.label}
        </label>
        <Input
          id={field.key}
          type="number"
          placeholder={field.placeholder}
          value={value}
          onChange={e => onChange(field.key, e.target.value)}
          className="h-10"
        />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label
        htmlFor={field.key}
        className="text-xs font-medium text-muted-foreground block ml-0.5"
      >
        {field.label}
      </label>
      <Input
        id={field.key}
        type="text"
        placeholder={field.placeholder}
        value={value}
        onChange={e => onChange(field.key, e.target.value)}
        className="h-10"
      />
    </div>
  );
}

export function FilterModal({
  open,
  onOpenChange,
  title = "Filters",
  fields,
  values,
  onChange,
  onClear,
}: FilterModalProps) {
  const handleClear = React.useCallback(() => {
    onClear();
  }, [onClear]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl flex items-center gap-3">
            <span>{title}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5 py-2 max-h-[60vh] overflow-y-auto">
          {fields.map(field => (
            <div
              key={field.key}
              className={cn(field.type === "text" ? "sm:col-span-2" : "")}
            >
              <FilterFieldInput
                field={field}
                value={values[field.key] ?? ""}
                onChange={onChange}
              />
            </div>
          ))}
        </div>

        <DialogFooter className="flex-row justify-end gap-3 pt-6 px-0 border-t">
          <Button variant="outline" onClick={handleClear}>
            <X className="h-4 w-4 mr-2" />
            Clear All
          </Button>
          <Button onClick={() => onOpenChange(false)}>Apply Filters</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
