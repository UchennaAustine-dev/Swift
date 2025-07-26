"use client";

import { useState, useMemo, useEffect } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  AlertTriangle,
  Clock,
  CheckCircle,
  FileText,
  RefreshCw,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { SearchFilters } from "@/components/ui/search-filters";
import { MobileTable } from "@/components/ui/mobile-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SupportRequestModal } from "@/components/modals/support-request-modal";
import type { SupportRequest, Alert } from "@/lib/types";
import { toast } from "sonner";

// Mock data for alerts
const mockAlerts: Alert[] = [
  {
    id: "1",
    type: "critical",
    message: "WhatsApp bot crashed - Multiple trades affected",
    timestamp: "2 minutes ago",
    status: "active",
    source: "Bot Monitor",
  },
  {
    id: "2",
    type: "high",
    message: "Missing proof submission for Trade #TXN-2025-0107",
    timestamp: "15 minutes ago",
    status: "active",
    source: "Trade System",
  },
  {
    id: "3",
    type: "low",
    message: "Rate dispute for @ethtrader_lagos",
    timestamp: "1 hour ago",
    status: "resolved",
    source: "Support",
  },
];

// Mock data for support requests
const mockSupportRequests: SupportRequest[] = [
  {
    id: "SUP-2025-001",
    user: "@cryptotrader_ng",
    issueType: "Missing Proof",
    severity: "high",
    status: "open",
    assignedTo: "support_agent",
    created: "2025-01-08 14:30:45",
    description: "User claims proof was submitted but not received",
  },
  {
    id: "SUP-2025-002",
    user: "+23481234567",
    issueType: "Bot Error",
    severity: "critical",
    status: "in_progress",
    assignedTo: "trade_manager",
    created: "2025-01-08 13:45:22",
    description: "Bot not responding to user commands",
  },
  {
    id: "SUP-2025-003",
    user: "@ethtrader_lagos",
    issueType: "Dispute",
    severity: "medium",
    status: "resolved",
    assignedTo: "support_agent",
    created: "2025-01-08 12:15:30",
    description: "Rate calculation dispute resolved",
  },
  {
    id: "SUP-2025-004",
    user: "System",
    issueType: "Timeout",
    severity: "low",
    status: "open",
    assignedTo: "Unassigned",
    created: "2025-01-08 11:20:15",
    description: "API timeout detected",
  },
  {
    id: "SUP-2025-005",
    user: "@suspicioususer",
    issueType: "Suspicious Activity",
    severity: "critical",
    status: "escalated",
    assignedTo: "super_admin",
    created: "2025-01-08 10:45:12",
    description: "Multiple failed verification attempts",
  },
  // Add more mock data for pagination testing
  ...Array.from({ length: 15 }, (_, i) => ({
    id: `SUP-2025-${String(i + 6).padStart(3, "0")}`,
    user: `@user${i + 6}`,
    issueType: [
      "Missing Proof",
      "Bot Error",
      "Dispute",
      "Timeout",
      "Suspicious Activity",
    ][Math.floor(Math.random() * 5)],
    severity: ["critical", "high", "medium", "low"][
      Math.floor(Math.random() * 4)
    ] as "critical" | "high" | "medium" | "low",
    status: ["open", "in_progress", "resolved", "escalated"][
      Math.floor(Math.random() * 4)
    ] as "open" | "in_progress" | "resolved" | "escalated",
    assignedTo: ["support_agent", "trade_manager", "super_admin", "Unassigned"][
      Math.floor(Math.random() * 4)
    ],
    created: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .replace("T", " ")
      .split(".")[0],
    description: `Support request description for issue ${i + 6}`,
  })),
];

const filterOptions = [
  {
    key: "severity",
    label: "All Severity",
    options: [
      { value: "critical", label: "Critical" },
      { value: "high", label: "High" },
      { value: "medium", label: "Medium" },
      { value: "low", label: "Low" },
    ],
  },
  {
    key: "status",
    label: "All Status",
    options: [
      { value: "open", label: "Open" },
      { value: "in_progress", label: "In Progress" },
      { value: "resolved", label: "Resolved" },
      { value: "escalated", label: "Escalated" },
    ],
  },
  {
    key: "issueType",
    label: "All Types",
    options: [
      { value: "Missing Proof", label: "Missing Proof" },
      { value: "Bot Error", label: "Bot Error" },
      { value: "Dispute", label: "Dispute" },
      { value: "Timeout", label: "Timeout" },
      { value: "Suspicious Activity", label: "Suspicious Activity" },
    ],
  },
];

