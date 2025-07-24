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
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { SearchFilters } from "@/components/ui/search-filters";
import { MobileTable } from "@/components/ui/mobile-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PayoutDetailsModal } from "@/components/modals/payout-details-modal";
import type { Payout } from "@/lib/types";
import { toast } from "sonner";

// Mock payout data
const mockPayouts: Payout[] = [
  {
    id: "1",
    payoutId: "P001",
    tradeId: "TXN001",
    userId: "1",
    user: { username: "@john_trader", platform: "telegram" },
    amount: 3275000,
    currency: "NGN",
    method: "bank",
    status: "paid",
    processedBy: "auto",
    createdAt: "2024-01-20T10:30:00Z",
  },
  {
    id: "2",
    payoutId: "P002",
    tradeId: "TXN002",
    userId: "2",
    user: { username: "@sarah_crypto", platform: "telegram" },
    amount: 85000,
    currency: "NGN",
    method: "wallet",
    status: "pending",
    processedBy: "auto",
    createdAt: "2024-01-20T14:15:00Z",
  },
  {
    id: "3",
    payoutId: "P003",
    tradeId: "TXN003",
    userId: "3",
    user: { username: "@+234812345678", platform: "whatsapp" },
    amount: 10500000,
    currency: "NGN",
    method: "bank",
    status: "failed",
    processedBy: "david_taiwo",
    failureReason: "Invalid bank account details",
    createdAt: "2024-01-20T16:45:00Z",
  },
  {
    id: "4",
    payoutId: "P004",
    tradeId: "TXN004",
    userId: "4",
    user: { username: "@mike_cards", platform: "whatsapp" },
    amount: 39000,
    currency: "NGN",
    method: "wallet",
    status: "paid",
    processedBy: "auto",
    createdAt: "2024-01-20T18:20:00Z",
  },
  {
    id: "5",
    payoutId: "P005",
    tradeId: "TXN005",
    userId: "5",
    user: { username: "@alex_eth", platform: "telegram" },
    amount: 63750,
    currency: "NGN",
    method: "bank",
    status: "pending",
    processedBy: "sarah_admin",
    createdAt: "2024-01-20T20:10:00Z",
  },
  // Add more mock data for pagination testing
  ...Array.from({ length: 20 }, (_, i) => ({
    id: `${i + 6}`,
    payoutId: `P${String(i + 6).padStart(3, "0")}`,
    tradeId: `TXN${String(i + 6).padStart(3, "0")}`,
    userId: `${i + 6}`,
    user: {
      username: `@user${i + 6}`,
      platform: i % 2 === 0 ? ("telegram" as const) : ("whatsapp" as const),
    },
    amount: Math.floor(Math.random() * 1000000) + 50000,
    currency: "NGN" as const,
    method: i % 2 === 0 ? ("bank" as const) : ("wallet" as const),
    status: ["pending", "paid", "failed"][Math.floor(Math.random() * 3)] as
      | "pending"
      | "paid"
      | "failed",
    processedBy: i % 3 === 0 ? "auto" : `admin_${i}`,
    createdAt: new Date(
      Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
    ).toISOString(),
  })),
];

const filterOptions = [
  {
    key: "status",
    label: "Status",
    options: [
      { value: "pending", label: "Pending" },
      { value: "paid", label: "Paid" },
      { value: "failed", label: "Failed" },
    ],
  },
  {
    key: "method",
    label: "Method",
    options: [
      { value: "bank", label: "Bank Transfer" },
      { value: "wallet", label: "Wallet" },
    ],
  },
  {
    key: "processedBy",
    label: "Processed By",
    options: [
      { value: "auto", label: "Automatic" },
      { value: "manual", label: "Manual" },
    ],
  },
];

const ITEMS_PER_PAGE = 10;

