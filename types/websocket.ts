// WebSocket Types
export interface WebSocketMessage {
  id: string;
  timestamp: Date;
  type: "sent" | "received" | "connection" | "error";
  data: string;
  size?: number;
}

export interface WebSocketConnection {
  url: string;
  status: "disconnected" | "connecting" | "connected" | "error";
  socket: WebSocket | null;
}

export interface WebSocketSamplePayload {
  label: string;
  payload: string;
}

export interface WebSocketProvider {
  label: string;
  url: string;
  description?: string;
  samples?: WebSocketSamplePayload[];
}

export interface WebSocketConfig {
  providers: Record<string, WebSocketProvider>;
}
