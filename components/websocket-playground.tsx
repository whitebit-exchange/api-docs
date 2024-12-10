"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const PING_INTERVAL = 50000; // 50 seconds

export function WebSocketPlayground() {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [method, setMethod] = useState("");
  const [params, setParams] = useState("");
  const [websocketUrl, setWebsocketUrl] = useState("wss://api.whitebit.com/ws");
  const socketRef = useRef<WebSocket | null>(null);
  const pingIntervalRef = useRef<number>();
  const messageIdRef = useRef(0);

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
      }
    };
  }, []);

  const addMessage = (message: string) => {
    setMessages((prev) => [...prev, `${new Date().toISOString()} ${message}`]);
  };

  const startPingInterval = () => {
    pingIntervalRef.current = window.setInterval(() => {
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        const pingMessage = {
          id: messageIdRef.current++,
          method: "ping",
          params: [],
        };
        socketRef.current.send(JSON.stringify(pingMessage));
        addMessage(`Sent ping: ${JSON.stringify(pingMessage)}`);
      }
    }, PING_INTERVAL);
  };

  const connect = () => {
    if (socketRef.current) {
      socketRef.current.close();
    }

    try {
      const socket = new WebSocket(websocketUrl);
      socketRef.current = socket;

      socket.onopen = () => {
        setConnected(true);
        addMessage("Connected to WhiteBit WebSocket server");
        startPingInterval();
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          addMessage(`Received: ${JSON.stringify(data, null, 2)}`);
        } catch (e) {
          addMessage(`Received raw: ${event.data}`);
        }
      };

      socket.onclose = () => {
        setConnected(false);
        addMessage("Disconnected from WebSocket server");
        if (pingIntervalRef.current) {
          clearInterval(pingIntervalRef.current);
        }
      };

      socket.onerror = (error) => {
        addMessage(`Error: ${error.type}`);
      };
    } catch (error) {
      addMessage(`Error: ${error}`);
    }
  };

  const disconnect = () => {
    if (socketRef.current) {
      socketRef.current.close();
    }
  };

  const sendMessage = () => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      try {
        const message = {
          id: messageIdRef.current++,
          method: method.trim(),
          params: params.trim() ? JSON.parse(params) : [],
        };
        socketRef.current.send(JSON.stringify(message));
        addMessage(`Sent: ${JSON.stringify(message, null, 2)}`);
      } catch (error) {
        addMessage(`Error preparing message: ${error}`);
      }
    } else {
      addMessage("Error: WebSocket is not connected");
    }
  };

  return (
    <div className="space-y-4 mt-6">
      <div className="space-y-2">
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <Label htmlFor="websocketUrl">WebSocket URL</Label>
            <Input
              id="websocketUrl"
              placeholder="Enter WebSocket URL"
              value={websocketUrl}
              onChange={(e) => setWebsocketUrl(e.target.value)}
              disabled={connected}
            />
          </div>
          <Button
            onClick={connected ? disconnect : connect}
            variant={connected ? "destructive" : "default"}
          >
            {connected ? "Disconnect" : "Connect"}
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <div>
          <Label htmlFor="method">Method</Label>
          <Input
            id="method"
            placeholder="Enter method (e.g., ping, time, kline)"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            disabled={!connected}
          />
        </div>

        <div>
          <Label htmlFor="params">Parameters (JSON array)</Label>
          <Input
            id="params"
            placeholder='e.g., ["BTC_USDT", "1h"] or leave empty for no params'
            value={params}
            onChange={(e) => setParams(e.target.value)}
            disabled={!connected}
          />
        </div>

        <Button onClick={sendMessage} disabled={!connected || !method.trim()}>
          Send
        </Button>
      </div>

      <div>
        <Label htmlFor="messages">Messages</Label>
        <Textarea
          id="messages"
          readOnly
          value={messages.join("\n")}
          className="h-96 font-mono text-sm"
        />
      </div>
    </div>
  );
}