export default function PayoutsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>(
    {}
  );
  const [dateRange, setDateRange] = useState<{ from: string; to: string }>({
    from: "",
    to: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPayout, setSelectedPayout] = useState<Payout | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [payouts, setPayouts] = useState(mockPayouts);
  const [isExporting, setIsExporting] = useState(false);

  // Debounced search
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  useMemo(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const filteredPayouts = useMemo(() => {
    return payouts.filter((payout) => {
      // Search filter
      if (debouncedSearchQuery) {
        const query = debouncedSearchQuery.toLowerCase();
        if (
          !payout.payoutId.toLowerCase().includes(query) &&
          !payout.tradeId.toLowerCase().includes(query) &&
          !payout.user.username.toLowerCase().includes(query)
        ) {
          return false;
        }
      }

      // Date range filter
      if (dateRange.from || dateRange.to) {
        const payoutDate = new Date(payout.createdAt);
        if (dateRange.from && payoutDate < new Date(dateRange.from)) {
          return false;
        }
        if (dateRange.to && payoutDate > new Date(dateRange.to)) {
          return false;
        }
      }

      // Status filter
      if (activeFilters.status && payout.status !== activeFilters.status) {
        return false;
      }

      // Method filter
      if (activeFilters.method && payout.method !== activeFilters.method) {
        return false;
      }

      // Processed by filter
      if (activeFilters.processedBy) {
        if (
          activeFilters.processedBy === "auto" &&
          payout.processedBy !== "auto"
        ) {
          return false;
        }
        if (
          activeFilters.processedBy === "manual" &&
          payout.processedBy === "auto"
        ) {
          return false;
        }
      }

      return true;
    });
  }, [payouts, debouncedSearchQuery, activeFilters, dateRange]);

  // Pagination
  const totalPages = Math.ceil(filteredPayouts.length / ITEMS_PER_PAGE);
  const paginatedPayouts = filteredPayouts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleFilterChange = (key: string, value: string) => {
    setActiveFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleClearFilters = () => {
    setActiveFilters({});
    setSearchQuery("");
    setDebouncedSearchQuery("");
    setDateRange({ from: "", to: "" });
    setCurrentPage(1);
  };

  const handleDateRangeChange = (range: { from: string; to: string }) => {
    setDateRange(range);
    setCurrentPage(1);
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      // Simulate export process
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Create CSV content
      const headers = [
        "Payout ID",
        "Trade ID",
        "User",
        "Amount",
        "Method",
        "Status",
        "Processed By",
        "Created",
      ];
      const csvContent = [
        headers.join(","),
        ...filteredPayouts.map((payout) =>
          [
            payout.payoutId,
            payout.tradeId,
            payout.user.username,
            `${payout.currency}${payout.amount}`,
            payout.method,
            payout.status,
            payout.processedBy,
            new Date(payout.createdAt).toLocaleString(),
          ].join(",")
        ),
      ].join("\n");

      // Download CSV
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `payouts-export-${
        new Date().toISOString().split("T")[0]
      }.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success(`Exported ${filteredPayouts.length} payouts to CSV`);
    } catch (error) {
      toast.error("Failed to export payouts. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleViewDetails = (payout: Payout) => {
    setSelectedPayout(payout);
    setIsModalOpen(true);
  };

  const handleRetryPayment = (id: string) => {
    setPayouts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "pending" as const } : p))
    );
    toast.success("The payment has been queued for retry");
  };

  const handleMarkAsPaid = (id: string) => {
    setPayouts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "paid" as const } : p))
    );
    toast.success("The payout status has been updated");
  };

  const handleCancelPayout = (id: string) => {
    setPayouts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              status: "failed" as const,
              failureReason: "Cancelled by admin",
            }
          : p
      )
    );
    toast.success("The payout has been cancelled");
  };

  const columns = [
    {
      key: "payoutId",
      label: "Payout ID",
      className: "font-mono font-medium",
    },
    {
      key: "tradeId",
      label: "Trade ID",
      render: (value: string) => (
        <Button variant="link" className="p-0 h-auto font-mono text-blue-600">
          {value}
        </Button>
      ),
    },
    {
      key: "user",
      label: "User",
      render: (_: any, row: Payout) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback>
              {row.user.username.slice(1, 3).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">{row.user.username}</span>
            <Badge
              variant="outline"
              className={`text-xs w-fit ${
                row.user.platform === "telegram"
                  ? "border-blue-500 text-blue-600"
                  : "border-green-500 text-green-600"
              }`}
            >
              {row.user.platform}
            </Badge>
          </div>
        </div>
      ),
    },
    {
      key: "amount",
      label: "Amount",
      render: (value: number, row: Payout) => (
        <span className="font-mono font-semibold">
          {row.currency}
          {new Intl.NumberFormat("en-NG").format(value)}
        </span>
      ),
    },
    {
      key: "method",
      label: "Method",
      render: (value: string) => (
        <Badge variant="outline">
          {value === "bank" ? "Bank Transfer" : "Wallet"}
        </Badge>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (value: string) => (
        <Badge
          variant={
            value === "paid"
              ? "default"
              : value === "pending"
              ? "secondary"
              : "destructive"
          }
          className={
            value === "paid"
              ? "bg-green-500"
              : value === "pending"
              ? "bg-yellow-500"
              : ""
          }
        >
          {value === "paid" && <CheckCircle className="h-3 w-3 mr-1" />}
          {value === "pending" && <Clock className="h-3 w-3 mr-1" />}
          {value === "failed" && <XCircle className="h-3 w-3 mr-1" />}
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </Badge>
      ),
    },
    {
      key: "processedBy",
      label: "Processed By",
      render: (value: string) => (
        <span className="text-sm text-muted-foreground capitalize">
          {value === "auto" ? "Automatic" : value}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Created",
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
      className: "text-muted-foreground text-sm",
    },
  ];

  const actions = [
    {
      label: "View Details",
      onClick: handleViewDetails,
    },
    {
      label: "Retry Payment",
      onClick: (payout: Payout) => handleRetryPayment(payout.id),
      condition: (payout: Payout) => payout.status === "failed",
    },
    {
      label: "Mark as Paid",
      onClick: (payout: Payout) => handleMarkAsPaid(payout.id),
      condition: (payout: Payout) => payout.status === "pending",
    },
    {
      label: "Cancel",
      onClick: (payout: Payout) => handleCancelPayout(payout.id),
      variant: "destructive" as const,
      condition: (payout: Payout) => payout.status !== "paid",
    },
  ];

  const mobileCardRender = (payout: Payout) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="font-mono font-semibold">{payout.payoutId}</div>
        <Badge
          variant={
            payout.status === "paid"
              ? "default"
              : payout.status === "pending"
              ? "secondary"
              : "destructive"
          }
          className={
            payout.status === "paid"
              ? "bg-green-500"
              : payout.status === "pending"
              ? "bg-yellow-500"
              : ""
          }
        >
          {payout.status === "paid" && <CheckCircle className="h-3 w-3 mr-1" />}
          {payout.status === "pending" && <Clock className="h-3 w-3 mr-1" />}
          {payout.status === "failed" && <XCircle className="h-3 w-3 mr-1" />}
          {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
        </Badge>
      </div>
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8">
          <AvatarFallback>
            {payout.user.username.slice(1, 3).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="font-medium">{payout.user.username}</div>
          <Badge
            variant="outline"
            className={`text-xs w-fit ${
              payout.user.platform === "telegram"
                ? "border-blue-500 text-blue-600"
                : "border-green-500 text-green-600"
            }`}
          >
            {payout.user.platform}
          </Badge>
        </div>
      </div>
      <div className="text-xl font-mono font-bold">
        {payout.currency}
        {new Intl.NumberFormat("en-NG").format(payout.amount)}
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-muted-foreground">Trade ID:</span>
          <div className="font-mono font-medium text-blue-600">
            {payout.tradeId}
          </div>
        </div>
        <div>
          <span className="text-muted-foreground">Method:</span>
          <div className="font-medium">
            {payout.method === "bank" ? "Bank Transfer" : "Wallet"}
          </div>
        </div>
        <div>
          <span className="text-muted-foreground">Processed By:</span>
          <div className="font-medium capitalize">
            {payout.processedBy === "auto" ? "Automatic" : payout.processedBy}
          </div>
        </div>
        <div>
          <span className="text-muted-foreground">Created:</span>
          <div className="text-sm">
            {(() => {
              const date = new Date(payout.createdAt);
              const now = new Date();
              const diffInHours =
                (now.getTime() - date.getTime()) / (1000 * 60 * 60);

              if (diffInHours < 24) {
                return `${Math.floor(diffInHours)}h ago`;
              } else if (diffInHours < 168) {
                return `${Math.floor(diffInHours / 24)}d ago`;
              } else {
                return date.toLocaleDateString();
              }
            })()}
          </div>
        </div>
      </div>
      {payout.failureReason && (
        <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-md">
          <span className="text-sm text-red-600 dark:text-red-400">
            <strong>Failure Reason:</strong> {payout.failureReason}
          </span>
        </div>
      )}
    </div>
  );

  const totalAmount = payouts.reduce((acc, p) => acc + p.amount, 0);
  const paidAmount = payouts
    .filter((p) => p.status === "paid")
    .reduce((acc, p) => acc + p.amount, 0);
  const pendingCount = payouts.filter((p) => p.status === "pending").length;
  const failedCount = payouts.filter((p) => p.status === "failed").length;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="fixed-header-layout">
        <Header />
        <div className="scrollable-content flex flex-1 flex-col gap-4 p-4">
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight font-poppins">
                Payout Logs
              </h1>
              <p className="text-muted-foreground">
                Track and manage all payment transactions.
              </p>
            </div>

            {/* Overview Cards */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Payouts
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold font-mono">
                    ₦{new Intl.NumberFormat("en-NG").format(totalAmount)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {payouts.length} transactions
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Paid Out
                  </CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold font-mono">
                    ₦{new Intl.NumberFormat("en-NG").format(paidAmount)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {((paidAmount / totalAmount) * 100).toFixed(1)}% of total
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending</CardTitle>
                  <Clock className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{pendingCount}</div>
                  <p className="text-xs text-muted-foreground">
                    Awaiting processing
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Failed</CardTitle>
                  <XCircle className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{failedCount}</div>
                  <p className="text-xs text-muted-foreground">
                    Need attention
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <SearchFilters
                searchPlaceholder="Search payouts..."
                filters={filterOptions}
                onSearch={setSearchQuery}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
                activeFilters={activeFilters}
                showDateFilter={true}
                dateRange={dateRange}
                onDateRangeChange={handleDateRangeChange}
                className="flex-1"
              />
              <Button
                className="sm:ml-4"
                onClick={handleExport}
                disabled={isExporting}
              >
                <Download className="mr-2 h-4 w-4" />
                {isExporting ? "Exporting..." : "Export"}
              </Button>
            </div>

            <MobileTable
              columns={columns}
              data={paginatedPayouts}
              actions={actions}
              mobileCardRender={mobileCardRender}
              emptyMessage="No payouts found matching your criteria."
            />

            {/* Pagination */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredPayouts.length)}{" "}
                of {filteredPayouts.length} payouts
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
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
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
                            currentPage === pageNum ? "default" : "outline"
                          }
                          size="sm"
                          className="w-8 h-8 p-0"
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        <PayoutDetailsModal
          payout={selectedPayout}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedPayout(null);
          }}
          onRetry={handleRetryPayment}
          onMarkPaid={handleMarkAsPaid}
          onCancel={handleCancelPayout}
        />
      </SidebarInset>
    </SidebarProvider>
  );
}
