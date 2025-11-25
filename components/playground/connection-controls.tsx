"use client"

import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Play, Square, Wifi, WifiOff } from "lucide-react";
import { config } from "@/config/websocket";
import { useRegionConfig } from "@/lib/region-context";

interface ConnectionControlsProps {
  isConnected: boolean;
  selectedProvider: string;
  customUrl: string;
  onConnect: (url: string) => void;
  onDisconnect: () => void;
  onProviderChange: (provider: keyof typeof config.providers | "custom" | "") => void;
  onCustomUrlChange: (url: string) => void;
  className?: string;
}

export function ConnectionControls({
  isConnected,
  selectedProvider,
  customUrl,
  onConnect,
  onDisconnect,
  onProviderChange,
  onCustomUrlChange,
  className,
}: ConnectionControlsProps) {
  const regionConfig = useRegionConfig();

  const handleProviderChange = (value: string) => {
    if (value !== "custom") {
      onCustomUrlChange("");
    }
    onProviderChange(value as keyof typeof config.providers | "custom" | "");
  };

  const handleConnect = () => {
    if (selectedProvider === "custom") {
      if (customUrl) {
        onConnect(customUrl);
      }
    } else if (selectedProvider) {
      // Use dynamic region-aware URL instead of static config
      const dynamicUrl = `${regionConfig.wsBaseUrl}/ws`;
      onConnect(dynamicUrl);
    }
  };

  return (
    <div className={`p-4 space-y-4 border-b border-border bg-card text-card-foreground ${className}`}>
      <div className="flex items-center gap-2">
        {isConnected ? (
          <span className="flex items-center gap-2 text-success">
            <Wifi className="w-4 h-4" />
            <span className="text-sm font-medium text-foreground">Connected</span>
          </span>
        ) : (
          <span className="flex items-center gap-2 text-muted-foreground">
            <WifiOff className="w-4 h-4" />
            <span className="text-sm font-medium">Disconnected</span>
          </span>
        )}
      </div>

      <div className="space-y-3">
        <div>
          <Label className="text-foreground">WebSocket Provider</Label>
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
                      <div className="text-xs text-muted-foreground">{provider.description}</div>
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
            <Label className="text-foreground">Custom WebSocket URL</Label>
            <Input
              value={customUrl}
              onChange={(e) => onCustomUrlChange(e.target.value)}
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
