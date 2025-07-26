"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
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
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { SystemLogDetailsModal } from "@/components/modals/system-log-details-modal";
import { toast } from "sonner";
import { ExportDropdown } from "@/components/ui/export-dropdown";

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

const ITEMS_PER_PAGE = 10;

export default function SystemLogsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>(
    {}
  );
  const [isExporting, setIsExporting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLog, setSelectedLog] = useState<SystemLog | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dateRange, setDateRange] = useState<{ from: string; to: string }>({
    from: "",
    to: "",
  });

  // Debounced search
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const filteredLogs = useMemo(() => {
    return mockSystemLogs.filter((log) => {
      // Search filter
      if (debouncedSearchQuery) {
        const query = debouncedSearchQuery.toLowerCase();
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
  }, [debouncedSearchQuery, activeFilters]);

  // Pagination
  const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery, activeFilters]);

  const handleFilterChange = useCallback((key: string, value: string) => {
    setActiveFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setActiveFilters({});
    setSearchQuery("");
  }, []);

  const handleDateRangeChange = (range: { from: string; to: string }) => {
    setDateRange(range);
    setCurrentPage(1);
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

  const getRelativeTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const columns = [
    {
      key: "timestamp",
      label: "Time",
      render: (value: string) => (
        <div className="font-mono text-sm">
          <div>{getRelativeTime(value)}</div>
          <div className="text-muted-foreground text-xs">
            {new Date(value).toLocaleString()}
          </div>
        </div>
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
      onClick: (log: SystemLog) => {
        setSelectedLog(log);
        setIsModalOpen(true);
      },
    },
    {
      label: "View Metadata",
      onClick: (log: SystemLog) => {
        setSelectedLog(log);
        setIsModalOpen(true);
      },
    },
    {
      label: "Copy Log ID",
      onClick: (log: SystemLog) => {
        navigator.clipboard.writeText(log.id);
        toast.success("Log ID copied to clipboard");
      },
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
            {getRelativeTime(log.timestamp)}
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
      <SidebarInset className="fixed-header-layout">
        <Header />
        <div className="scrollable-content flex flex-1 flex-col gap-4 p-4">
          <div className="space-y-4">
            {/* Breadcrumb Navigation */}
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/logs">Logs</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>System Logs</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight font-poppins">
                System Logs
              </h1>
              <p className="text-muted-foreground">
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
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                filters={filterOptions}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
                activeFilters={activeFilters}
                showDateFilter={true}
                dateRange={dateRange}
                onDateRangeChange={handleDateRangeChange}
                className="flex-1"
              />
              <ExportDropdown
                data={filteredLogs}
                filename={`system_logs_${
                  new Date().toISOString().split("T")[0]
                }`}
                className="sm:ml-4 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer hover:text-white hover:border-none"
              />
            </div>

            <MobileTable
              columns={columns}
              data={paginatedLogs}
              actions={actions}
              mobileCardRender={mobileCardRender}
              emptyMessage="No system logs found matching your criteria."
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
                  {Math.min(currentPage * ITEMS_PER_PAGE, filteredLogs.length)}{" "}
                  of {filteredLogs.length} logs
                </div>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          setCurrentPage(Math.max(1, currentPage - 1))
                        }
                        className={
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => setCurrentPage(page)}
                            isActive={currentPage === page}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          setCurrentPage(Math.min(totalPages, currentPage + 1))
                        }
                        className={
                          currentPage === totalPages
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div>
                Showing {filteredLogs.length} of {mockSystemLogs.length} logs
              </div>
            </div>
          </div>
        </div>

        <SystemLogDetailsModal
          log={selectedLog}
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
        />
      </SidebarInset>
    </SidebarProvider>
  );
}
