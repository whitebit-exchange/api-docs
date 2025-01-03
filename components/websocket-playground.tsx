"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

const PING_INTERVAL = 50000; // 50 seconds

type Method = { name: string; description: string };
type MethodGroup = { label: string; methods: Method[] };
type MethodGroups = Record<string, MethodGroup>;

const METHOD_GROUPS: MethodGroups = {
  service: {
    label: "Service Methods",
    methods: [
      { name: "ping", description: "Check server connection" },
      { name: "time", description: "Get server time" }
    ]
  },
  candles: {
    label: "Candles Methods",
    methods: [
      { name: "candles_request", description: "Get historical kline/candlestick data" },
      { name: "candles_subscribe", description: "Subscribe to real-time candlestick updates" },
      { name: "candles_unsubscribe", description: "Unsubscribe from candlestick updates" }
    ]
  },
  price: {
    label: "Market Price Methods",
    methods: [
      { name: "lastprice_request", description: "Get latest price for a market" },
      { name: "lastprice_subscribe", description: "Subscribe to real-time price updates" },
      { name: "lastprice_unsubscribe", description: "Unsubscribe from price updates" }
    ]
  },
  stats: {
    label: "Market Statistics Methods",
    methods: [
      { name: "market_request", description: "Get 24h market statistics" },
      { name: "market_subscribe", description: "Subscribe to market statistics updates" },
      { name: "market_unsubscribe", description: "Unsubscribe from market statistics" },
      { name: "marketToday_query", description: "Get current day UTC market statistics" },
      { name: "marketToday_subscribe", description: "Subscribe to current day market updates" },
      { name: "marketToday_unsubscribe", description: "Unsubscribe from current day updates" }
    ]
  },
  trades: {
    label: "Trade Methods",
    methods: [
      { name: "trades_request", description: "Get recent trades for a market" },
      { name: "trades_subscribe", description: "Subscribe to real-time trade updates" },
      { name: "trades_unsubscribe", description: "Unsubscribe from trade updates" }
    ]
  },
  depth: {
    label: "Depth Methods",
    methods: [
      { name: "depth_request", description: "Get order book for a market" },
      { name: "depth_subscribe", description: "Subscribe to order book updates" },
      { name: "depth_unsubscribe", description: "Unsubscribe from order book updates" }
    ]
  }
} as const;

// Create a type for all available methods
type AvailableMethod = typeof METHOD_GROUPS[keyof typeof METHOD_GROUPS]["methods"][number]["name"];

export function WebSocketPlayground() {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [method, setMethod] = useState<AvailableMethod | "">("");
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
          <Select
            value={method}
            onValueChange={setMethod}
            disabled={!connected}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a method" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {Object.entries(METHOD_GROUPS).map(([key, group]) => (
                <SelectGroup key={key}>
                  <SelectLabel>{group.label}</SelectLabel>
                  {group.methods.map((m) => (
                    <SelectItem key={m.name} value={m.name}>
                      {m.name} - {m.description}
                    </SelectItem>
                  ))}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
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