const ITEMS_PER_PAGE = 10;

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>(
    {}
  );
  const [alerts, setAlerts] = useState(mockAlerts);
  const [supportRequests, setSupportRequests] = useState(mockSupportRequests);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState<SupportRequest | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dateRange, setDateRange] = useState<{ from: string; to: string }>({
    from: "",
    to: "",
  });

  // Debounced search
  useMemo(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Simulate real-time alert updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate new alerts occasionally
      if (Math.random() > 0.8) {
        const newAlert: Alert = {
          id: Date.now().toString(),
          type: ["critical", "high", "medium", "low"][
            Math.floor(Math.random() * 4)
          ] as any,
          message: "New system alert detected",
          timestamp: "Just now",
          status: "active",
          source: "System Monitor",
        };
        setAlerts((prev) => [newAlert, ...prev.slice(0, 9)]);
      }
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const filteredRequests = useMemo(() => {
    return supportRequests.filter((request) => {
      if (debouncedSearchQuery) {
        const query = debouncedSearchQuery.toLowerCase();
        if (
          !request.id.toLowerCase().includes(query) &&
          !request.user.toLowerCase().includes(query) &&
          !request.issueType.toLowerCase().includes(query)
        ) {
          return false;
        }
      }

      for (const [key, value] of Object.entries(activeFilters)) {
        if (value && request[key as keyof SupportRequest] !== value) {
          return false;
        }
      }

      // Date range filter applied here
      if (dateRange.from) {
        const fromDate = new Date(dateRange.from);
        const createdDate = new Date(request.created.replace(" ", "T")); // iso string fix
        if (createdDate < fromDate) {
          return false;
        }
      }
      if (dateRange.to) {
        const toDate = new Date(dateRange.to);
        const createdDate = new Date(request.created.replace(" ", "T"));
        if (createdDate > toDate) {
          return false;
        }
      }

      return true;
    });
  }, [supportRequests, debouncedSearchQuery, activeFilters, dateRange]);

  // Pagination
  const totalPages = Math.ceil(filteredRequests.length / ITEMS_PER_PAGE);
  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleFilterChange = (key: string, value: string) => {
    setActiveFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setActiveFilters({});
    setSearchQuery("");
    setDebouncedSearchQuery("");
    setCurrentPage(1);
    toast.success("Filters cleared");
  };

  const handleDateRangeChange = (range: { from: string; to: string }) => {
    setDateRange(range);
    setCurrentPage(1);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Simulate refreshing data
      toast.success("Support requests and alerts have been updated");
    } catch (error) {
      toast.error("Failed to refresh data. Please try again.");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleDismissAlert = (alertId: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== alertId));
    toast.success("The alert has been removed from the feed");
  };

  const handleViewRequest = (request: SupportRequest) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const handleResolveRequest = (id: string, resolution: string) => {
    setSupportRequests((prev) =>
      prev.map((req) =>
        req.id === id ? { ...req, status: "resolved" as const } : req
      )
    );
    toast.success("The support request has been marked as resolved");
  };

  const handleEscalateRequest = (id: string, reason: string) => {
    setSupportRequests((prev) =>
      prev.map((req) =>
        req.id === id
          ? { ...req, status: "escalated" as const, assignedTo: "super_admin" }
          : req
      )
    );
    toast.success(
      "The support request has been escalated to senior management"
    );
  };

  const handleAssignRequest = (id: string, assignee: string) => {
    setSupportRequests((prev) =>
      prev.map((req) =>
        req.id === id
          ? { ...req, assignedTo: assignee, status: "in_progress" as const }
          : req
      )
    );
    toast.success(`The request has been assigned to ${assignee}`);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "high":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "low":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "in_progress":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "resolved":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "escalated":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-red-400" />;
      case "high":
        return <AlertTriangle className="h-4 w-4 text-orange-400" />;
      case "medium":
        return <Clock className="h-4 w-4 text-yellow-400" />;
      case "low":
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const columns = [
    {
      key: "id",
      label: "REQUEST ID",
      render: (value: string) => (
        <Button variant="link" className="p-0 h-auto font-mono text-blue-400">
          {value}
        </Button>
      ),
    },
    {
      key: "user",
      label: "USER",
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="text-xs">
              {value.startsWith("@")
                ? value.slice(1, 3).toUpperCase()
                : value.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium">{value}</span>
        </div>
      ),
    },
    {
      key: "issueType",
      label: "ISSUE TYPE",
      render: (value: string) => (
        <Badge variant="outline" className="font-mono text-xs">
          {value}
        </Badge>
      ),
    },
    {
      key: "severity",
      label: "SEVERITY",
      render: (value: string) => (
        <Badge variant="outline" className={getSeverityColor(value)}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </Badge>
      ),
    },
    {
      key: "status",
      label: "STATUS",
      render: (value: string) => (
        <Badge variant="outline" className={getStatusColor(value)}>
          {value === "in_progress"
            ? "In Progress"
            : value.charAt(0).toUpperCase() + value.slice(1)}
        </Badge>
      ),
    },
    {
      key: "assignedTo",
      label: "ASSIGNED TO",
      render: (value: string) => (
        <span className="font-medium capitalize">
          {value === "Unassigned" ? "Unassigned" : value.replace("_", " ")}
        </span>
      ),
    },
    {
      key: "created",
      label: "CREATED",
      render: (value: string) => {
        const date = new Date(value);
        const now = new Date();
        const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

        if (diffInHours < 24) {
          return `${Math.floor(diffInHours)}h ago`;
        } else if (diffInHours < 168) {
          return `${Math.floor(diffInHours / 24)}d ago`;
        } else {
          return date.toLocaleDateString();
        }
      },
      className: "font-mono text-sm text-muted-foreground",
    },
  ];

  const actions = [
    {
      label: "View",
      onClick: handleViewRequest,
    },
    {
      label: "Resolve",
      onClick: (request: SupportRequest) =>
        handleResolveRequest(request.id, "Quick resolve"),
      condition: (request: SupportRequest) => request.status !== "resolved",
    },
    {
      label: "Escalate",
      onClick: (request: SupportRequest) =>
        handleEscalateRequest(request.id, "Manual escalation"),
      variant: "destructive" as const,
      condition: (request: SupportRequest) =>
        request.status !== "resolved" && request.status !== "escalated",
    },
  ];

  const totalAlerts = alerts.length;
  const openAlerts = alerts.filter((a) => a.status === "active").length;
  const criticalAlerts = alerts.filter(
    (a) => a.type === "critical" && a.status === "active"
  ).length;
  const resolvedToday = 8;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <div className="flex flex-1 flex-col gap-6 container-padding pt-0">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold font-poppins">
                  Support & Alerts
                </h1>
                <p className="text-muted-foreground">
                  Manage support requests and system alerts
                </p>
              </div>
              <div className="flex items-center gap-2">
                {criticalAlerts > 0 && (
                  <Badge variant="destructive" className="animate-pulse">
                    {criticalAlerts} Critical
                  </Badge>
                )}
              </div>
            </div>

            {/* Alert Metrics */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card className="card-enhanced">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Alerts
                  </CardTitle>
                  <div className="h-8 w-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <FileText className="h-4 w-4 text-blue-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold font-poppins">
                    {totalAlerts}
                  </div>
                </CardContent>
              </Card>
              <Card className="card-enhanced">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Open Alerts
                  </CardTitle>
                  <div className="h-8 w-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                    <Clock className="h-4 w-4 text-orange-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold font-poppins">
                    {openAlerts}
                  </div>
                </CardContent>
              </Card>
              <Card className="card-enhanced">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Critical Alerts
                  </CardTitle>
                  <div className="h-8 w-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                    <AlertTriangle className="h-4 w-4 text-red-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold font-poppins">
                    {criticalAlerts}
                  </div>
                </CardContent>
              </Card>
              <Card className="card-enhanced">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Resolved Today
                  </CardTitle>
                  <div className="h-8 w-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold font-poppins">
                    {resolvedToday}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Live Alert Feed */}
            <Card className="card-enhanced">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-poppins">Live Alert Feed</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="bg-background/50 border-border/50"
                >
                  <RefreshCw
                    className={`h-4 w-4 mr-2 ${
                      isRefreshing ? "animate-spin" : ""
                    }`}
                  />
                  Refresh
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {alerts.slice(0, 3).map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-3 rounded-lg border ${
                      alert.type === "critical"
                        ? "bg-red-500/10 border-red-500/30"
                        : alert.type === "high"
                        ? "bg-orange-500/10 border-orange-500/30"
                        : "bg-green-500/10 border-green-500/30"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {getAlertIcon(alert.type)}
                        <div className="flex-1">
                          <p className="font-medium">{alert.message}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {alert.timestamp}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => handleDismissAlert(alert.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Support Requests Table */}
            <Card className="card-enhanced">
              <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <CardTitle className="font-poppins">
                  All Support Requests
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <SearchFilters
                  searchPlaceholder="Search requests..."
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  filterOptions={filterOptions}
                  onFilterChange={handleFilterChange}
                  onClearFilters={handleClearFilters}
                  activeFilters={activeFilters}
                  showDateFilter={true}
                  dateRange={dateRange}
                  onDateRangeChange={handleDateRangeChange}
                />
                <MobileTable
                  data={paginatedRequests}
                  columns={columns}
                  actions={actions}
                  emptyMessage="No support requests found"
                />

                {/* Pagination */}
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
                    {Math.min(
                      currentPage * ITEMS_PER_PAGE,
                      filteredRequests.length
                    )}{" "}
                    of {filteredRequests.length} requests
                  </div>

                  {totalPages > 1 && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(1, prev - 1))
                        }
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </Button>

                      <div className="flex items-center gap-1">
                        {Array.from(
                          { length: Math.min(5, totalPages) },
                          (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                              pageNum = i + 1;
                            } else if (currentPage <= 3) {
                              pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                              pageNum = totalPages - 4 + i;
                            } else {
                              pageNum = currentPage - 2 + i;
                            }

                            return (
                              <Button
                                key={pageNum}
                                variant={
                                  currentPage === pageNum
                                    ? "default"
                                    : "outline"
                                }
                                size="sm"
                                className="w-8 h-8 p-0"
                                onClick={() => setCurrentPage(pageNum)}
                              >
                                {pageNum}
                              </Button>
                            );
                          }
                        )}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(totalPages, prev + 1)
                          )
                        }
                        disabled={currentPage === totalPages}
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <SupportRequestModal
          request={selectedRequest}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedRequest(null);
          }}
          onResolve={handleResolveRequest}
          onEscalate={handleEscalateRequest}
          onAssign={handleAssignRequest}
        />
      </SidebarInset>
    </SidebarProvider>
  );
}
