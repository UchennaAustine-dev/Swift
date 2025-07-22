"use client";

import { useState, useEffect, useMemo } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  Bot,
  MessageSquare,
  AlertTriangle,
  RefreshCw,
  Play,
  Pause,
} from "lucide-react";
import { SearchFilters } from "@/components/ui/search-filters";
import { MobileTable } from "@/components/ui/mobile-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface BotLog {
  readonly id: string;
  timestamp: string;
  botType: "telegram" | "whatsapp";
  level: "info" | "warning" | "error" | "debug";
  event: string;
  message: string;
  userId?: string;
  username?: string;
  tradeId?: string;
  responseTime?: number;
  errorCode?: string;
  metadata?: Record<string, any>;
}

// Mock bot log data
const mockBotLogs: BotLog[] = [
  {
    id: "1",
    timestamp: "2024-01-20T10:30:15Z",
    botType: "telegram",
    level: "info",
    event: "message_received",
    message: "User started new trade conversation",
    userId: "user_123",
    username: "@john_trader",
    responseTime: 150,
    metadata: { messageType: "text", command: "/start" },
  },
  {
    id: "2",
    timestamp: "2024-01-20T10:30:10Z",
    botType: "whatsapp",
    level: "error",
    event: "api_timeout",
    message: "WhatsApp API request timed out",
    responseTime: 5000,
    errorCode: "TIMEOUT_ERROR",
    metadata: { endpoint: "/messages", retryCount: 3 },
  },
  {
    id: "3",
    timestamp: "2024-01-20T10:30:05Z",
    botType: "telegram",
    level: "info",
    event: "trade_completed",
    message: "Trade completed successfully",
    userId: "user_456",
    username: "@sarah_crypto",
    tradeId: "TXN002",
    responseTime: 200,
    metadata: { amount: "0.05 BTC", payout: 3275000 },
  },
  {
    id: "4",
    timestamp: "2024-01-20T10:29:58Z",
    botType: "whatsapp",
    level: "warning",
    event: "rate_limit_hit",
    message: "Rate limit approaching for WhatsApp API",
    responseTime: 300,
    metadata: {
      currentRequests: 950,
      limit: 1000,
      resetTime: "2024-01-20T11:00:00Z",
    },
  },
  {
    id: "5",
    timestamp: "2024-01-20T10:29:50Z",
    botType: "telegram",
    level: "debug",
    event: "webhook_received",
    message: "Webhook payload received and processed",
    responseTime: 50,
    metadata: { updateId: 123456, messageId: 789 },
  },
  {
    id: "6",
    timestamp: "2024-01-20T10:29:45Z",
    botType: "whatsapp",
    level: "info",
    event: "message_sent",
    message: "Rate quote sent to user",
    userId: "user_789",
    username: "+234812345678",
    responseTime: 180,
    metadata: { messageType: "template", templateName: "rate_quote" },
  },
];

const filterOptions = [
  {
    key: "botType",
    label: "Bot Type",
    options: [
      { value: "telegram", label: "Telegram" },
      { value: "whatsapp", label: "WhatsApp" },
    ],
  },
  {
    key: "level",
    label: "Log Level",
    options: [
      { value: "error", label: "Error" },
      { value: "warning", label: "Warning" },
      { value: "info", label: "Info" },
      { value: "debug", label: "Debug" },
    ],
  },
  {
    key: "event",
    label: "Event Type",
    options: [
      { value: "message_received", label: "Message Received" },
      { value: "message_sent", label: "Message Sent" },
      { value: "trade_completed", label: "Trade Completed" },
      { value: "api_timeout", label: "API Timeout" },
      { value: "rate_limit_hit", label: "Rate Limit" },
      { value: "webhook_received", label: "Webhook Received" },
    ],
  },
];

