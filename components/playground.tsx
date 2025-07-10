"use client"
import { useState, useRef, useEffect, useMemo } from "react"
import {
    ChevronUp,
    ChevronDown,
    Code,
    X,
    Zap,
    Copy,
    Construction,
    Play,
    Square,
    Send,
    Trash2,
    Wifi,
    WifiOff,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// WebSocket Types
interface WebSocketMessage {
    id: string
    timestamp: Date
    type: "sent" | "received" | "connection" | "error"
    data: string
    size?: number
}

interface WebSocketConnection {
    url: string
    status: "disconnected" | "connecting" | "connected" | "error"
    socket: WebSocket | null
}

import { websocketConfigs, type WebSocketProviderKey } from "@/config/websocket"

// WebSocket Panel Component
function WebSocketPanel() {
    const [connection, setConnection] = useState<WebSocketConnection>({
        url: "",
        status: "disconnected",
        socket: null,
    })
    const [selectedProvider, setSelectedProvider] = useState<WebSocketProviderKey | "">("")
    const [payload, setPayload] = useState("")
    const [messages, setMessages] = useState<WebSocketMessage[]>([])
    const [autoScroll, setAutoScroll] = useState(true)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Get available sample payloads for the selected provider
    const availableSamplePayloads = useMemo(() => {
        if (!selectedProvider) return []
        return websocketConfigs[selectedProvider]?.samplePayloads || []
    }, [selectedProvider])

    // Auto scroll to bottom when new messages arrive
    useEffect(() => {
        if (autoScroll && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [messages, autoScroll])

    // Add message to log
    const addMessage = (type: WebSocketMessage["type"], data: string, size?: number) => {
        const message: WebSocketMessage = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            timestamp: new Date(),
            type,
            data,
            size,
        }
        setMessages((prev) => [...prev, message])
    }

    // Connect to WebSocket
    const connect = () => {
        const url = websocketConfigs[selectedProvider]?.url

        if (!url) {
            addMessage("error", "Please select or enter a WebSocket URL")
            return
        }

        if (connection.socket) {
            disconnect()
        }

        setConnection((prev) => ({ ...prev, status: "connecting", url }))
        addMessage("connection", `Connecting to ${url}...`)

        try {
            const socket = new WebSocket(url)

            socket.onopen = () => {
                setConnection((prev) => ({ ...prev, status: "connected", socket }))
                addMessage("connection", `Connected to ${url}`)
            }

            socket.onmessage = (event) => {
                const data = event.data
                const size = new Blob([data]).size
                addMessage("received", data, size)
            }

            socket.onclose = (event) => {
                setConnection((prev) => ({ ...prev, status: "disconnected", socket: null }))
                const reason = event.reason || "Connection closed"
                addMessage("connection", `Disconnected: ${reason} (Code: ${event.code})`)
            }

            socket.onerror = (error) => {
                setConnection((prev) => ({ ...prev, status: "error" }))
                addMessage("error", `WebSocket error: ${error}`)
            }
        } catch (error) {
            setConnection((prev) => ({ ...prev, status: "error" }))
            addMessage("error", `Failed to connect: ${error}`)
        }
    }

    // Disconnect from WebSocket
    const disconnect = () => {
        if (connection.socket) {
            connection.socket.close()
            setConnection((prev) => ({ ...prev, status: "disconnected", socket: null }))
        }
    }

    // Send message
    const sendMessage = () => {
        if (!connection.socket || connection.status !== "connected") {
            addMessage("error", "Not connected to WebSocket server")
            return
        }

        if (!payload.trim()) {
            addMessage("error", "Please enter a message to send")
            return
        }

        try {
            connection.socket.send(payload)
            const size = new Blob([payload]).size
            addMessage("sent", payload, size)
        } catch (error) {
            addMessage("error", `Failed to send message: ${error}`)
        }
    }

    // Clear messages
    const clearMessages = () => {
        setMessages([])
    }

    // Copy message to clipboard
    const copyMessage = (message: string) => {
        navigator.clipboard.writeText(message)
    }

    // Format timestamp
    const formatTimestamp = (timestamp: Date) => {
        return timestamp.toLocaleTimeString()
    }

    // Format message size
    const formatSize = (size?: number) => {
        if (!size) return ""
        if (size < 1024) return `${size}B`
        if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)}KB`
        return `${(size / (1024 * 1024)).toFixed(1)}MB`
    }

    // Get status color
    const getStatusColor = () => {
        switch (connection.status) {
            case "connected":
                return "text-green-600"
            case "connecting":
                return "text-yellow-600"
            case "error":
                return "text-red-600"
            default:
                return "text-gray-600"
        }
    }

    // Get status icon
    const getStatusIcon = () => {
        switch (connection.status) {
            case "connected":
                return <Wifi className="w-4 h-4" />
            case "connecting":
                return <Wifi className="w-4 h-4 animate-pulse" />
            default:
                return <WifiOff className="w-4 h-4" />
        }
    }

    // Handle provider selection
    const handleProviderSelection = (value: string) => {
        setSelectedProvider(value as WebSocketProviderKey)
    }

    return (
        <div className="h-full flex flex-col">
            {/* Connection Controls */}
            <div className="p-4 border-b border-gray-200 space-y-4">
                <div className="flex items-center justify-between">
                    <div className={`flex items-center gap-2 ${getStatusColor()}`}>
                        {getStatusIcon()}
                        <span className="text-sm font-medium capitalize">{connection.status}</span>
                    </div>
                </div>

                <div className="space-y-3">
                    <div>
                        <Label>WebSocket Provider</Label>
                        <Select value={selectedProvider} onValueChange={handleProviderSelection}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a WebSocket provider" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries(websocketConfigs).map(([key, config]) => (
                                    <SelectItem key={key} value={key}>
                                        <div>
                                            <div className="font-medium">{config.name}</div>
                                            {config.description && (
                                                <div className="text-xs text-gray-500">{config.description}</div>
                                            )}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            onClick={connect}
                            disabled={connection.status === "connecting" || connection.status === "connected"}
                            className="flex-1"
                        >
                            <Play className="w-4 h-4 mr-2" />
                            Connect
                        </Button>
                        <Button
                            onClick={disconnect}
                            disabled={connection.status === "disconnected"}
                            variant="outline"
                            className="flex-1 bg-transparent"
                        >
                            <Square className="w-4 h-4 mr-2" />
                            Disconnect
                        </Button>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Message Composer */}
                <div className="w-1/2 border-r border-gray-200 flex flex-col">
                    <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium">Message Composer</h4>
                            <div className="flex items-center gap-2">
                                <Select onValueChange={(value) => setPayload(value)}>
                                    <SelectTrigger className="w-80">
                                        <SelectValue placeholder="Load sample" />
                                    </SelectTrigger>
                                    <SelectContent position="bottom">
                                        {availableSamplePayloads.map((sample) => (
                                            <SelectItem key={sample.label} value={sample.payload}>
                                                <div>
                                                    <div className="font-medium">{sample.label}</div>
                                                    {sample.description && (
                                                        <div className="text-xs text-gray-500">{sample.description}</div>
                                                    )}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 p-4">
                        <div className="h-full flex flex-col">
                            <Label htmlFor="payload" className="mb-2">
                                Message Payload
                            </Label>
                            <Textarea
                                id="payload"
                                value={payload}
                                onChange={(e) => setPayload(e.target.value)}
                                placeholder="Enter your WebSocket message here..."
                                className="flex-1 font-mono text-sm resize-none"
                            />
                            <div className="flex gap-2 mt-3">
                                <Button onClick={sendMessage} disabled={connection.status !== "connected"} className="flex-1">
                                    <Send className="w-4 h-4 mr-2" />
                                    Send Message
                                </Button>
                                <Button onClick={() => setPayload("")} variant="outline">
                                    Clear
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Message Log */}
                <div className="w-1/2 flex flex-col">
                    <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h4 className="font-medium">Message Log</h4>
                            <div className="flex items-center gap-2">
                                <label className="flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={autoScroll}
                                        onChange={(e) => setAutoScroll(e.target.checked)}
                                        className="rounded"
                                    />
                                    Auto-scroll
                                </label>
                                <Button onClick={clearMessages} variant="outline" size="sm">
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
                                        className={`p-3 rounded-lg border text-sm ${message.type === "sent"
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
                                                    className={`text-xs ${message.type === "sent"
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
                                                {message.size && <span className="text-xs text-gray-500">{formatSize(message.size)}</span>}
                                            </div>
                                            <Button
                                                onClick={() => copyMessage(message.data)}
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
            </div>
        </div>
    )
}

// Main API Playground Component
export function ApiPlayground() {
    const [isOpen, setIsOpen] = useState(false)
    const [activeMode, setActiveMode] = useState<"rest" | "websocket">("websocket")

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50">
            {/* Toggle Button */}
            <div className="flex justify-center">
                <Button
                    onClick={() => setIsOpen(!isOpen)}
                    variant="outline"
                    size="sm"
                    className="mb-2 shadow-lg bg-white hover:bg-gray-50 text-gray-900 relative overflow-hidden transition-all duration-300 neon-border-button"
                >
                    <Code className="w-4 h-4 mr-2" />
                    API Playground
                    {isOpen ? <ChevronDown className="w-4 h-4 ml-2" /> : <ChevronUp className="w-4 h-4 ml-2" />}
                </Button>
            </div>

            {/* Playground Panel */}
            <div
                className={`bg-white border-t border-gray-200 shadow-2xl transition-all duration-300 ease-in-out ${isOpen ? "translate-y-0" : "translate-y-full"
                    }`}
                style={{ height: isOpen ? "70vh" : "0" }}
            >
                <div className="h-full flex flex-col">
                    {/* Mode Selection */}
                    <div className="p-4 border-b border-gray-200 bg-white flex-shrink-0">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <Button
                                    onClick={() => setActiveMode("rest")}
                                    variant={activeMode === "rest" ? "default" : "outline"}
                                    size="sm"
                                    disabled
                                    className="relative"
                                >
                                    <Code className="w-4 h-4 mr-2" />
                                    REST API
                                    <Badge variant="secondary" className="ml-2 text-xs bg-yellow-100 text-yellow-800">
                                        WIP
                                    </Badge>
                                </Button>
                                <Button
                                    onClick={() => setActiveMode("websocket")}
                                    variant={activeMode === "websocket" ? "default" : "outline"}
                                    size="sm"
                                >
                                    <Zap className="w-4 h-4 mr-2" />
                                    WebSocket
                                </Button>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 overflow-hidden">
                        {activeMode === "websocket" ? (
                            <WebSocketPanel />
                        ) : (
                            <div className="flex-1 flex items-center justify-center bg-gray-50">
                                <div className="text-center max-w-md mx-auto p-8">
                                    <div className="mb-6">
                                        <Construction className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
                                        <Badge variant="secondary" className="mb-4 bg-yellow-100 text-yellow-800 px-3 py-1">
                                            Work in Progress
                                        </Badge>
                                    </div>

                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">REST API Testing</h3>
                                    <p className="text-gray-600 mb-6">
                                        The REST API testing functionality is currently under development. This feature will include:
                                    </p>

                                    <div className="text-left bg-white rounded-lg p-4 border border-gray-200 mb-6">
                                        <ul className="space-y-2 text-sm text-gray-700">
                                            <li className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                                OpenAPI specification loading
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                                Interactive endpoint testing
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                                Parameter configuration
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                                Authentication support
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                                Response visualization
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                                cURL command generation
                                            </li>
                                        </ul>
                                    </div>

                                    <p className="text-sm text-gray-500">
                                        In the meantime, you can use the WebSocket functionality which is fully operational.
                                    </p>

                                    <Button onClick={() => setActiveMode("websocket")} className="mt-4" variant="outline">
                                        <Zap className="w-4 h-4 mr-2" />
                                        Try WebSocket Testing
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
