"use client"

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Play, Square, Wifi, WifiOff } from "lucide-react";
import { config } from "@/config/websocket";

interface ConnectionControlsProps {
  isConnected: boolean;
  onConnect: (url: string) => void;
  onDisconnect: () => void;
  onProviderChange?: (provider: keyof typeof config.providers | "custom" | "") => void;
  className?: string;
}

export function ConnectionControls({
  isConnected,
  onConnect,
  onDisconnect,
  onProviderChange,
  className,
}: ConnectionControlsProps) {
  const [selectedProvider, setSelectedProvider] = useState<string>("");
  const [customUrl, setCustomUrl] = useState("");

  const handleProviderChange = (value: string) => {
    setSelectedProvider(value);
    if (value !== "custom") {
      setCustomUrl("");
    }
    onProviderChange?.(value as keyof typeof config.providers | "custom" | "");
  };

  const handleConnect = () => {
    const url = selectedProvider === "custom"
      ? customUrl
      : config.providers[selectedProvider]?.url;

    if (url) {
      onConnect(url);
    }
  };

  const status = isConnected
    ? { icon: <Wifi className="w-4 h-4" />, label: "Connected", color: "text-green-600" }
    : { icon: <WifiOff className="w-4 h-4" />, label: "Disconnected", color: "text-gray-600" };

  return (
    <div className={`p-4 space-y-4 border-b ${className}`}>
      <div className="flex items-center gap-2">
        <span className={`flex items-center gap-2 ${status.color}`}>
          {status.icon}
          <span className="text-sm font-medium">{status.label}</span>
        </span>
      </div>

      <div className="space-y-3">
        <div>
          <Label>WebSocket Provider</Label>
          <Select value={selectedProvider} onValueChange={handleProviderChange}>
            <SelectTrigger className="text-left">
              <SelectValue placeholder="Select a WebSocket provider" />
            </SelectTrigger>
            <SelectContent side="bottom">
              {Object.entries(config.providers).map(([key, provider]) => (
                <SelectItem key={key} value={key}>
                  <div>
                    <div className="font-medium">{provider.label}</div>
                    {provider.description && (
                      <div className="text-xs text-gray-500">{provider.description}</div>
                    )}
                  </div>
                </SelectItem>
              ))}
              <SelectItem value="custom">
                <div className="font-medium">Custom URL</div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {selectedProvider === "custom" && (
          <div>
            <Label>Custom WebSocket URL</Label>
            <Input
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder="wss://example.com/ws"
              className="font-mono"
            />
          </div>
        )}

        <div className="flex gap-2">
          <Button
            onClick={handleConnect}
            disabled={isConnected || (!customUrl && selectedProvider === "custom")}
            className="flex-1"
          >
            <Play className="w-4 h-4 mr-2" />
            Connect
          </Button>
          <Button
            onClick={onDisconnect}
            disabled={!isConnected}
            variant="outline"
            className="flex-1"
          >
            <Square className="w-4 h-4 mr-2" />
            Disconnect
          </Button>
        </div>
      </div>
    </div>
  );
}
