"use client";

import { useState, useCallback } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { WebSocketProvider } from "@/types/websocket";

interface MessageComposerProps {
  selectedProvider: WebSocketProvider | null;
  isConnected: boolean;
  onSend: (message: string) => void;
  className?: string;
}

export function MessageComposer({
  selectedProvider,
  isConnected,
  onSend,
  className,
}: MessageComposerProps) {
  const [payload, setPayload] = useState("");
  const hasSamples = selectedProvider?.samples && selectedProvider.samples.length > 0;

  // Handle JSON paste with cleanup
  const handleJsonPaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text");
    // Remove comments and trailing commas from JSON
    const cleanJson = text
      // Remove single-line comments
      .replace(/\/\/.*$/gm, "")
      // Remove multi-line comments
      .replace(/\/\*[\s\S]*?\*\//g, "")
      // Remove trailing commas
      .replace(/,(\s*[}\]])/g, "$1")
      // Remove whitespace
      .trim();
    try {
      // Verify it's valid JSON and format it
      const parsed = JSON.parse(cleanJson);
      setPayload(JSON.stringify(parsed, null, 2));
    } catch {
      // If not valid JSON, just paste the cleaned text
      setPayload(cleanJson);
    }
  };

  const handleSend = useCallback(() => {
    if (payload.trim()) {
      onSend(payload);
    }
  }, [onSend, payload]);

  const handleClear = useCallback(() => {
    setPayload("");
  }, []);

  const handleSampleSelect = useCallback((value: string) => {
    setPayload(value);
  }, []);

  return (
    <div className={`flex flex-col ${className}`}>
      {hasSamples && selectedProvider?.samples && (
        <div className="flex-none p-4 border-b">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium">Sample Messages</h4>
            <Select onValueChange={handleSampleSelect}>
              <SelectTrigger className="w-80">
                <SelectValue placeholder="Load sample" />
              </SelectTrigger>
              <SelectContent>
                {selectedProvider.samples.map((sample) => (
                  <SelectItem key={sample.label} value={sample.payload}>
                    <div className="font-medium">{sample.label}</div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col p-4 min-h-0">
        <Label htmlFor="payload" className="flex-none mb-2">
          Message Payload
        </Label>
        <Textarea
          id="payload"
          value={payload}
          onChange={(e) => setPayload(e.target.value)}
          onPaste={handleJsonPaste}
          placeholder="Enter your WebSocket message here..."
          className="flex-1 font-mono text-sm resize-none min-h-0 h-full"
        />
        <div className="flex-none flex gap-2 mt-3">
          <Button onClick={handleSend} disabled={!isConnected} className="flex-1">
            <Send className="w-4 h-4 mr-2" />
            Send Message
          </Button>
          <Button onClick={handleClear} variant="outline">
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
}
