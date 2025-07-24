"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Plus,
  Download,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Edit,
  TestTube,
  Power,
  Loader2,
} from "lucide-react";
import { SearchFilters } from "@/components/ui/search-filters";
import { MobileTable } from "@/components/ui/mobile-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddCryptoAPIModal } from "@/components/modals/add-crypto-api-modal";
import { EditCryptoAPIModal } from "@/components/modals/edit-crypto-api-modal";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { toast } from "sonner";
import { formatDistanceToNow, format } from "date-fns";
import { cn } from "@/lib/utils";
import type { APIConfig } from "@/lib/types";

// Enhanced mock crypto API data
const mockCryptoAPIs: APIConfig[] = [
  {
    id: "1",
    name: "CoinGecko",
    type: "crypto",
    status: "active",
    priority: 1,
    autoMargin: 2.0,
    supportedAssets: ["Bitcoin", "Ethereum", "USDT", "BNB"],
    lastSync: "2025-01-08T14:30:00Z",
    errorCount: 0,
    uptime: 99.9,
    apiKey: "cg_live_***",
    rateLimit: "50/minute",
    responseTime: 120,
  },
  {
    id: "2",
    name: "Binance API",
    type: "crypto",
    status: "active",
    priority: 2,
    autoMargin: 1.5,
    supportedAssets: ["Bitcoin", "Ethereum", "BNB", "Cardano"],
    lastSync: "2025-01-08T14:28:00Z",
    errorCount: 2,
    uptime: 98.5,
    apiKey: "binance_***",
    rateLimit: "1200/minute",
    responseTime: 85,
  },
  {
    id: "3",
    name: "CoinMarketCap",
    type: "crypto",
    status: "error",
    priority: 3,
    autoMargin: 2.5,
    supportedAssets: ["Bitcoin", "Ethereum", "XRP"],
    lastSync: "2025-01-08T13:45:00Z",
    errorCount: 15,
    uptime: 85.2,
    apiKey: "cmc_live_***",
    rateLimit: "333/day",
    responseTime: 0,
  },
  {
    id: "4",
    name: "Kraken API",
    type: "crypto",
    status: "active",
    priority: 4,
    autoMargin: 1.8,
    supportedAssets: ["Bitcoin", "Ethereum", "Litecoin", "XRP"],
    lastSync: "2025-01-08T14:25:00Z",
    errorCount: 1,
    uptime: 97.8,
    apiKey: "kraken_***",
    rateLimit: "60/minute",
    responseTime: 150,
  },
];

