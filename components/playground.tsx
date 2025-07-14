"use client"
import { useState, useRef, useEffect } from "react"
import {
    ChevronUp,
    ChevronDown,
    Code,
    X,
    Zap,
    Construction,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import { config } from "@/config/websocket"
import { WebSocketProvider, WebSocketMessage, WebSocketConnection } from "@/types/websocket"
import { ConnectionControls } from "@/components/playground/connection-controls"
import { MessageComposer } from "@/components/playground/message-composer"
import { MessageLog } from "@/components/playground/message-log"
import clsx from "clsx";

// WebSocket Panel Component
function WebSocketPanel() {
    const [connection, setConnection] = useState<WebSocketConnection>({
        url: "",
        status: "disconnected",
        socket: null,
    });
    const [selectedProvider, setSelectedProvider] = useState<WebSocketProvider | null>(null);
    const [selectedProviderKey, setSelectedProviderKey] = useState<string>("");
    const [customUrl, setCustomUrl] = useState("");
    const [messages, setMessages] = useState<WebSocketMessage[]>([]);
    const [autoScroll, setAutoScroll] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Handle provider change
    const handleProviderChange = (providerId: keyof typeof config.providers | "custom" | "") => {
        setSelectedProviderKey(providerId);
        if (providerId && providerId !== "custom") {
            setSelectedProvider(config.providers[providerId]);
        } else {
            setSelectedProvider(null);
        }
    };

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
    }    // Connect to WebSocket
    const connect = (url: string) => {
        if (!url) {
            addMessage("error", "Please provide a valid WebSocket URL")
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
    const sendMessage = (message: string) => {
        if (!connection.socket || connection.status !== "connected") {
            addMessage("error", "Not connected to WebSocket server")
            return
        }

        if (!message.trim()) {
            addMessage("error", "Please enter a message to send")
            return
        }

        try {
            connection.socket.send(message)
            const size = new Blob([message]).size
            addMessage("sent", message, size)
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





    return (
        <div className="h-full flex flex-col">
            <ConnectionControls
                isConnected={connection.status === "connected"}
                selectedProvider={selectedProviderKey}
                customUrl={customUrl}
                onConnect={connect}
                onDisconnect={disconnect}
                onProviderChange={handleProviderChange}
                onCustomUrlChange={setCustomUrl}
            />

            <div className="flex-1 flex overflow-hidden">
                <MessageComposer
                    isConnected={connection.status === "connected"}
                    selectedProvider={selectedProvider}
                    onSend={sendMessage}
                    className="w-1/2 border-r border-gray-200 flex flex-col"
                />

                <MessageLog
                    messages={messages}
                    autoScroll={autoScroll}
                    onAutoScrollChange={setAutoScroll}
                    onClear={clearMessages}
                    onCopy={copyMessage}
                    className="w-1/2"
                />
            </div>
        </div>
    )
}

// Main API Playground Component
export function ApiPlayground() {
    const [isOpen, setIsOpen] = useState(false)
    const [activeMode, setActiveMode] = useState<"rest" | "websocket">("websocket")

    // Listen for custom event to open playground
    useEffect(() => {
        const handleOpenPlayground = (event: CustomEvent) => {
            setIsOpen(true)
            if (event.detail?.mode && (event.detail.mode === "rest" || event.detail.mode === "websocket")) {
                setActiveMode(event.detail.mode)
            }
        }

        // Add event listener with type assertion for CustomEvent
        window.addEventListener('open-playground', handleOpenPlayground as EventListener)

        // Cleanup
        return () => {
            window.removeEventListener('open-playground', handleOpenPlayground as EventListener)
        }
    }, [])

    return (
        <div className={clsx({"fixed bottom-0 left-0 right-0 z-50": true, "w-fit left-1/2 right-1/2 -translate-y-1/2 -translate-x-1/2": !isOpen})}>
            {/* Toggle Button */}
            <div className="flex justify-center">
                <Button
                    onClick={() => setIsOpen(!isOpen)}
                    variant="outline"
                    size="sm"
                    className="mb-2 shadow-lg bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 relative overflow-hidden transition-all duration-300 neon-border-button"
                >
                    <Code className="w-4 h-4 mr-2" />
                    API Playground
                    {isOpen ? <ChevronDown className="w-4 h-4 ml-2" /> : <ChevronUp className="w-4 h-4 ml-2" />}
                </Button>
            </div>

            {/* Playground Panel */}
            <div
                className={`bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 shadow-2xl transition-all duration-300 ease-in-out ${isOpen ? "translate-y-0" : "translate-y-full opacity-0"
                    }`}
                style={{ height: isOpen ? "70vh" : "0" }}
            >
                <div className="h-full flex flex-col">
                    {/* Mode Selection */}
                    <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex-shrink-0">
                        <div className="flex items-center justify-between">
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
                            <div className="flex-1 flex items-center justify-center bg-zinc-50 dark:bg-zinc-900">
                                <div className="text-center max-w-md mx-auto p-8">
                                    <div className="mb-6">
                                        <Construction className="w-16 h-16 mx-auto mb-4 text-zinc-600 dark:text-zinc-400" />
                                        <Badge variant="secondary" className="mb-4">
                                            Work in Progress
                                        </Badge>
                                    </div>

                                    <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-3">REST API Testing</h3>
                                    <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                                        The REST API testing functionality is currently under development. This feature will include:
                                    </p>

                                    <div className="text-left bg-white dark:bg-zinc-900 rounded-lg p-4 border border-zinc-200 dark:border-zinc-800 mb-6">
                                        <ul className="space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
                                            <li className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-zinc-400 dark:bg-zinc-500 rounded-full"></div>
                                                OpenAPI specification loading
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-zinc-400 dark:bg-zinc-500 rounded-full"></div>
                                                Interactive endpoint testing
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-zinc-400 dark:bg-zinc-500 rounded-full"></div>
                                                Parameter configuration
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-zinc-400 dark:bg-zinc-500 rounded-full"></div>
                                                Authentication support
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-zinc-400 dark:bg-zinc-500 rounded-full"></div>
                                                Response visualization
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-zinc-400 dark:bg-zinc-500 rounded-full"></div>
                                                cURL command generation
                                            </li>
                                        </ul>
                                    </div>

                                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
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
