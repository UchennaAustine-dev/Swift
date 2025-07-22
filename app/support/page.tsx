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
  Filter,
  RefreshCw,
  X,
} from "lucide-react";
import { SearchFilters } from "@/components/ui/search-filters";
import { MobileTable } from "@/components/ui/mobile-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SupportRequest, Alert } from "@/lib/types";

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

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>(
    {}
  );
  const [alerts, setAlerts] = useState(mockAlerts);
  const [isRefreshing, setIsRefreshing] = useState(false);

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
    return mockSupportRequests.filter((request) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
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

      return true;
    });
  }, [searchQuery, activeFilters]);

  const handleFilterChange = (key: string, value: string) => {
    setActiveFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setActiveFilters({});
    setSearchQuery("");
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsRefreshing(false);
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
      className: "font-medium",
    },
    {
      key: "created",
      label: "CREATED",
      className: "font-mono text-sm text-muted-foreground",
    },
  ];

  const actions = [
    {
      label: "View",
      onClick: (request: SupportRequest) => console.log("View", request.id),
    },
    {
      label: "Resolve",
      onClick: (request: SupportRequest) => console.log("Resolve", request.id),
    },
    {
      label: "Escalate",
      onClick: (request: SupportRequest) => console.log("Escalate", request.id),
      variant: "destructive" as const,
    },
  ];

  const totalAlerts = 5;
  const openAlerts = 2;
  const criticalAlerts = 2;
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
                <Badge variant="destructive" className="animate-pulse">
                  {criticalAlerts} Critical
                </Badge>
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
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
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
                <div className="flex items-center gap-2">
                  <Select defaultValue="all-severity">
                    <SelectTrigger className="w-32 bg-background/50 border-border/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-severity">All Severity</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="all-status">
                    <SelectTrigger className="w-32 bg-background/50 border-border/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-status">All Status</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="all-types">
                    <SelectTrigger className="w-32 bg-background/50 border-border/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-types">All Types</SelectItem>
                      <SelectItem value="missing-proof">
                        Missing Proof
                      </SelectItem>
                      <SelectItem value="bot-error">Bot Error</SelectItem>
                      <SelectItem value="dispute">Dispute</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    className="bg-background/50 border-border/50"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <SearchFilters
                  searchPlaceholder="Search..."
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  filterOptions={filterOptions}
                  onFilterChange={handleFilterChange}
                  onClearFilters={handleClearFilters}
                  activeFilters={activeFilters}
                />

                <MobileTable
                  data={filteredRequests}
                  columns={columns}
                  actions={actions}
                  emptyMessage="No support requests found"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
