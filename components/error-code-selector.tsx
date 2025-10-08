import React, { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ErrorCode {
  code: number;
  message: string;
  field: string;
  description: string;
}

interface ErrorCodeSelectorProps {
  errorCodes: ErrorCode[];
  title?: string;
  className?: string;
}

export function ErrorCodeSelector({ 
  errorCodes, 
  title = "Error Code Reference",
  className 
}: ErrorCodeSelectorProps) {
  const [selectedCode, setSelectedCode] = useState<string>("");

  const selectedError = errorCodes.find(error => error.code.toString() === selectedCode);

  return (
    <div className={`space-y-4 ${className || ''}`}>
      <div className="border rounded-lg bg-card">
        <div className="px-4 py-3 border-b bg-muted/50">
          <h4 className="text-sm font-semibold text-foreground">{title}</h4>
        </div>
        
        <div className="p-4 space-y-4">
          <Select value={selectedCode} onValueChange={setSelectedCode}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose an error code to view details" />
            </SelectTrigger>
            <SelectContent side="bottom" align="start" className="max-h-80 overflow-y-auto">
              {errorCodes.map((error) => (
                <SelectItem key={error.code} value={error.code.toString()}>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-medium text-muted-foreground w-8">
                      {error.code}
                    </span>
                    <span className="text-sm">{error.message}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedError && (
            <div className="space-y-3">
              <div className="text-sm font-medium text-foreground">Error Response:</div>
              <div className="bg-muted/50 rounded-md p-4 border">
                <pre className="text-sm font-mono text-foreground whitespace-pre-wrap">
{`{
  "code": ${selectedError.code},
  "message": "${selectedError.message}",
  "errors": {
    "${selectedError.field}": ["${selectedError.description}"]
  }
}`}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
