import { useEffect, useState } from "react";
import { ApiLog, TradePayload } from "@/types/logs";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

const ENDPOINTS = [
  "/api/v4/order/collateral/limit",
  "/api/v4/order/collateral/market",
  "/api/v4/order/collateral/stop-limit",
  "/api/v4/order/collateral/trigger-market",
  "/api/v4/order/modify",
  "/api/v4/order/new",
  "/api/v4/order/market",
  "/api/v4/order/stop_limit",
  "/api/v4/order/stop_market",
  "/api/v4/order/cancel",
];

interface TickerData {
  [key: string]: {
    quote_volume: string;
    [key: string]: any;
  };
}

async function fetchTopMarkets(): Promise<
  { market: string; last_price?: string }[]
> {
  try {
    const response = await fetch("https://whitebit.com/api/v4/public/ticker");
    const data: TickerData = await response.json();
    // Sort and slice after collecting all markets
    return Object.entries(data)
      .reduce((acc, [market, marketData]) => {
        if (market.endsWith("_USDT") || market.endsWith("_PERP")) {
          acc.push({
            market,
            volume: parseFloat(marketData.quote_volume),
            last_price: marketData.last_price,
          });
        }

        return acc;
      }, [] as { market: string; last_price?: string; volume: number }[])
      .sort((a, b) => b.volume - a.volume)
      .slice(0, 20)
      .map((item) => ({ market: item.market, last_price: item.last_price }));
  } catch (error) {
    console.error("Failed to fetch markets:", error);
    return [
      { market: "BTC_USDT" },
      { market: "BTC_PERP" },
      { market: "WBT_USDT" },
      { market: "ETH_USDT" },
      { market: "ETH_PERP" },
    ]; // Updated fallback to only include USDT and PERP pairs
  }
}

function generatePayload(
  endpoint: string,
  markets: { market: string; last_price?: string }[]
): TradePayload {
  const marketData = markets[Math.floor(Math.random() * markets.length)];
  const side = Math.random() > 0.5 ? "buy" : "sell";
  const basePrice = parseFloat(marketData.last_price || "30000");
  const priceVariation = basePrice * 0.01; // 1% variation
  const randomPrice = basePrice + (Math.random() * 2 - 1) * priceVariation;

  const basePayload = {
    market: marketData.market,
    side,
  } as const;

  // Dynamic amount generation based on market and order type
  const getAmount = () => {
    const baseValue = Math.random() * 100000 + 5000; // Between 5k and 105k USDT
    const isLargeOrder = Math.random() < 0.1; // 10% chance of large order
    const multiplier = isLargeOrder ? Math.random() * 10 + 5 : 1; // 5x-15x for large orders
    return ((baseValue * multiplier) / basePrice).toFixed(6);
  };

  switch (endpoint) {
    case "/api/v4/order/collateral/limit":
    case "/api/v4/order/new":
      return {
        ...basePayload,
        amount: getAmount(),
        price: randomPrice.toFixed(2),
        timeInForce: Math.random() > 0.3 ? "GTC" : "IOC", // Mix of GTC and IOC orders
      };
    case "/api/v4/order/collateral/market":
    case "/api/v4/order/market":
      return {
        ...basePayload,
        amount: getAmount(),
        timeInForce: "IOC",
      };
    case "/api/v4/order/collateral/stop-limit":
    case "/api/v4/order/stop_limit":
      return {
        ...basePayload,
        amount: getAmount(),
        price: randomPrice.toFixed(2),
        stopPrice: (
          randomPrice *
          (1 + (side === "buy" ? 0.002 : -0.002))
        ).toFixed(2), // 0.2% stop distance
        type: "stop_limit",
      };
    case "/api/v4/order/collateral/trigger-market":
    case "/api/v4/order/stop_market":
      return {
        ...basePayload,
        amount: getAmount(),
        activation_price: (
          randomPrice *
          (1 + (side === "buy" ? 0.002 : -0.002))
        ).toFixed(2),
        type: "stop",
      };
    case "/api/v4/order/modify":
      return {
        ...basePayload,
        amount: getAmount(),
        price: randomPrice.toFixed(2),
        timeInForce: "GTC",
      };
    case "/api/v4/order/cancel":
      return {
        market: marketData.market,
        orderId: Math.floor(Math.random() * 1000000000).toString(),
        side,
      };
    default:
      return basePayload;
  }
}

