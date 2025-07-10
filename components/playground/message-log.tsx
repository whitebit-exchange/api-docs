"use client";

import React, { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WebSocketMessage } from "@/types/websocket";
import { Wifi, Trash2, Copy } from "lucide-react";

interface MessageLogProps {
  messages: WebSocketMessage[];
  autoScroll: boolean;
  onAutoScrollChange: (value: boolean) => void;
  onClear: () => void;
  onCopy: (message: string) => void;
  className?: string;
}

export function MessageLog({
  messages,
  autoScroll,
  onAutoScrollChange,
  onClear,
  onCopy,
  className,
}: MessageLogProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, autoScroll]);

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleTimeString();
  };

  const formatSize = (size: number) => {
    if (size < 1024) return `${size}B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)}KB`;
    return `${(size / (1024 * 1024)).toFixed(1)}MB`;
  };

  return (
    <div className={cn("w-1/2 flex flex-col", className)}>
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">Message Log</h4>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={autoScroll}
                onChange={(e) => onAutoScrollChange(e.target.checked)}
                className="rounded"
              />
              Auto-scroll
            </label>
            <Button onClick={onClear} variant="outline" size="sm">
              <Trash2 className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {messages.length} message{messages.length !== 1 ? "s" : ""}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <Wifi className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No messages yet</p>
              <p className="text-xs">Connect to a WebSocket server to see messages</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`p-3 rounded-lg border text-sm ${
                  message.type === "sent"
                    ? "bg-blue-50 border-blue-200"
                    : message.type === "received"
                    ? "bg-green-50 border-green-200"
                    : message.type === "connection"
                    ? "bg-gray-50 border-gray-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        message.type === "sent"
                          ? "bg-blue-100 text-blue-800"
                          : message.type === "received"
                          ? "bg-green-100 text-green-800"
                          : message.type === "connection"
                          ? "bg-gray-100 text-gray-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {message.type.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-gray-500">{formatTimestamp(message.timestamp)}</span>
                    {message.size && (
                      <span className="text-xs text-gray-500">{formatSize(message.size)}</span>
                    )}
                  </div>
                  <Button
                    onClick={() => onCopy(message.data)}
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
                <pre className="whitespace-pre-wrap break-all text-xs font-mono">{message.data}</pre>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
    </div>
  );
}
