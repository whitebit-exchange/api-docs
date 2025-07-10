"use client";

import React, { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { ConnectionControls } from "./connection-controls";
import { MessageComposer } from "./message-composer";
import { MessageLog } from "./message-log";
import { config } from "@/config/websocket";
import { WebSocketProvider, WebSocketMessage } from "@/types/websocket";

interface PlaygroundProps {
  defaultProvider?: string;
  className?: string;
}

interface Message {
  type: "sent" | "received" | "error";
  data: string;
  timestamp: Date;
}

export function Playground({ defaultProvider, className }: PlaygroundProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<WebSocketProvider | null>(
    defaultProvider
      ? (Object.entries(config.providers).find(
          ([key]) => key === defaultProvider
        )?.[1] as WebSocketProvider)
      : null
  );
  const [customUrl, setCustomUrl] = useState("");

  const connect = useCallback(
    (url: string) => {
      if (ws) {
        ws.close();
      }

      try {
        const newWs = new WebSocket(url);

        newWs.onopen = () => {
          setIsConnected(true);
          setMessages((prev) => [
            ...prev,
            {
              type: "received",
              data: "Connected",
              timestamp: new Date(),
            },
          ]);
        };

        newWs.onclose = () => {
          setIsConnected(false);
          setMessages((prev) => [
            ...prev,
            {
              type: "received",
              data: "Disconnected",
              timestamp: new Date(),
            },
          ]);
        };

        newWs.onerror = (error) => {
          setMessages((prev) => [
            ...prev,
            {
              type: "error",
              data: "WebSocket error occurred",
              timestamp: new Date(),
            },
          ]);
        };

        newWs.onmessage = (event) => {
          setMessages((prev) => [
            ...prev,
            {
              type: "received",
              data: event.data,
              timestamp: new Date(),
            },
          ]);
        };

        setWs(newWs);
      } catch (error) {
        setMessages((prev) => [
          ...prev,
          {
            type: "error",
            data: `Failed to connect: ${error}`,
            timestamp: new Date(),
          },
        ]);
      }
    },
    [ws]
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
        setMessages((prev) => [
          ...prev,
          {
            type: "sent",
            data: message,
            timestamp: new Date(),
          },
        ]);
      }
    },
    [ws]
  );

  const clearLog = useCallback(() => {
    setMessages([]);
  }, []);

  useEffect(() => {
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [ws]);

  return (
    <Card className={cn("p-4 space-y-4", className)}>
      <ConnectionControls
        isConnected={isConnected}
        selectedProvider={selectedProvider}
        customUrl={customUrl}
        onProviderChange={setSelectedProvider}
        onCustomUrlChange={setCustomUrl}
        onConnect={() => connect(customUrl || selectedProvider?.url || "")}
        onDisconnect={disconnect}
      />
      <MessageComposer
        isConnected={isConnected}
        selectedProvider={selectedProvider}
        onSend={sendMessage}
      />
      <MessageLog messages={messages} onClearLog={clearLog} />
    </Card>
  );
}