function formatTime(date: string): string {
  const dateObj = new Date(date);
  const hours = dateObj.getHours().toString().padStart(2, "0");
  const minutes = dateObj.getMinutes().toString().padStart(2, "0");
  const seconds = dateObj.getSeconds().toString().padStart(2, "0");
  const ms = dateObj.getMilliseconds().toString().padStart(3, "0");

  return `${hours}:${minutes}:${seconds}.${ms}`;
}

function generateBatch(
  size: number,
  markets: { market: string; last_price?: string }[]
): ApiLog[] {
  const baseTime = new Date();

  return Array.from({ length: size }, () => {
    const endpoint = ENDPOINTS[Math.floor(Math.random() * ENDPOINTS.length)];
    const randomOffset = Math.random() * 100;
    const timestamp = new Date(baseTime.getTime() - randomOffset);

    // Add weighted random status code generation
    const random = Math.random();
    const statusCode =
      random < 0.97
        ? 200 // 97% success
        : random < 0.99
        ? 400 // 2% bad request
        : random < 0.995
        ? 429 // 0.5% rate limit
        : 401; // 0.5% unauthorized

    return {
      id: timestamp.toString(),
      timestamp: timestamp.toISOString(),
      path: endpoint,
      payload: generatePayload(endpoint, markets),
      statusCode,
    };
  }).sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

export default function LogViewer({ className }: { className?: string }) {
  const [logs, setLogs] = useState<ApiLog[]>([]);

  const { data: markets = [], isLoading } = useQuery({
    queryKey: ["markets"],
    queryFn: fetchTopMarkets,
  });

  useEffect(() => {
    if (markets.length === 0) return;

    const interval = setInterval(() => {
      const batchSize = Math.floor(Math.random() * 8) + 6; // 6-14 orders per batch

      setLogs((prevLogs) => {
        const newBatch = generateBatch(batchSize, markets);
        return [...newBatch, ...prevLogs].slice(0, 1000);
      });
    }, 128);

    return () => {
      clearInterval(interval);
    };
  }, [markets, logs]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[600px] border rounded-md">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const columns: ColumnDef<ApiLog>[] = [
    {
      accessorKey: "timestamp",
      header: "Time",
      cell: ({ row }) => <span>{formatTime(row.getValue("timestamp"))}</span>,
      minSize: 100,
      size: 100,
      maxSize: 100,
    },
    {
      accessorKey: "statusCode",
      header: "Code",
      cell: ({ row }) => {
        const status = row.getValue("statusCode") as number;
        return (
          <span
            className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${
              status === 200
                ? "bg-green-500/10 text-green-500"
                : status === 429
                ? "bg-yellow-500/10 text-yellow-500"
                : status === 400
                ? "bg-orange-500/10 text-orange-500"
                : "bg-red-500/10 text-red-500"
            }`}
          >
            {status}
          </span>
        );
      },
      minSize: 30,
      size: 30,
      maxSize: 30,
    },
    {
      accessorKey: "path",
      header: "Endpoint",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <span className="max-w-[300px] truncate font-mono text-sm">
            {row.original.path}
          </span>
        </div>
      ),
      minSize: 360,
      size: 360,
      maxSize: 360,
    },
    {
      accessorKey: "payload",
      header: "Payload",
      cell: ({ row }) => {
        const payload = row.original.payload;
        return (
          <div className="flex gap-2 items-center max-w-[520px] truncate font-mono text-sm">
            <span
              className={`shrink-0 px-1.5 py-0.5 rounded-sm text-xs font-medium w-12 text-center ${
                payload.side === "buy"
                  ? "bg-green-500/10 text-green-500"
                  : "bg-red-500/10 text-red-500"
              }`}
            >
              {payload.side.toUpperCase()}
            </span>
            <span className="truncate">{JSON.stringify(payload)}</span>
          </div>
        );
      },
      minSize: 520,
      size: 520,
      maxSize: 520,
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={logs}
      className={`font-mono ${className || ""}`}
      height="410px"
    />
  );
}
