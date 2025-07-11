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
    <div className={cn("w-1/2 flex flex-col bg-card text-card-foreground", className)}>
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-foreground">Message Log</h4>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={autoScroll}
                onChange={(e) => onAutoScrollChange(e.target.checked)}
                className="rounded border-border text-primary bg-card"
              />
              Auto-scroll
            </label>
            <Button onClick={onClear} variant="outline" size="sm" className="border-border hover:bg-accent hover:text-accent-foreground">
              <Trash2 className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          {messages.length} message{messages.length !== 1 ? "s" : ""}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
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
                    ? "bg-blue-500/10 border-blue-500/20 dark:bg-blue-500/5"
                    : message.type === "received"
                    ? "bg-green-500/10 border-green-500/20 dark:bg-green-500/5"
                    : message.type === "connection"
                    ? "bg-background border-border"
                    : "bg-red-500/10 border-red-500/20 dark:bg-red-500/5"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        message.type === "sent"
                          ? "border-blue-500/50 text-blue-600 dark:text-blue-400"
                          : message.type === "received"
                          ? "border-green-500/50 text-green-600 dark:text-green-400"
                          : message.type === "connection"
                          ? "border-border text-muted-foreground"
                          : "border-red-500/50 text-red-600 dark:text-red-400"
                      }`}
                    >
                      {message.type.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{formatTimestamp(message.timestamp)}</span>
                    {message.size && (
                      <span className="text-xs text-muted-foreground">{formatSize(message.size)}</span>
                    )}
                  </div>
                  <Button
                    onClick={() => onCopy(message.data)}
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 hover:bg-accent hover:text-accent-foreground"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
                <pre className="whitespace-pre-wrap break-all text-xs font-mono text-card-foreground">{message.data}</pre>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
    </div>
  );
}