const filterOptions = [
  {
    key: "status",
    label: "All Status",
    options: [
      { value: "active", label: "Active" },
      { value: "inactive", label: "Inactive" },
      { value: "error", label: "Error" },
    ],
  },
  {
    key: "priority",
    label: "All Priority",
    options: [
      { value: "1", label: "Priority 1" },
      { value: "2", label: "Priority 2" },
      { value: "3", label: "Priority 3" },
      { value: "4", label: "Priority 4" },
      { value: "5", label: "Priority 5" },
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
      <TrendingUp className="h-12 w-12 text-muted-foreground" />
    </div>
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">
        {searchQuery || hasFilters
          ? "No crypto APIs found"
          : "No crypto APIs configured"}
      </h3>
      <p className="text-muted-foreground max-w-md">
        {searchQuery || hasFilters
          ? "Try adjusting your search or filters to find what you're looking for."
          : "Get started by adding your first crypto API source for price data."}
      </p>
    </div>
    {(searchQuery || hasFilters) && (
      <Button variant="outline" onClick={onClearFilters}>
        Clear filters
      </Button>
    )}
  </div>
);

export default function CryptoAPIPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>(
    {}
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAPI, setSelectedAPI] = useState<APIConfig | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [cryptoAPIs, setCryptoAPIs] = useState<APIConfig[]>(mockCryptoAPIs);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [disableDialog, setDisableDialog] = useState<{
    isOpen: boolean;
    api: APIConfig | null;
  }>({
    isOpen: false,
    api: null,
  });
  const [testingAPI, setTestingAPI] = useState<string | null>(null);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Simulate initial loading
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const filteredAPIs = useMemo(() => {
    return cryptoAPIs.filter((api) => {
      // Search filter
      if (debouncedSearchQuery) {
        const query = debouncedSearchQuery.toLowerCase();
        if (
          !api.name.toLowerCase().includes(query) &&
          !api.supportedAssets.some((asset) =>
            asset.toLowerCase().includes(query)
          )
        ) {
          return false;
        }
      }

      // Other filters
      for (const [key, value] of Object.entries(activeFilters)) {
        if (value && api[key as keyof APIConfig]?.toString() !== value) {
          return false;
        }
      }

      return true;
    });
  }, [debouncedSearchQuery, activeFilters, cryptoAPIs]);

  // Pagination logic
  const totalPages = Math.ceil(filteredAPIs.length / pageSize);
  const paginatedAPIs = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredAPIs.slice(startIndex, startIndex + pageSize);
  }, [filteredAPIs, currentPage, pageSize]);

  // Reset to first page when filters change
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

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      // Update last sync times
      setCryptoAPIs((prev) =>
        prev.map((api) => ({
          ...api,
          lastSync: new Date().toISOString(),
        }))
      );
      toast.success("Data Refreshed", {
        description: "Crypto API sources have been synchronized successfully.",
      });
    } catch (error) {
      toast.error("Refresh Failed", {
        description: "Unable to refresh crypto API sources. Please try again.",
      });
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  const handleExport = useCallback(async () => {
    setIsExporting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const headers = [
        "Name",
        "Type",
        "Status",
        "Priority",
        "Auto Margin (%)",
        "Uptime (%)",
        "Error Count",
        "Last Sync",
        "Supported Assets",
      ];

      const csvContent = [
        headers.join(","),
        ...filteredAPIs.map((api) =>
          [
            api.name,
            api.type,
            api.status,
            api.priority,
            api.autoMargin,
            api.uptime,
            api.errorCount,
            format(new Date(api.lastSync), "yyyy-MM-dd HH:mm:ss"),
            `"${api.supportedAssets.join(", ")}"`,
          ].join(",")
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `crypto_apis_${format(new Date(), "yyyy-MM-dd")}.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Export Successful", {
        description: `Exported ${filteredAPIs.length} crypto API sources to CSV file.`,
      });
    } catch (error) {
      toast.error("Export Failed", {
        description: "There was an error exporting the crypto API data.",
      });
    } finally {
      setIsExporting(false);
    }
  }, [filteredAPIs]);

  const handleAddAPI = useCallback((newAPI: Omit<APIConfig, "id">) => {
    const apiWithId = {
      ...newAPI,
      id: Date.now().toString(),
      lastSync: new Date().toISOString(),
      errorCount: 0,
      uptime: 100,
      responseTime: 0,
    };
    setCryptoAPIs((prev) => [...prev, apiWithId]);
    toast.success("Crypto API Added", {
      description: `${newAPI.name} has been added successfully.`,
    });
  }, []);

  const handleEditAPI = useCallback((api: APIConfig) => {
    setSelectedAPI(api);
    setIsEditModalOpen(true);
  }, []);

  const handleUpdateAPI = useCallback((updatedAPI: APIConfig) => {
    setCryptoAPIs((prev) =>
      prev.map((api) => (api.id === updatedAPI.id ? updatedAPI : api))
    );
    toast.success("Crypto API Updated", {
      description: `${updatedAPI.name} has been updated successfully.`,
    });
  }, []);

  const handleTestAPI = useCallback(async (api: APIConfig) => {
    setTestingAPI(api.id);
    try {
      // Simulate API test
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const success = Math.random() > 0.3; // 70% success rate

      if (success) {
        toast.success("API Test Successful", {
          description: `${api.name} is responding correctly.`,
        });
        // Update response time
        setCryptoAPIs((prev) =>
          prev.map((source) =>
            source.id === api.id
              ? {
                  ...source,
                  responseTime: Math.floor(Math.random() * 300) + 50,
                }
              : source
          )
        );
      } else {
        toast.error("API Test Failed", {
          description: `${api.name} is not responding or returned an error.`,
        });
        // Increment error count
        setCryptoAPIs((prev) =>
          prev.map((source) =>
            source.id === api.id
              ? { ...source, errorCount: source.errorCount + 1 }
              : source
          )
        );
      }
    } catch (error) {
      toast.error("Test Failed", {
        description: "Unable to test API connection.",
      });
    } finally {
      setTestingAPI(null);
    }
  }, []);

  const handleDisableAPI = useCallback(async (api: APIConfig) => {
    const newStatus = api.status === "active" ? "inactive" : "active";
    try {
      setCryptoAPIs((prev) =>
        prev.map((source) =>
          source.id === api.id ? { ...source, status: newStatus } : source
        )
      );
      toast.success("Status Updated", {
        description: `${api.name} is now ${newStatus}.`,
      });
    } catch (error) {
      toast.error("Update Failed", {
        description: "Unable to update API status.",
      });
    } finally {
      setDisableDialog({ isOpen: false, api: null });
    }
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "border-green-500/30 text-green-600 bg-green-50";
      case "inactive":
        return "border-gray-500/30 text-gray-600 bg-gray-50";
      case "error":
        return "border-red-500/30 text-red-600 bg-red-50";
      default:
        return "border-gray-500/30 text-gray-600 bg-gray-50";
    }
  };

  const getUptimeColor = (uptime: number) => {
    if (uptime >= 99) return "text-green-600";
    if (uptime >= 95) return "text-yellow-600";
    return "text-red-600";
  };

  const columns = [
    {
      key: "name",
      label: "API NAME",
      className: "font-medium",
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <TrendingUp className="h-4 w-4 text-primary" />
          </div>
          <span className="font-medium">{value}</span>
        </div>
      ),
    },
    {
      key: "status",
      label: "STATUS",
      render: (value: string) => (
        <Badge
          variant="outline"
          className={cn("text-xs", getStatusColor(value))}
        >
          {value === "active" && <CheckCircle className="h-3 w-3 mr-1" />}
          {value === "error" && <AlertTriangle className="h-3 w-3 mr-1" />}
          {value === "inactive" && <Clock className="h-3 w-3 mr-1" />}
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </Badge>
      ),
    },
    {
      key: "priority",
      label: "PRIORITY",
      render: (value: number) => (
        <Badge variant="outline" className="font-mono text-xs">
          #{value}
        </Badge>
      ),
    },
    {
      key: "autoMargin",
      label: "AUTO MARGIN",
      render: (value: number) => (
        <span className="font-mono text-sm">+{value}%</span>
      ),
    },
    {
      key: "supportedAssets",
      label: "SUPPORTED ASSETS",
      render: (value: string[]) => (
        <div className="flex flex-wrap gap-1">
          {value.slice(0, 2).map((asset) => (
            <Badge
              key={asset}
              variant="outline"
              className={cn(
                "text-xs",
                asset.includes("Bitcoin")
                  ? "border-orange-500/30 text-orange-600 bg-orange-50"
                  : asset.includes("Ethereum")
                  ? "border-blue-500/30 text-blue-600 bg-blue-50"
                  : "border-purple-500/30 text-purple-600 bg-purple-50"
              )}
            >
              {asset}
            </Badge>
          ))}
          {value.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{value.length - 2}
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: "uptime",
      label: "UPTIME",
      render: (value: number) => (
        <div className="flex items-center gap-2">
          <span
            className={`font-mono font-medium text-sm ${getUptimeColor(value)}`}
          >
            {value}%
          </span>
          <div
            className={cn(
              "h-2 w-2 rounded-full",
              value >= 99
                ? "bg-green-500"
                : value >= 95
                ? "bg-yellow-500"
                : "bg-red-500"
            )}
          />
        </div>
      ),
    },
    {
      key: "errorCount",
      label: "ERRORS",
      render: (value: number) => (
        <span
          className={`font-mono text-sm ${
            value > 0 ? "text-red-600" : "text-green-600"
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: "lastSync",
      label: "LAST SYNC",
      render: (value: string) => (
        <div className="text-sm">
          <div className="text-muted-foreground">
            {formatDistanceToNow(new Date(value), { addSuffix: true })}
          </div>
          <div className="text-xs text-muted-foreground">
            {format(new Date(value), "MMM d, HH:mm")}
          </div>
        </div>
      ),
    },
  ];

  const actions = [
    {
      label: "Edit",
      onClick: handleEditAPI,
      icon: Edit,
    },
    {
      label: "Test",
      onClick: handleTestAPI,
      icon: TestTube,
    },
    {
      label: "Disable",
      onClick: (api: APIConfig) => setDisableDialog({ isOpen: true, api }),
      variant: "destructive" as const,
      icon: Power,
    },
  ];

  // Mobile card render
  const mobileCardRender = (api: APIConfig) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <TrendingUp className="h-4 w-4 text-primary" />
          </div>
          <span className="font-medium">{api.name}</span>
        </div>
        <Badge
          variant="outline"
          className={cn("text-xs", getStatusColor(api.status))}
        >
          {api.status === "active" && <CheckCircle className="h-3 w-3 mr-1" />}
          {api.status === "error" && <AlertTriangle className="h-3 w-3 mr-1" />}
          {api.status === "inactive" && <Clock className="h-3 w-3 mr-1" />}
          {api.status.charAt(0).toUpperCase() + api.status.slice(1)}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-muted-foreground">Priority:</span>
          <div className="mt-1">
            <Badge variant="outline" className="font-mono text-xs">
              #{api.priority}
            </Badge>
          </div>
        </div>
        <div>
          <span className="text-muted-foreground">Auto Margin:</span>
          <div className="font-mono font-medium mt-1">+{api.autoMargin}%</div>
        </div>
        <div>
          <span className="text-muted-foreground">Uptime:</span>
          <div className="flex items-center gap-2 mt-1">
            <span
              className={`font-mono font-medium ${getUptimeColor(api.uptime)}`}
            >
              {api.uptime}%
            </span>
            <div
              className={cn(
                "h-2 w-2 rounded-full",
                api.uptime >= 99
                  ? "bg-green-500"
                  : api.uptime >= 95
                  ? "bg-yellow-500"
                  : "bg-red-500"
              )}
            />
          </div>
        </div>
        <div>
          <span className="text-muted-foreground">Errors:</span>
          <div
            className={`font-mono font-medium mt-1 ${
              api.errorCount > 0 ? "text-red-600" : "text-green-600"
            }`}
          >
            {api.errorCount}
          </div>
        </div>
      </div>

      <div>
        <span className="text-muted-foreground text-sm">Supported Assets:</span>
        <div className="flex flex-wrap gap-1 mt-1">
          {api.supportedAssets.slice(0, 3).map((asset) => (
            <Badge
              key={asset}
              variant="outline"
              className={cn(
                "text-xs",
                asset.includes("Bitcoin")
                  ? "border-orange-500/30 text-orange-600 bg-orange-50"
                  : asset.includes("Ethereum")
                  ? "border-blue-500/30 text-blue-600 bg-blue-50"
                  : "border-purple-500/30 text-purple-600 bg-purple-50"
              )}
            >
              {asset}
            </Badge>
          ))}
          {api.supportedAssets.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{api.supportedAssets.length - 3}
            </Badge>
          )}
        </div>
      </div>

      <div className="text-sm">
        <span className="text-muted-foreground">Last Sync:</span>
        <div className="mt-1">
          <div className="text-muted-foreground">
            {formatDistanceToNow(new Date(api.lastSync), { addSuffix: true })}
          </div>
        </div>
      </div>

      {testingAPI === api.id && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Testing API connection...
        </div>
      )}
    </div>
  );

  // Statistics
  const totalAPIs = cryptoAPIs.length;
  const activeAPIs = cryptoAPIs.filter((api) => api.status === "active").length;
  const errorAPIs = cryptoAPIs.filter((api) => api.status === "error").length;
  const avgUptime =
    cryptoAPIs.length > 0
      ? cryptoAPIs.reduce((acc, api) => acc + api.uptime, 0) / cryptoAPIs.length
      : 0;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 bg-background">
          <div className="container-padding py-4 md:py-6 lg:py-8 space-y-6">
            {/* Breadcrumb Navigation */}
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
                      Crypto API Management
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>

              {/* Page Header */}
              <div className="flex flex-col space-y-2 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
                <div className="space-y-1">
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold font-poppins tracking-tight">
                    Crypto API Management
                  </h1>
                  <p className="text-sm md:text-base text-muted-foreground">
                    Manage cryptocurrency price data sources and configurations
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <Button
                    variant="outline"
                    className="bg-background hover:bg-muted"
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
                  <Button
                    variant="outline"
                    className="bg-background hover:bg-muted"
                    onClick={handleExport}
                    disabled={isExporting}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {isExporting ? "Exporting..." : "Export"}
                  </Button>
                  <Button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-blue-500 hover:bg-blue-600 cursor-pointer text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add API
                  </Button>
                </div>
              </div>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
              <Card className="card-enhanced hover:shadow-lg transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                    Total APIs
                  </CardTitle>
                  <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-blue-500" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-1">
                  <div className="text-xl sm:text-2xl font-bold font-poppins">
                    {totalAPIs}
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    <span>All sources</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-enhanced hover:shadow-lg transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                    Active APIs
                  </CardTitle>
                  <div className="h-8 w-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-1">
                  <div className="text-xl sm:text-2xl font-bold font-poppins">
                    {activeAPIs}
                  </div>
                  <div className="flex items-center text-xs text-green-600">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    <span>Online now</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-enhanced hover:shadow-lg transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                    Error APIs
                  </CardTitle>
                  <div className="h-8 w-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-1">
                  <div className="text-xl sm:text-2xl font-bold font-poppins">
                    {errorAPIs}
                  </div>
                  <div className="flex items-center text-xs text-red-600">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    <span>Need attention</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-enhanced hover:shadow-lg transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                    Avg Uptime
                  </CardTitle>
                  <div className="h-8 w-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                    <Clock className="h-4 w-4 text-orange-500" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-1">
                  <div className="text-xl sm:text-2xl font-bold font-poppins">
                    {avgUptime.toFixed(1)}%
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>Last 30 days</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <SearchFilters
                searchPlaceholder="Search by name or supported assets..."
                filterOptions={filterOptions}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
                activeFilters={activeFilters}
                className="flex-1"
              />
            </div>

            {/* Crypto APIs Table */}
            <Card className="card-enhanced shadow-sm">
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="p-6">
                    <TableSkeleton />
                  </div>
                ) : filteredAPIs.length === 0 ? (
                  <EmptyState
                    searchQuery={debouncedSearchQuery}
                    hasFilters={Object.values(activeFilters).some(Boolean)}
                    onClearFilters={handleClearFilters}
                  />
                ) : (
                  <>
                    <div className="rounded-lg border border-border/50 overflow-hidden">
                      <MobileTable
                        data={paginatedAPIs}
                        columns={columns}
                        actions={actions}
                        mobileCardRender={mobileCardRender}
                        emptyMessage="No crypto APIs found"
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
                              filteredAPIs.length
                            )}{" "}
                            to{" "}
                            {Math.min(
                              currentPage * pageSize,
                              filteredAPIs.length
                            )}{" "}
                            of {filteredAPIs.length} APIs
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
      </SidebarInset>

      {/* Modals */}
      <AddCryptoAPIModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddAPI}
      />

      <EditCryptoAPIModal
        api={selectedAPI}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedAPI(null);
        }}
        onUpdate={handleUpdateAPI}
      />

      {/* Disable Confirmation Dialog */}
      <AlertDialog
        open={disableDialog.isOpen}
        onOpenChange={(open) => setDisableDialog({ isOpen: open, api: null })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {disableDialog.api?.status === "active" ? "Disable" : "Enable"}{" "}
              API Source
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to{" "}
              {disableDialog.api?.status === "active" ? "disable" : "enable"} "
              {disableDialog.api?.name}"? This will{" "}
              {disableDialog.api?.status === "active" ? "stop" : "resume"} price
              data fetching from this source.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                disableDialog.api && handleDisableAPI(disableDialog.api)
              }
              className={
                disableDialog.api?.status === "active"
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : ""
              }
            >
              {disableDialog.api?.status === "active" ? "Disable" : "Enable"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarProvider>
  );
}
