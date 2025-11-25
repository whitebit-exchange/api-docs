"use client";

import React, { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { ConnectionControls } from "./connection-controls";
import { MessageComposer } from "./message-composer";
import { MessageLog } from "./message-log";
import { config } from "@/config/websocket";
import { WebSocketProvider } from "@/types/websocket";
import { RegionSelector } from "@/components/region-selector";

interface PlaygroundProps {
  defaultProvider?: string;
  className?: string;
}

interface Message {
  id: string;
  type: "sent" | "received" | "error";
  data: string;
  timestamp: Date;
}

export function Playground({ defaultProvider, className }: PlaygroundProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [autoScroll, setAutoScroll] = useState(true);
  const [selectedProviderKey, setSelectedProviderKey] = useState<string>("");
  const [selectedProvider, setSelectedProvider] = useState<WebSocketProvider | null>(
    defaultProvider && config.providers[defaultProvider]
      ? config.providers[defaultProvider]
      : null
  );
  const [customUrl, setCustomUrl] = useState("");

  const addMessage = useCallback((type: Message["type"], data: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        type,
        data,
        timestamp: new Date(),
      },
    ]);
  }, []);

  const connect = useCallback(
    (url: string) => {
      if (ws) {
        ws.close();
      }

      try {
        const newWs = new WebSocket(url);

        newWs.onopen = () => {
          setIsConnected(true);
          addMessage("received", "Connected");
        };

        newWs.onclose = () => {
          setIsConnected(false);
          addMessage("received", "Disconnected");
        };

        newWs.onerror = () => {
          addMessage("error", "WebSocket error occurred");
        };

        newWs.onmessage = (event) => {
          addMessage("received", event.data);
        };

        setWs(newWs);
      } catch (error) {
        addMessage("error", `Failed to connect: ${error}`);
      }
    },
    [ws, addMessage]
  );

  const disconnect = useCallback(() => {
    if (ws) {
      ws.close();
      setWs(null);
    }
  }, [ws]);

  const sendMessage = useCallback(
    (message: string) => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(message);
        addMessage("sent", message);
      }
    },
    [ws, addMessage]
  );

  const clearLog = useCallback(() => {
    setMessages([]);
  }, []);

  const handleProviderChange = useCallback((providerId: string) => {
    setSelectedProviderKey(providerId);
    if (providerId && providerId !== "custom" && config.providers[providerId]) {
      setSelectedProvider(config.providers[providerId]);
    } else {
      setSelectedProvider(null);
    }
  }, []);

  const handleCopy = useCallback((message: string) => {
    navigator.clipboard.writeText(message);
  }, []);

  useEffect(() => {
    if (defaultProvider && config.providers[defaultProvider]) {
      handleProviderChange(defaultProvider);
    }
  }, [defaultProvider, handleProviderChange]);

  useEffect(() => {
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [ws]);

  return (
    <Card className={cn("p-4 space-y-4", className)}>
      <div className="flex items-center justify-between mb-2">
        <RegionSelector showLabel={true} />
      </div>
      <ConnectionControls
        isConnected={isConnected}
        selectedProvider={selectedProviderKey}
        customUrl={customUrl}
        onProviderChange={handleProviderChange}
        onCustomUrlChange={setCustomUrl}
        onConnect={() => connect(customUrl || selectedProvider?.url || "")}
        onDisconnect={disconnect}
      />
      <MessageComposer
        isConnected={isConnected}
        selectedProvider={selectedProvider}
        onSend={sendMessage}
      />
      <MessageLog
        messages={messages}
        autoScroll={autoScroll}
        onAutoScrollChange={setAutoScroll}
        onClear={clearLog}
        onCopy={handleCopy}
      />
    </Card>
  );
}