export default function BotLogsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>(
    {}
  );
  const [isLiveMode, setIsLiveMode] = useState(true);
  const [logs, setLogs] = useState(mockBotLogs);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Simulate real-time log updates
  useEffect(() => {
    if (!isLiveMode) return;

    const interval = setInterval(() => {
      const newLog: BotLog = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        botType: Math.random() > 0.5 ? "telegram" : "whatsapp",
        level: ["info", "warning", "error", "debug"][
          Math.floor(Math.random() * 4)
        ] as any,
        event: ["message_received", "message_sent", "trade_completed"][
          Math.floor(Math.random() * 3)
        ],
        message: "Real-time log entry",
        responseTime: Math.floor(Math.random() * 1000) + 50,
      };

      setLogs((prev) => [newLog, ...prev.slice(0, 49)]); // Keep only latest 50 logs
    }, 5000); // Add new log every 5 seconds

    return () => clearInterval(interval);
  }, [isLiveMode]);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !log.message.toLowerCase().includes(query) &&
          !log.event.toLowerCase().includes(query) &&
          !(log.username && log.username.toLowerCase().includes(query)) &&
          !(log.tradeId && log.tradeId.toLowerCase().includes(query))
        ) {
          return false;
        }
      }

      // Bot type filter
      if (activeFilters.botType && log.botType !== activeFilters.botType) {
        return false;
      }

      // Level filter
      if (activeFilters.level && log.level !== activeFilters.level) {
        return false;
      }

      // Event filter
      if (activeFilters.event && log.event !== activeFilters.event) {
        return false;
      }

      return true;
    });
  }, [logs, searchQuery, activeFilters]);

  const handleFilterChange = (key: string, value: string) => {
    setActiveFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleClearFilters = () => {
    setActiveFilters({});
    setSearchQuery("");
  };

  const handleExport = () => {
    console.log("Exporting bot logs...");
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "error":
        return "bg-red-500";
      case "warning":
        return "bg-yellow-500";
      case "info":
        return "bg-blue-500";
      case "debug":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const getBotIcon = (botType: string) => {
    return botType === "telegram" ? (
      <Bot className="h-4 w-4" />
    ) : (
      <MessageSquare className="h-4 w-4" />
    );
  };

  const columns = [
    {
      key: "timestamp",
      label: "Time",
      render: (value: string) => (
        <span className="font-mono text-xs">
          {new Date(value).toLocaleTimeString()}
        </span>
      ),
    },
    {
      key: "botType",
      label: "Bot",
      render: (value: string) => (
        <div className="flex items-center gap-2">
          {getBotIcon(value)}
          <Badge variant={value === "telegram" ? "default" : "secondary"}>
            {value === "telegram" ? "Telegram" : "WhatsApp"}
          </Badge>
        </div>
      ),
    },
    {
      key: "level",
      label: "Level",
      render: (value: string) => (
        <Badge
          variant="outline"
          className={`${getLevelColor(value)} text-white border-0`}
        >
          {value.toUpperCase()}
        </Badge>
      ),
    },
    {
      key: "event",
      label: "Event",
      render: (value: string) => (
        <Badge variant="outline" className="font-mono text-xs">
          {value.replace("_", " ")}
        </Badge>
      ),
    },
    {
      key: "message",
      label: "Message",
      render: (value: string) => (
        <div className="max-w-md">
          <p className="text-sm truncate" title={value}>
            {value}
          </p>
        </div>
      ),
    },
    {
      key: "user",
      label: "User",
      render: (_: any, row: BotLog) => (
        <span className="text-sm text-muted-foreground">
          {row.username || "System"}
        </span>
      ),
    },
    {
      key: "responseTime",
      label: "Response Time",
      render: (value?: number) => (
        <span
          className={`font-mono text-xs ${
            value && value > 1000
              ? "text-red-600"
              : value && value > 500
              ? "text-yellow-600"
              : "text-green-600"
          }`}
        >
          {value ? `${value}ms` : "N/A"}
        </span>
      ),
    },
  ];

  const actions = [
    {
      label: "View Details",
      onClick: (log: BotLog) => console.log("View", log.id),
    },
    {
      label: "View Metadata",
      onClick: (log: BotLog) => console.log("Metadata", log.metadata),
    },
    {
      label: "Copy Log ID",
      onClick: (log: BotLog) => navigator.clipboard.writeText(log.id),
    },
  ];

  const mobileCardRender = (log: BotLog) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {getBotIcon(log.botType)}
          <Badge
            variant={log.botType === "telegram" ? "default" : "secondary"}
            className="text-xs"
          >
            {log.botType === "telegram" ? "Telegram" : "WhatsApp"}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={`${getLevelColor(
              log.level
            )} text-white border-0 text-xs`}
          >
            {log.level.toUpperCase()}
          </Badge>
          <span className="font-mono text-xs text-muted-foreground">
            {new Date(log.timestamp).toLocaleTimeString()}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Badge variant="outline" className="font-mono text-xs">
          {log.event.replace("_", " ")}
        </Badge>
      </div>

      <div className="text-sm">{log.message}</div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-muted-foreground">User:</span>
          <div className="font-medium">{log.username || "System"}</div>
        </div>
        <div>
          <span className="text-muted-foreground">Response:</span>
          <div
            className={`font-mono text-xs ${
              log.responseTime && log.responseTime > 1000
                ? "text-red-600"
                : log.responseTime && log.responseTime > 500
                ? "text-yellow-600"
                : "text-green-600"
            }`}
          >
            {log.responseTime ? `${log.responseTime}ms` : "N/A"}
          </div>
        </div>
      </div>

      {log.tradeId && (
        <div>
          <span className="text-muted-foreground text-sm">Trade ID:</span>
          <div className="font-mono text-sm">{log.tradeId}</div>
        </div>
      )}

      {log.errorCode && (
        <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-md">
          <span className="text-xs text-red-600 dark:text-red-400">
            <strong>Error:</strong> {log.errorCode}
          </span>
        </div>
      )}
    </div>
  );

  const totalLogs = logs.length;
  const errorLogs = logs.filter((l) => l.level === "error").length;
  const telegramLogs = logs.filter((l) => l.botType === "telegram").length;
  const whatsappLogs = logs.filter((l) => l.botType === "whatsapp").length;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <div className="flex flex-1 flex-col gap-6 container-padding pt-0">
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="heading-responsive font-bold tracking-tight">
                Bot Logs
              </h1>
              <p className="text-responsive text-muted-foreground">
                Real-time monitoring of Telegram and WhatsApp bot activities.
              </p>
            </div>

            {/* Live Mode Toggle */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Live Monitoring</CardTitle>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={isLiveMode}
                        onCheckedChange={setIsLiveMode}
                      />
                      <Label className="text-sm">
                        {isLiveMode ? "Live" : "Paused"}
                      </Label>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRefresh}
                      disabled={isRefreshing}
                    >
                      <RefreshCw
                        className={`h-4 w-4 mr-2 ${
                          isRefreshing ? "animate-spin" : ""
                        }`}
                      />
                      Refresh
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        isLiveMode
                          ? "bg-green-500 animate-pulse"
                          : "bg-gray-400"
                      }`}
                    ></div>
                    <span className="text-sm text-muted-foreground">
                      {isLiveMode
                        ? "Receiving live updates"
                        : "Live updates paused"}
                    </span>
                  </div>
                  {isLiveMode && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsLiveMode(false)}
                    >
                      <Pause className="h-4 w-4 mr-2" />
                      Pause
                    </Button>
                  )}
                  {!isLiveMode && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsLiveMode(true)}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Resume
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Overview Cards */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Logs
                  </CardTitle>
                  <Bot className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalLogs}</div>
                  <p className="text-xs text-muted-foreground">Last 24 hours</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Errors</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{errorLogs}</div>
                  <p className="text-xs text-muted-foreground">Error events</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Telegram
                  </CardTitle>
                  <Bot className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{telegramLogs}</div>
                  <p className="text-xs text-muted-foreground">Bot events</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    WhatsApp
                  </CardTitle>
                  <MessageSquare className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{whatsappLogs}</div>
                  <p className="text-xs text-muted-foreground">Bot events</p>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <SearchFilters
                searchPlaceholder="Search bot logs..."
                filters={filterOptions}
                onSearch={setSearchQuery}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
                activeFilters={activeFilters}
                className="flex-1"
              />
              <Button onClick={handleExport} className="sm:ml-4">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>

            <MobileTable
              columns={columns}
              data={filteredLogs}
              actions={actions}
              mobileCardRender={mobileCardRender}
              emptyMessage="No bot logs found matching your criteria."
            />

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div>
                Showing {filteredLogs.length} of {logs.length} logs
              </div>
              {isLiveMode && (
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span>Live updates active</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
