"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Download,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Eye,
  FileText,
  Calculator,
  Ban,
  TrendingUp,
  Search,
  Zap,
  FileSpreadsheet,
  Database,
  LoaderCircle,
} from "lucide-react";
import { SearchFilters } from "@/components/ui/search-filters";
import { MobileTable } from "@/components/ui/mobile-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { formatDistanceToNow, format } from "date-fns";
import { TradeModal } from "@/components/modals/trade-modal";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";

// Types
interface User {
  username: string;
  platform: "telegram" | "whatsapp";
}

interface Trade {
  id: string;
  userId: string;
  user: User;
  assetType: string;
  amount: string;
  status:
    | "started"
    | "awaiting_proof"
    | "rate_set"
    | "paid"
    | "completed"
    | "cancelled";
  rate: number;
  payout: number;
  createdAt: string;
  updatedAt: string;
  flags: string[];
  notes: string;
}

// ExportDropdown Component
interface ExportDropdownProps {
  data: any[];
  filename: string;
  className?: string;
}

function ExportDropdown({ data, filename, className }: ExportDropdownProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState<string | null>(null);

  const handleExportStart = (type: string) => {
    setIsExporting(true);
    setExportType(type);
  };

  const handleExportEnd = (success: boolean, message: string) => {
    setIsExporting(false);
    setExportType(null);
    toast[success ? "success" : "error"](message);
  };

  const exportToCSV = async () => {
    handleExportStart("CSV");
    try {
      if (!data || data.length === 0) {
        handleExportEnd(false, "No data to export");
        return;
      }

      const headers = Object.keys(data[0]);
      const csvContent = [
        headers.join(","),
        ...data.map((row) =>
          headers
            .map((header) => {
              const value = row[header];
              if (
                typeof value === "string" &&
                (value.includes(",") || value.includes('"'))
              ) {
                return `"${value.replace(/"/g, '""')}"`;
              }
              return value ?? "";
            })
            .join(",")
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${filename}.csv`;
      link.click();

      handleExportEnd(true, "CSV exported successfully");
    } catch (error) {
      handleExportEnd(false, "Failed to export CSV");
    }
  };

  const exportToJSON = async () => {
    handleExportStart("JSON");
    try {
      if (!data || data.length === 0) {
        handleExportEnd(false, "No data to export");
        return;
      }

      const jsonData = {
        exportDate: new Date().toISOString(),
        filename: filename,
        totalRecords: data.length,
        data: data,
      };

      const blob = new Blob([JSON.stringify(jsonData, null, 2)], {
        type: "application/json",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${filename}.json`;
      link.click();

      handleExportEnd(true, "JSON exported successfully");
    } catch (error) {
      handleExportEnd(false, "Failed to export JSON");
    }
  };

  const exportToExcel = async () => {
    handleExportStart("Excel");
    try {
      if (!data || data.length === 0) {
        handleExportEnd(false, "No data to export");
        return;
      }
      const headers = Object.keys(data[0]);
      const tsvContent = [
        headers.join("\t"),
        ...data.map((row) =>
          headers.map((header) => row[header] ?? "").join("\t")
        ),
      ].join("\n");

      const blob = new Blob([tsvContent], {
        type: "application/vnd.ms-excel",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${filename}.xls`;
      link.click();

      handleExportEnd(true, "Excel (XLS) exported successfully");
    } catch (error) {
      handleExportEnd(false, "Failed to export Excel (XLS)");
    }
  };

  const menuItemClasses =
    "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary transition-colors duration-150";

  const buttonClasses = `${
    className ?? ""
  } cursor-pointer hover:bg-blue-300 dark:hover:bg-blue-700 transition-colors duration-150`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={buttonClasses}
          disabled={isExporting}
          aria-label="Export data"
        >
          {isExporting && exportType ? (
            <LoaderCircle className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Download className="h-4 w-4 mr-2" />
          )}
          {isExporting ? `Exporting ${exportType}...` : "Export"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-popover" forceMount>
        <DropdownMenuItem
          onClick={exportToCSV}
          disabled={isExporting}
          className={menuItemClasses}
        >
          <FileSpreadsheet className="h-4 w-4 mr-2 text-green-500" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={exportToExcel}
          disabled={isExporting}
          className={menuItemClasses}
        >
          <FileSpreadsheet className="h-4 w-4 mr-2 text-blue-600" />
          Export as Excel (XLS)
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={exportToJSON}
          disabled={isExporting}
          className={menuItemClasses}
        >
          <Database className="h-4 w-4 mr-2 text-yellow-600" />
          Export as JSON
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Enhanced mock trade data
const mockTrades: Trade[] = [
  {
    id: "TXN001",
    userId: "1",
    user: { username: "@john_trader", platform: "telegram" },
    assetType: "Bitcoin",
    amount: "0.05 BTC",
    status: "completed",
    rate: 65500000,
    payout: 3275000,
    createdAt: "2024-01-20T10:30:00Z",
    updatedAt: "2024-01-20T12:30:00Z",
    flags: [],
    notes: "Verified transaction, quick completion",
  },
  {
    id: "TXN002",
    userId: "2",
    user: { username: "@sarah_crypto", platform: "telegram" },
    assetType: "Amazon Gift Card",
    amount: "$100",
    status: "awaiting_proof",
    rate: 850,
    payout: 85000,
    createdAt: "2024-01-20T14:15:00Z",
    updatedAt: "2024-01-20T14:15:00Z",
    flags: ["missing_proof", "delayed_response"],
    notes: "",
  },
  {
    id: "TXN003",
    userId: "3",
    user: { username: "+234812345678", platform: "whatsapp" },
    assetType: "Ethereum",
    amount: "2.5 ETH",
    status: "started",
    rate: 4200000,
    payout: 10500000,
    createdAt: "2024-01-20T16:45:00Z",
    updatedAt: "2024-01-20T16:45:00Z",
    flags: [],
    notes: "Large transaction, monitoring closely",
  },
  {
    id: "TXN004",
    userId: "4",
    user: { username: "@mike_cards", platform: "whatsapp" },
    assetType: "iTunes Gift Card",
    amount: "$50",
    status: "rate_set",
    rate: 780,
    payout: 39000,
    createdAt: "2024-01-20T18:20:00Z",
    updatedAt: "2024-01-20T18:25:00Z",
    flags: [],
    notes: "",
  },
  {
    id: "TXN005",
    userId: "5",
    user: { username: "@alex_eth", platform: "telegram" },
    assetType: "Steam Gift Card",
    amount: "$75",
    status: "cancelled",
    rate: 850,
    payout: 63750,
    createdAt: "2024-01-20T20:10:00Z",
    updatedAt: "2024-01-20T20:15:00Z",
    flags: ["suspicious", "user_requested_cancel"],
    notes: "User requested cancellation due to rate concerns",
  },
  {
    id: "TXN006",
    userId: "6",
    user: { username: "@crypto_king", platform: "telegram" },
    assetType: "Bitcoin",
    amount: "0.1 BTC",
    status: "paid",
    rate: 65800000,
    payout: 6580000,
    createdAt: "2024-01-21T09:15:00Z",
    updatedAt: "2024-01-21T11:30:00Z",
    flags: [],
    notes: "Payment processed successfully",
  },
];

const filterOptions = [
  {
    key: "status",
    label: "All Status",
    options: [
      { value: "started", label: "Started" },
      { value: "awaiting_proof", label: "Awaiting Proof" },
      { value: "rate_set", label: "Rate Set" },
      { value: "paid", label: "Paid" },
      { value: "completed", label: "Completed" },
      { value: "cancelled", label: "Cancelled" },
    ],
  },
  {
    key: "assetType",
    label: "All Assets",
    options: [
      { value: "Bitcoin", label: "Bitcoin" },
      { value: "Ethereum", label: "Ethereum" },
      { value: "Amazon Gift Card", label: "Amazon Gift Card" },
      { value: "iTunes Gift Card", label: "iTunes Gift Card" },
      { value: "Steam Gift Card", label: "Steam Gift Card" },
    ],
  },
  {
    key: "platform",
    label: "All Platforms",
    options: [
      { value: "telegram", label: "Telegram" },
      { value: "whatsapp", label: "WhatsApp" },
    ],
  },
];

// Custom hook for debounced search
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

type SortField = "id" | "createdAt" | "rate" | "payout" | "status";
type SortDirection = "asc" | "desc";

// Loading skeleton component
const TableSkeleton = () => (
  <div className="space-y-4">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="flex items-center space-x-4 p-4">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[150px]" />
        </div>
        <Skeleton className="h-8 w-[100px]" />
        <Skeleton className="h-8 w-[80px]" />
      </div>
    ))}
  </div>
);

// Empty state component
const EmptyState = ({
  searchQuery,
  hasFilters,
  onClearFilters,
}: {
  searchQuery: string;
  hasFilters: boolean;
  onClearFilters: () => void;
}) => (
  <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
    <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
      <Search className="h-12 w-12 text-muted-foreground" />
    </div>
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">
        {searchQuery || hasFilters ? "No trades found" : "No trades yet"}
      </h3>
      <p className="text-muted-foreground max-w-md">
        {searchQuery || hasFilters
          ? "Try adjusting your search or filters to find what you're looking for."
          : "Trades will appear here once users start trading."}
      </p>
    </div>
    {(searchQuery || hasFilters) && (
      <Button variant="outline" onClick={onClearFilters}>
        Clear filters
      </Button>
    )}
  </div>
);

export default function TradesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>(
    {}
  );
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [modalMode, setModalMode] = useState<
    "view" | "note" | "recalculate" | "cancel"
  >("view");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [trades, setTrades] = useState<Trade[]>(mockTrades);
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [selectedTrades, setSelectedTrades] = useState<string[]>([]);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Simulate initial loading
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const filteredTrades = useMemo(() => {
    const filtered = trades.filter((trade) => {
      if (debouncedSearchQuery) {
        const query = debouncedSearchQuery.toLowerCase();
        if (
          !trade.id.toLowerCase().includes(query) &&
          !trade.user.username.toLowerCase().includes(query) &&
          !trade.assetType.toLowerCase().includes(query)
        ) {
          return false;
        }
      }

      if (activeFilters.status && trade.status !== activeFilters.status)
        return false;
      if (
        activeFilters.assetType &&
        trade.assetType !== activeFilters.assetType
      )
        return false;
      if (
        activeFilters.platform &&
        trade.user.platform !== activeFilters.platform
      )
        return false;

      return true;
    });

    filtered.sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      if (sortField === "createdAt") {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (sortDirection === "asc") return aValue > bValue ? 1 : -1;
      else return aValue < bValue ? 1 : -1;
    });

    return filtered;
  }, [debouncedSearchQuery, activeFilters, trades, sortField, sortDirection]);

  const totalPages = Math.ceil(filteredTrades.length / pageSize);
  const paginatedTrades = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTrades.slice(start, start + pageSize);
  }, [filteredTrades, currentPage, pageSize]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery, activeFilters, pageSize]);

  const handleFilterChange = useCallback((key: string, value: string) => {
    setActiveFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setActiveFilters({});
    setSearchQuery("");
  }, []);

  const handlePageSizeChange = useCallback((value: string) => {
    setPageSize(Number(value));
  }, []);

  const handleSort = useCallback(
    (field: SortField) => {
      if (sortField === field) {
        setSortDirection(sortDirection === "asc" ? "desc" : "asc");
      } else {
        setSortField(field);
        setSortDirection("asc");
      }
    },
    [sortField, sortDirection]
  );

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Data refreshed", {
        description: "Trade data has been updated.",
      });
    } catch (error) {
      toast.error("Refresh failed", {
        description: "Unable to refresh data. Please try again.",
      });
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  const handleTradeUpdate = useCallback((updatedTrade: Trade | any) => {
    setTrades((prev) =>
      prev.map((t) => (t.id === updatedTrade.id ? updatedTrade : t))
    );
    toast.success("Trade Updated", {
      description: "Trade information has been updated successfully.",
    });
  }, []);

  const handleTradeCancel = useCallback((tradeId: string) => {
    setTrades((prev) =>
      prev.map((t) =>
        t.id === tradeId
          ? {
              ...t,
              status: "cancelled" as const,
              updatedAt: new Date().toISOString(),
            }
          : t
      )
    );
    toast.success("Trade Cancelled", {
      description: "Trade has been cancelled successfully.",
    });
  }, []);

  const handleQuickStatusChange = useCallback(
    async (tradeId: string, newStatus: Trade["status"]) => {
      try {
        setTrades((prev) =>
          prev.map((t) =>
            t.id === tradeId
              ? { ...t, status: newStatus, updatedAt: new Date().toISOString() }
              : t
          )
        );
        toast.success("Status Updated", {
          description: `Trade status changed to ${newStatus.replace(
            "_",
            " "
          )}.`,
        });
      } catch (error) {
        toast.error("Update Failed", {
          description: "Unable to update trade status.",
        });
      }
    },
    []
  );

  const getSortIcon = (field: SortField) => {
    if (sortField !== field)
      return <ArrowUpDown className="h-4 w-4 opacity-50" />;
    return sortDirection === "asc" ? (
      <ArrowUp className="h-4 w-4" />
    ) : (
      <ArrowDown className="h-4 w-4" />
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "awaiting_proof":
        return <Clock className="h-4 w-4 text-orange-500" />;
      case "paid":
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-700 border-green-200";
      case "cancelled":
        return "bg-red-500/10 text-red-700 border-red-200";
      case "awaiting_proof":
        return "bg-orange-500/10 text-orange-700 border-orange-200";
      case "paid":
        return "bg-blue-500/10 text-blue-700 border-blue-200";
      case "rate_set":
        return "bg-purple-500/10 text-purple-700 border-purple-200";
      default:
        return "bg-gray-500/10 text-gray-700 border-gray-200";
    }
  };

  const renderFlags = (flags: string[]) => {
    if (flags.length === 0)
      return <span className="text-muted-foreground text-sm">None</span>;

    if (flags.length === 1) {
      return (
        <Badge variant="destructive" className="text-xs">
          {flags[0].replace("_", " ")}
        </Badge>
      );
    }

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1 cursor-pointer">
              <Badge variant="destructive" className="text-xs">
                {flags[0].replace("_", " ")}
              </Badge>
              <Badge variant="outline" className="text-xs">
                +{flags.length - 1}
              </Badge>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="space-y-1">
              {flags.map((flag, i) => (
                <div key={i} className="text-sm">
                  {flag.replace("_", " ")}
                </div>
              ))}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  const highlightSearchTerm = (text: string, searchTerm: string) => {
    if (!searchTerm) return text;

    const regex = new RegExp(`(${searchTerm})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark
          key={index}
          className="bg-yellow-200 text-yellow-900 px-1 rounded"
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  // Prepare export data
  const exportData = useMemo(() => {
    return filteredTrades.map((trade) => ({
      "Trade ID": trade.id,
      User: trade.user.username,
      Platform: trade.user.platform,
      "Asset Type": trade.assetType,
      Amount: trade.amount,
      Status: trade.status,
      "Rate (₦)": trade.rate,
      "Payout (₦)": trade.payout,
      "Created At": format(new Date(trade.createdAt), "yyyy-MM-dd HH:mm:ss"),
      "Updated At": format(new Date(trade.updatedAt), "yyyy-MM-dd HH:mm:ss"),
      Flags: trade.flags.join("; "),
      Notes: trade.notes || "",
    }));
  }, [filteredTrades]);

  const columns = [
    {
      key: "id",
      label: "Trade ID",
      className: "font-mono font-medium",
      sortable: true,
      render: (value: string) => (
        <Button
          variant="link"
          className="p-0 h-auto font-mono text-blue-400 hover:text-blue-300 text-left"
          onClick={() => handleSort("id")}
        >
          <div className="flex items-center gap-2">
            {highlightSearchTerm(value, debouncedSearchQuery)}
            {getSortIcon("id")}
          </div>
        </Button>
      ),
    },
    {
      key: "user",
      label: "User",
      render: (_: any, row: Trade) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs">
              {row.user.username.slice(1, 3).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">
              {highlightSearchTerm(row.user.username, debouncedSearchQuery)}
            </span>
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
      key: "assetType",
      label: "Asset Type",
      render: (value: string) => (
        <Badge
          variant="outline"
          className={cn(
            "font-medium",
            value.includes("Bitcoin")
              ? "border-orange-500 text-orange-600 bg-orange-50"
              : value.includes("Ethereum")
              ? "border-blue-500 text-blue-600 bg-blue-50"
              : "border-purple-500 text-purple-600 bg-purple-50"
          )}
        >
          {highlightSearchTerm(value, debouncedSearchQuery)}
        </Badge>
      ),
    },
    {
      key: "amount",
      label: "Amount",
      className: "font-mono font-medium",
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (value: string, row: Trade) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-auto p-1 hover:bg-transparent">
              <div className="flex items-center gap-2">
                {getStatusIcon(value)}
                <Badge
                  className={cn(
                    "text-xs cursor-pointer",
                    getStatusColor(value)
                  )}
                >
                  {value.replace("_", " ")}
                </Badge>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem
              onClick={() => handleQuickStatusChange(row.id, "started")}
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Started
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleQuickStatusChange(row.id, "awaiting_proof")}
            >
              <Clock className="h-4 w-4 mr-2" />
              Awaiting Proof
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleQuickStatusChange(row.id, "rate_set")}
            >
              <Calculator className="h-4 w-4 mr-2" />
              Rate Set
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleQuickStatusChange(row.id, "paid")}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Paid
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleQuickStatusChange(row.id, "completed")}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Completed
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleQuickStatusChange(row.id, "cancelled")}
              className="text-red-600"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Cancel
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
    {
      key: "rate",
      label: "Rate",
      sortable: true,
      render: (value: number) => (
        <Button
          variant="link"
          className="p-0 h-auto font-mono text-left"
          onClick={() => handleSort("rate")}
        >
          <div className="flex items-center gap-2">
            ₦{value.toLocaleString()}
            {getSortIcon("rate")}
          </div>
        </Button>
      ),
    },
    {
      key: "payout",
      label: "Payout",
      sortable: true,
      render: (value: number) => (
        <Button
          variant="link"
          className="p-0 h-auto font-mono text-left"
          onClick={() => handleSort("payout")}
        >
          <div className="flex items-center gap-2">
            <span className="text-green-600 font-semibold">
              ₦{value.toLocaleString()}
            </span>
            {getSortIcon("payout")}
          </div>
        </Button>
      ),
    },
    {
      key: "createdAt",
      label: "Created",
      sortable: true,
      render: (value: string) => (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="link"
                className="p-0 h-auto text-sm text-left"
                onClick={() => handleSort("createdAt")}
              >
                <div className="flex items-center gap-2">
                  {formatDistanceToNow(new Date(value), { addSuffix: true })}
                  {getSortIcon("createdAt")}
                </div>
              </Button>
            </TooltipTrigger>
            <TooltipContent>{format(new Date(value), "PPpp")}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
    },
    {
      key: "flags",
      label: "Flags",
      render: (flags: string[]) => renderFlags(flags),
    },
  ];

  const actions = [
    {
      label: "View Details",
      icon: Eye,
      onClick: (trade: Trade) => {
        setSelectedTrade(trade);
        setModalMode("view");
        setIsModalOpen(true);
      },
    },
    {
      label: "Add Note",
      icon: FileText,
      onClick: (trade: Trade) => {
        setSelectedTrade(trade);
        setModalMode("note");
        setIsModalOpen(true);
      },
    },
    {
      label: "Recalculate",
      icon: Calculator,
      onClick: (trade: Trade) => {
        setSelectedTrade(trade);
        setModalMode("recalculate");
        setIsModalOpen(true);
      },
    },
    {
      label: "Cancel Trade",
      icon: Ban,
      onClick: (trade: Trade) => {
        setSelectedTrade(trade);
        setModalMode("cancel");
        setIsModalOpen(true);
      },
      variant: "destructive" as const,
    },
  ];

  const mobileCardRender = (trade: Trade) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="font-mono font-semibold">
          {highlightSearchTerm(trade.id, debouncedSearchQuery)}
        </div>
        <div className="flex items-center gap-2">
          {getStatusIcon(trade.status)}
          <Badge className={cn("text-xs", getStatusColor(trade.status))}>
            {trade.status.replace("_", " ")}
          </Badge>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="text-xs">
            {trade.user.username.slice(1, 3).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="font-medium">
            {highlightSearchTerm(trade.user.username, debouncedSearchQuery)}
          </div>
          <Badge
            variant="outline"
            className={`text-xs w-fit ${
              trade.user.platform === "telegram"
                ? "border-blue-500 text-blue-600"
                : "border-green-500 text-green-600"
            }`}
          >
            {trade.user.platform}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-muted-foreground">Asset:</span>
          <div className="mt-1">
            <Badge
              variant="outline"
              className={cn(
                "font-medium",
                trade.assetType.includes("Bitcoin")
                  ? "border-orange-500 text-orange-600 bg-orange-50"
                  : trade.assetType.includes("Ethereum")
                  ? "border-blue-500 text-blue-600 bg-blue-50"
                  : "border-purple-500 text-purple-600 bg-purple-50"
              )}
            >
              {highlightSearchTerm(trade.assetType, debouncedSearchQuery)}
            </Badge>
          </div>
        </div>
        <div>
          <span className="text-muted-foreground">Amount:</span>
          <div className="font-mono font-medium">{trade.amount}</div>
        </div>
        <div>
          <span className="text-muted-foreground">Rate:</span>
          <div className="font-mono font-medium">
            ₦{trade.rate?.toLocaleString()}
          </div>
        </div>
        <div>
          <span className="text-muted-foreground">Payout:</span>
          <div className="font-mono font-medium text-green-600">
            ₦{trade.payout?.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="text-sm">
        <span className="text-muted-foreground">Created:</span>
        <div className="mt-1">
          {formatDistanceToNow(new Date(trade.createdAt), { addSuffix: true })}
        </div>
      </div>

      {trade.flags.length > 0 && (
        <div>
          <span className="text-muted-foreground text-sm">Flags:</span>
          <div className="mt-1">{renderFlags(trade.flags)}</div>
        </div>
      )}
    </div>
  );

  // Statistics
  const totalTrades = trades.length;
  const completedTrades = trades.filter((t) => t.status === "completed").length;
  const pendingTrades = trades.filter((t) =>
    ["started", "awaiting_proof", "rate_set"].includes(t.status)
  ).length;
  const flaggedTrades = trades.filter((t) => t.flags.length > 0).length;

  // Calculate completion rate
  const completionRate =
    totalTrades > 0 ? (completedTrades / totalTrades) * 100 : 0;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 bg-background">
          <div className="container-padding py-4 md:py-6 lg:py-8 space-y-6">
            {/* Breadcrumb + Page header */}
            <div className="flex flex-col space-y-4">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      href="/"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      Dashboard
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="font-medium">
                      Trade Management
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>

              <div className="flex flex-col space-y-2 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
                <div className="space-y-1">
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold font-poppins tracking-tight">
                    Trade Management
                  </h1>
                  <p className="text-sm md:text-base text-muted-foreground">
                    Monitor and manage all trading activities with real-time
                    updates.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <Button
                    variant="outline"
                    className="hover:text-white hover:border-none bg-green-600 hover:bg-green-700 text-white cursor-pointer"
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                  >
                    <RefreshCw
                      className={cn(
                        "h-4 w-4 mr-2",
                        isRefreshing && "animate-spin"
                      )}
                    />
                    {isRefreshing ? "Refreshing..." : "Refresh"}
                  </Button>

                  <ExportDropdown
                    data={exportData}
                    filename={`trades_export_${format(
                      new Date(),
                      "yyyy-MM-dd"
                    )}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  />
                </div>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
              <Card className="card-enhanced hover:shadow-lg transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                    Total Trades
                  </CardTitle>
                  <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <Zap className="h-4 w-4 text-blue-500" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-1">
                  <div className="text-xl sm:text-2xl font-bold font-poppins">
                    {totalTrades}
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    <span>All time</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-enhanced hover:shadow-lg transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                    Completed
                  </CardTitle>
                  <div className="h-8 w-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-xl sm:text-2xl font-bold font-poppins">
                    {completedTrades}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        Success rate
                      </span>
                      <span className="font-medium">
                        {completionRate.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={completionRate} className="h-1" />
                  </div>
                </CardContent>
              </Card>

              <Card className="card-enhanced hover:shadow-lg transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                    Pending
                  </CardTitle>
                  <div className="h-8 w-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                    <Clock className="h-4 w-4 text-orange-500" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-1">
                  <div className="text-xl sm:text-2xl font-bold font-poppins">
                    {pendingTrades}
                  </div>
                  <div className="flex items-center text-xs text-orange-600">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>Needs attention</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-enhanced hover:shadow-lg transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                    Flagged
                  </CardTitle>
                  <div className="h-8 w-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-1">
                  <div className="text-xl sm:text-2xl font-bold font-poppins">
                    {flaggedTrades}
                  </div>
                  <div className="flex items-center text-xs text-red-600">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    <span>Review required</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <SearchFilters
                searchPlaceholder="Search by Trade ID, user, or asset..."
                filterOptions={filterOptions}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
                activeFilters={activeFilters}
                className="flex-1"
              />
            </div>

            {/* Trades Table */}
            <Card className="card-enhanced shadow-sm">
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="p-6">
                    <TableSkeleton />
                  </div>
                ) : filteredTrades.length === 0 ? (
                  <EmptyState
                    searchQuery={debouncedSearchQuery}
                    hasFilters={Object.values(activeFilters).some(Boolean)}
                    onClearFilters={handleClearFilters}
                  />
                ) : (
                  <>
                    <div className="rounded-lg border border-border/50 overflow-hidden">
                      <MobileTable
                        columns={columns}
                        data={paginatedTrades}
                        actions={actions}
                        mobileCardRender={mobileCardRender}
                        emptyMessage="No trades found matching your criteria."
                      />
                    </div>

                    {/* Pagination Controls */}
                    <div className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <span>Results per page:</span>
                          <Select
                            value={pageSize.toString()}
                            onValueChange={handlePageSizeChange}
                          >
                            <SelectTrigger className="w-20 h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="10">10</SelectItem>
                              <SelectItem value="25">25</SelectItem>
                              <SelectItem value="50">50</SelectItem>
                              <SelectItem value="100">100</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex items-center gap-4">
                          <div>
                            Showing{" "}
                            {Math.min(
                              (currentPage - 1) * pageSize + 1,
                              filteredTrades.length
                            )}{" "}
                            to{" "}
                            {Math.min(
                              currentPage * pageSize,
                              filteredTrades.length
                            )}{" "}
                            of {filteredTrades.length} trades
                          </div>

                          {totalPages > 1 && (
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  setCurrentPage((prev) =>
                                    Math.max(1, prev - 1)
                                  )
                                }
                                disabled={currentPage === 1}
                                className="h-8 w-8 p-0"
                                aria-label="Previous page"
                              >
                                <ChevronLeft className="h-4 w-4" />
                              </Button>

                              <div className="flex items-center gap-1">
                                {Array.from(
                                  { length: Math.min(5, totalPages) },
                                  (_, i) => {
                                    let pageNum;
                                    if (totalPages <= 5) pageNum = i + 1;
                                    else if (currentPage <= 3) pageNum = i + 1;
                                    else if (currentPage >= totalPages - 2)
                                      pageNum = totalPages - 4 + i;
                                    else pageNum = currentPage - 2 + i;

                                    return (
                                      <Button
                                        key={pageNum}
                                        variant={
                                          currentPage === pageNum
                                            ? "default"
                                            : "outline"
                                        }
                                        size="sm"
                                        onClick={() => setCurrentPage(pageNum)}
                                        className="h-8 w-8 p-0"
                                        aria-label={`Page ${pageNum}`}
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
                                className="h-8 w-8 p-0"
                                aria-label="Next page"
                              >
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </main>

        <TradeModal
          trade={selectedTrade}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedTrade(null);
          }}
          mode={modalMode}
          onTradeUpdate={handleTradeUpdate}
          onTradeCancel={handleTradeCancel}
        />
      </SidebarInset>
    </SidebarProvider>
  );
}
