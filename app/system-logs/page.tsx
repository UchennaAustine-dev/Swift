"use client";

import { useState, useMemo } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Download,
  FileText,
  User,
  Settings,
  Shield,
  Database,
  AlertTriangle,
} from "lucide-react";
import { SearchFilters } from "@/components/ui/search-filters";
import { MobileTable } from "@/components/ui/mobile-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SystemLog {
  readonly id: string;
  timestamp: string;
  category:
    | "user_action"
    | "admin_action"
    | "system_event"
    | "security"
    | "database"
    | "api";
  action: string;
  description: string;
  userId?: string;
  username?: string;
  ipAddress?: string;
  userAgent?: string;
  severity: "info" | "warning" | "error" | "critical";
  metadata?: Record<string, any>;
}

// Mock system log data
const mockSystemLogs: SystemLog[] = [
  {
    id: "1",
    timestamp: "2024-01-20T10:30:00Z",
    category: "admin_action",
    action: "user_blocked",
    description: "Admin blocked user @suspicious_user",
    userId: "admin_1",
    username: "david_taiwo",
    ipAddress: "192.168.1.100",
    severity: "warning",
    metadata: {
      targetUser: "@suspicious_user",
      reason: "Multiple failed trades",
    },
  },
  {
    id: "2",
    timestamp: "2024-01-20T10:25:00Z",
    category: "user_action",
    action: "trade_completed",
    description: "User completed Bitcoin trade",
    userId: "user_123",
    username: "@john_trader",
    ipAddress: "203.0.113.45",
    severity: "info",
    metadata: { tradeId: "TXN001", amount: "0.05 BTC", value: 3275000 },
  },
  {
    id: "3",
    timestamp: "2024-01-20T10:20:00Z",
    category: "system_event",
    action: "rate_updated",
    description: "Bitcoin rate automatically updated from API",
    severity: "info",
    metadata: { oldRate: 65000000, newRate: 65500000, source: "CoinGecko" },
  },
  {
    id: "4",
    timestamp: "2024-01-20T10:15:00Z",
    category: "security",
    action: "failed_login",
    description: "Failed admin login attempt",
    ipAddress: "198.51.100.42",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    severity: "warning",
    metadata: { attempts: 3, username: "admin" },
  },
  {
    id: "5",
    timestamp: "2024-01-20T10:10:00Z",
    category: "database",
    action: "backup_completed",
    description: "Scheduled database backup completed successfully",
    severity: "info",
    metadata: {
      size: "2.3GB",
      duration: "45s",
      location: "s3://backups/2024-01-20",
    },
  },
  {
    id: "6",
    timestamp: "2024-01-20T10:05:00Z",
    category: "api",
    action: "api_error",
    description: "Gift card API source returned error",
    severity: "error",
    metadata: {
      source: "CardCash API",
      errorCode: "TIMEOUT",
      responseTime: 5000,
    },
  },
];

const filterOptions = [
  {
    key: "category",
    label: "Category",
    options: [
      { value: "user_action", label: "User Action" },
      { value: "admin_action", label: "Admin Action" },
      { value: "system_event", label: "System Event" },
      { value: "security", label: "Security" },
      { value: "database", label: "Database" },
      { value: "api", label: "API" },
    ],
  },
  {
    key: "severity",
    label: "Severity",
    options: [
      { value: "critical", label: "Critical" },
      { value: "error", label: "Error" },
      { value: "warning", label: "Warning" },
      { value: "info", label: "Info" },
    ],
  },
];

