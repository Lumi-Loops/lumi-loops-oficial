"use client";

import * as React from "react";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type InputTagsProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange"
> & {
  value: string[];
  onChange: (value: string[]) => void;
  maxTags?: number;
};

const InputTags = React.forwardRef<HTMLInputElement, InputTagsProps>(
  ({ className, value, onChange, maxTags = 10, ...props }, ref) => {
    const [pendingValue, setPendingValue] = React.useState("");

    // Handle comma-separated paste
    React.useEffect(() => {
      if (pendingValue.includes(",")) {
        const newValues = pendingValue
          .split(",")
          .map((v) => v.trim())
          .filter((v) => v.length > 0);

        const uniqueValues = Array.from(
          new Set([...value, ...newValues])
        ).slice(0, maxTags);

        onChange(uniqueValues);
        setPendingValue("");
      }
    }, [pendingValue, onChange, value, maxTags]);

    const addPendingValue = () => {
      if (pendingValue && value.length < maxTags) {
        const trimmed = pendingValue.trim();
        if (trimmed && !value.includes(trimmed)) {
          onChange([...value, trimmed]);
        }
        setPendingValue("");
      }
    };

    const removeValue = (valueToRemove: string) => {
      onChange(value.filter((v) => v !== valueToRemove));
    };

    return (
      <div>
        {/* Input with Add button */}
        <div className="flex gap-2">
          <input
            ref={ref}
            type="text"
            className={cn(
              "border-input bg-background focus:ring-ring flex-1 rounded-lg border px-4 py-2 transition-all focus:border-transparent focus:ring-2 focus:outline-none",
              className
            )}
            value={pendingValue}
            onChange={(e) => setPendingValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addPendingValue();
              } else if (
                e.key === "Backspace" &&
                pendingValue.length === 0 &&
                value.length > 0
              ) {
                e.preventDefault();
                onChange(value.slice(0, -1));
              }
            }}
            disabled={value.length >= maxTags}
            {...props}
          />
          <Button
            type="button"
            onClick={addPendingValue}
            disabled={!pendingValue.trim() || value.length >= maxTags}
            size="default"
            className="px-4"
          >
            Add
          </Button>
        </div>

        {/* Tags display */}
        {value.length > 0 && (
          <div className="border-input bg-muted/30 mt-3 flex min-h-[2.5rem] flex-wrap gap-2 rounded-lg border p-3">
            {value.map((item, idx) => (
              <Badge
                key={idx}
                variant="secondary"
                className="gap-1 pr-1 text-sm"
              >
                <span className="max-w-[200px] truncate">{item}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 hover:bg-transparent"
                  onClick={() => removeValue(item)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        )}

        {/* Counter */}
        <p className="text-muted-foreground mt-2 text-xs">
          {value.length} / {maxTags} URLs added
        </p>
      </div>
    );
  }
);

InputTags.displayName = "InputTags";

export { InputTags };