export default function SystemLogsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>(
    {}
  );

  const filteredLogs = useMemo(() => {
    return mockSystemLogs.filter((log) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !log.action.toLowerCase().includes(query) &&
          !log.description.toLowerCase().includes(query) &&
          !(log.username && log.username.toLowerCase().includes(query))
        ) {
          return false;
        }
      }

      // Category filter
      if (activeFilters.category && log.category !== activeFilters.category) {
        return false;
      }

      // Severity filter
      if (activeFilters.severity && log.severity !== activeFilters.severity) {
        return false;
      }

      return true;
    });
  }, [searchQuery, activeFilters]);

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
    console.log("Exporting system logs...");
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "user_action":
        return <User className="h-4 w-4" />;
      case "admin_action":
        return <Shield className="h-4 w-4" />;
      case "system_event":
        return <Settings className="h-4 w-4" />;
      case "security":
        return <Shield className="h-4 w-4" />;
      case "database":
        return <Database className="h-4 w-4" />;
      case "api":
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500";
      case "error":
        return "bg-red-400";
      case "warning":
        return "bg-yellow-500";
      case "info":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const columns = [
    {
      key: "timestamp",
      label: "Time",
      render: (value: string) => (
        <span className="font-mono text-sm">
          {new Date(value).toLocaleString()}
        </span>
      ),
    },
    {
      key: "category",
      label: "Category",
      render: (value: string) => (
        <div className="flex items-center gap-2">
          {getCategoryIcon(value)}
          <span className="capitalize">{value.replace("_", " ")}</span>
        </div>
      ),
    },
    {
      key: "action",
      label: "Action",
      render: (value: string) => (
        <Badge variant="outline" className="font-mono">
          {value.replace("_", " ")}
        </Badge>
      ),
    },
    {
      key: "user",
      label: "User",
      render: (_: any, row: SystemLog) => {
        if (!row.username)
          return <span className="text-muted-foreground">System</span>;
        return (
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-xs">
                {row.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm">{row.username}</span>
          </div>
        );
      },
    },
    {
      key: "description",
      label: "Description",
      render: (value: string) => (
        <div className="max-w-md">
          <p className="text-sm truncate" title={value}>
            {value}
          </p>
        </div>
      ),
    },
    {
      key: "severity",
      label: "Severity",
      render: (value: string) => (
        <Badge
          variant="outline"
          className={`${getSeverityColor(value)} text-white border-0`}
        >
          {value === "critical" && <AlertTriangle className="h-3 w-3 mr-1" />}
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </Badge>
      ),
    },
    {
      key: "ipAddress",
      label: "IP Address",
      render: (value?: string) => (
        <span className="font-mono text-sm">{value || "N/A"}</span>
      ),
    },
  ];

  const actions = [
    {
      label: "View Details",
      onClick: (log: SystemLog) => console.log("View", log.id),
    },
    {
      label: "View Metadata",
      onClick: (log: SystemLog) => console.log("Metadata", log.metadata),
    },
    {
      label: "Copy Log ID",
      onClick: (log: SystemLog) => navigator.clipboard.writeText(log.id),
    },
  ];

  const mobileCardRender = (log: SystemLog) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {getCategoryIcon(log.category)}
          <span className="font-medium capitalize">
            {log.category.replace("_", " ")}
          </span>
        </div>
        <Badge
          variant="outline"
          className={`${getSeverityColor(
            log.severity
          )} text-white border-0 text-xs`}
        >
          {log.severity}
        </Badge>
      </div>

      <div className="flex items-center gap-2">
        <Badge variant="outline" className="font-mono text-xs">
          {log.action.replace("_", " ")}
        </Badge>
      </div>

      <div className="text-sm">{log.description}</div>

      {log.username && (
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="text-xs">
              {log.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">{log.username}</span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-muted-foreground">Time:</span>
          <div className="font-mono text-xs">
            {new Date(log.timestamp).toLocaleString()}
          </div>
        </div>
        <div>
          <span className="text-muted-foreground">IP:</span>
          <div className="font-mono text-xs">{log.ipAddress || "N/A"}</div>
        </div>
      </div>

      {log.metadata && Object.keys(log.metadata).length > 0 && (
        <div className="p-2 bg-muted rounded-md">
          <span className="text-xs text-muted-foreground">Metadata:</span>
          <div className="text-xs font-mono mt-1">
            {Object.entries(log.metadata)
              .slice(0, 2)
              .map(([key, value]) => (
                <div key={key}>
                  {key}: {JSON.stringify(value)}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );

  const totalLogs = mockSystemLogs.length;
  const errorLogs = mockSystemLogs.filter(
    (l) => l.severity === "error" || l.severity === "critical"
  ).length;
  const adminActions = mockSystemLogs.filter(
    (l) => l.category === "admin_action"
  ).length;
  const securityEvents = mockSystemLogs.filter(
    (l) => l.category === "security"
  ).length;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <div className="flex flex-1 flex-col gap-6 container-padding pt-0">
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="heading-responsive font-bold tracking-tight">
                System Logs
              </h1>
              <p className="text-responsive text-muted-foreground">
                Comprehensive audit trail of all system activities and user
                actions.
              </p>
            </div>

            {/* Overview Cards */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Logs
                  </CardTitle>
                  <FileText className="h-4 w-4 text-blue-600" />
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
                  <p className="text-xs text-muted-foreground">
                    Critical & errors
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Admin Actions
                  </CardTitle>
                  <Shield className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{adminActions}</div>
                  <p className="text-xs text-muted-foreground">
                    Administrative
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Security Events
                  </CardTitle>
                  <Shield className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{securityEvents}</div>
                  <p className="text-xs text-muted-foreground">
                    Security related
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <SearchFilters
                searchPlaceholder="Search system logs..."
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
              emptyMessage="No system logs found matching your criteria."
            />

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div>
                Showing {filteredLogs.length} of {mockSystemLogs.length} logs
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
