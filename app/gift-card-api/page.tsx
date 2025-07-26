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
  TestTube,
  AlertCircle,
  CheckCircle,
  Settings,
  Power,
  Trash2,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { SearchFilters } from "@/components/ui/search-filters";
import { MobileTable } from "@/components/ui/mobile-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddAPIModal } from "@/components/modals/add-api-modal";
import { ConfigureAPIModal } from "@/components/modals/configure-api-modal";
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
import type { APISource } from "@/lib/types";
import { ExportDropdown } from "@/components/ui/export-dropdown";

// Enhanced mock API source data
const mockAPISources: APISource[] = [
  {
    id: "1",
    name: "CardCash API",
    sourceUrl: "https://api.cardcash.com/v1",
    type: "gift_card",
    supportedAssets: ["Amazon", "Steam", "iTunes", "Google Play"],
    status: "active",
    uptime: 99.2,
    lastSync: "2025-01-08T14:45:30Z",
    errorCount: 2,
    priority: 1,
    apiKey: "cc_live_***",
    rateLimit: "1000/hour",
    responseTime: 245,
  },
  {
    id: "2",
    name: "GiftCard Granny",
    sourceUrl: "https://api.giftcardgranny.com/v2",
    type: "gift_card",
    supportedAssets: ["Amazon", "Walmart", "Target"],
    status: "active",
    uptime: 98.7,
    lastSync: "2025-01-08T14:44:15Z",
    errorCount: 0,
    priority: 2,
    apiKey: "gcg_live_***",
    rateLimit: "500/hour",
    responseTime: 180,
  },
  {
    id: "3",
    name: "Raise API",
    sourceUrl: "https://api.raise.com/v1",
    type: "gift_card",
    supportedAssets: ["Steam", "iTunes", "Best Buy"],
    status: "down",
    uptime: 88.3,
    lastSync: "2025-01-08T12:30:45Z",
    errorCount: 15,
    priority: 3,
    apiKey: "raise_live_***",
    rateLimit: "2000/hour",
    responseTime: 0,
  },
  {
    id: "4",
    name: "Gift Card Mall",
    sourceUrl: "https://api.giftcardmall.com/v1",
    type: "gift_card",
    supportedAssets: ["Amazon", "Netflix", "Spotify"],
    status: "active",
    uptime: 97.8,
    lastSync: "2025-01-08T14:40:22Z",
    errorCount: 1,
    priority: 4,
    apiKey: "gcm_live_***",
    rateLimit: "750/hour",
    responseTime: 320,
  },
];

const filterOptions = [
  {
    key: "status",
    label: "All Status",
    options: [
      { value: "active", label: "Active" },
      { value: "down", label: "Down" },
    ],
  },
  {
    key: "type",
    label: "All Types",
    options: [{ value: "gift_card", label: "Gift Card" }],
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
      <Settings className="h-12 w-12 text-muted-foreground" />
    </div>
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">
        {searchQuery || hasFilters
          ? "No API sources found"
          : "No API sources configured"}
      </h3>
      <p className="text-muted-foreground max-w-md">
        {searchQuery || hasFilters
          ? "Try adjusting your search or filters to find what you're looking for."
          : "Get started by adding your first API source for gift card rates."}
      </p>
    </div>
    {(searchQuery || hasFilters) && (
      <Button variant="outline" onClick={onClearFilters}>
        Clear filters
      </Button>
    )}
  </div>
);

export default function GiftCardAPIPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>(
    {}
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isConfigureModalOpen, setIsConfigureModalOpen] = useState(false);
  const [selectedAPI, setSelectedAPI] = useState<APISource | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [apiSources, setApiSources] = useState<APISource[]>(mockAPISources);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    api: APISource | null;
  }>({
    isOpen: false,
    api: null,
  });
  const [testingAPI, setTestingAPI] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<{ from: string; to: string }>({
    from: "",
    to: "",
  });

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Simulate initial loading
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const filteredSources = useMemo(() => {
    return apiSources.filter((source) => {
      // Search filter
      if (debouncedSearchQuery) {
        const query = debouncedSearchQuery.toLowerCase();
        if (
          !source.name.toLowerCase().includes(query) &&
          !source.sourceUrl.toLowerCase().includes(query) &&
          !source.supportedAssets.some((asset) =>
            asset.toLowerCase().includes(query)
          )
        ) {
          return false;
        }
      }

      // Status filter
      if (activeFilters.status && source.status !== activeFilters.status) {
        return false;
      }

      // Type filter
      if (activeFilters.type && source.type !== activeFilters.type) {
        return false;
      }

      // Date range filter (you can filter on lastSync)
      if (dateRange.from) {
        const fromDate = new Date(dateRange.from);
        const sourceDate = new Date(source.lastSync);
        if (sourceDate < fromDate) return false;
      }
      if (dateRange.to) {
        const toDate = new Date(dateRange.to);
        const sourceDate = new Date(source.lastSync);
        if (sourceDate > toDate) return false;
      }

      return true;
    });
  }, [debouncedSearchQuery, activeFilters, apiSources, dateRange]);

  // Pagination logic
  const totalPages = Math.ceil(filteredSources.length / pageSize);
  const paginatedSources = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredSources.slice(startIndex, startIndex + pageSize);
  }, [filteredSources, currentPage, pageSize]);

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

  const handleDateRangeChange = (range: { from: string; to: string }) => {
    setDateRange(range);
    setCurrentPage(1);
  };

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      // Update last sync times
      setApiSources((prev) =>
        prev.map((api) => ({
          ...api,
          lastSync: new Date().toISOString(),
        }))
      );
      toast.success("Data Refreshed", {
        description: "API sources have been synchronized successfully.",
      });
    } catch (error) {
      toast.error("Refresh Failed", {
        description: "Unable to refresh API sources. Please try again.",
      });
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  const handleAddAPI = useCallback((newAPI: Omit<APISource, "id">) => {
    const apiWithId = {
      ...newAPI,
      id: Date.now().toString(),
      lastSync: new Date().toISOString(),
      errorCount: 0,
      uptime: 100,
    };
    setApiSources((prev) => [...prev, apiWithId]);
    toast.success("API Source Added", {
      description: `${newAPI.name} has been added successfully.`,
    });
  }, []);

  const handleConfigureAPI = useCallback((api: APISource) => {
    setSelectedAPI(api);
    setIsConfigureModalOpen(true);
  }, []);

  const handleUpdateAPI = useCallback((updatedAPI: APISource) => {
    setApiSources((prev) =>
      prev.map((api) => (api.id === updatedAPI.id ? updatedAPI : api))
    );
    toast.success("API Source Updated", {
      description: `${updatedAPI.name} has been updated successfully.`,
    });
  }, []);

  const handleTestAPI = useCallback(async (api: APISource) => {
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
        setApiSources((prev) =>
          prev.map((source) =>
            source.id === api.id
              ? {
                  ...source,
                  responseTime: Math.floor(Math.random() * 500) + 100,
                }
              : source
          )
        );
      } else {
        toast.error("API Test Failed", {
          description: `${api.name} is not responding or returned an error.`,
        });
        // Increment error count
        setApiSources((prev) =>
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

  const handleToggleStatus = useCallback(async (api: APISource) => {
    const newStatus = api.status === "active" ? "down" : "active";
    try {
      setApiSources((prev) =>
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
    }
  }, []);

  const handleDeleteAPI = useCallback(async (api: APISource) => {
    try {
      setApiSources((prev) => prev.filter((source) => source.id !== api.id));
      toast.success("API Source Deleted", {
        description: `${api.name} has been removed successfully.`,
      });
    } catch (error) {
      toast.error("Delete Failed", {
        description: "Unable to delete API source.",
      });
    } finally {
      setDeleteDialog({ isOpen: false, api: null });
    }
  }, []);

  const columns = [
    {
      key: "name",
      label: "API NAME",
      className: "font-medium",
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Settings className="h-4 w-4 text-primary" />
          </div>
          <span className="font-medium">{value}</span>
        </div>
      ),
    },
    {
      key: "sourceUrl",
      label: "SOURCE URL",
      render: (value: string) => (
        <code className="text-xs bg-muted/50 px-2 py-1 rounded text-muted-foreground break-all">
          {value}
        </code>
      ),
    },
    {
      key: "supportedAssets",
      label: "SUPPORTED ASSETS",
      render: (assets: string[]) => (
        <div className="flex flex-wrap gap-1">
          {assets.slice(0, 3).map((asset, index) => (
            <Badge
              key={index}
              variant="outline"
              className={cn(
                "text-xs",
                asset.includes("Amazon")
                  ? "border-orange-500/30 text-orange-600 bg-orange-50"
                  : asset.includes("Steam")
                  ? "border-purple-500/30 text-purple-600 bg-purple-50"
                  : asset.includes("iTunes")
                  ? "border-blue-500/30 text-blue-600 bg-blue-50"
                  : "border-muted-foreground/30 text-muted-foreground"
              )}
            >
              {asset}
            </Badge>
          ))}
          {assets.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{assets.length - 3}
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: "status",
      label: "STATUS",
      render: (value: string, row: APISource) => (
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={cn(
              "text-xs",
              value === "active"
                ? "border-green-500/30 text-green-600 bg-green-50"
                : "border-red-500/30 text-red-600 bg-red-50"
            )}
          >
            {value === "active" ? (
              <CheckCircle className="h-3 w-3 mr-1" />
            ) : (
              <AlertCircle className="h-3 w-3 mr-1" />
            )}
            {value === "active" ? "Active" : "Down"}
          </Badge>
          {row.errorCount > 0 && (
            <Badge
              variant="outline"
              className="text-xs border-orange-500/30 text-orange-600 bg-orange-50"
            >
              {row.errorCount} errors
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
          <span className="font-mono text-sm">{value}%</span>
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
      key: "priority",
      label: "PRIORITY",
      render: (value: number) => (
        <Badge variant="outline" className="font-mono text-xs">
          #{value}
        </Badge>
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
      label: "Configure",
      onClick: handleConfigureAPI,
      icon: Settings,
    },
    {
      label: "Test API",
      onClick: handleTestAPI,
      icon: TestTube,
    },
    {
      label: "Toggle Status",
      onClick: handleToggleStatus,
      icon: Power,
    },
    {
      label: "Delete",
      onClick: (api: APISource) => setDeleteDialog({ isOpen: true, api }),
      variant: "destructive" as const,
      icon: Trash2,
    },
  ];

  // Mobile card render
  const mobileCardRender = (api: APISource) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Settings className="h-4 w-4 text-primary" />
          </div>
          <span className="font-medium">{api.name}</span>
        </div>
        <Badge
          variant="outline"
          className={cn(
            "text-xs",
            api.status === "active"
              ? "border-green-500/30 text-green-600 bg-green-50"
              : "border-red-500/30 text-red-600 bg-red-50"
          )}
        >
          {api.status === "active" ? (
            <CheckCircle className="h-3 w-3 mr-1" />
          ) : (
            <AlertCircle className="h-3 w-3 mr-1" />
          )}
          {api.status === "active" ? "Active" : "Down"}
        </Badge>
      </div>

      <div className="text-sm">
        <code className="text-xs bg-muted/50 px-2 py-1 rounded text-muted-foreground break-all">
          {api.sourceUrl}
        </code>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-muted-foreground">Uptime:</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="font-mono font-medium">{api.uptime}%</span>
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
          <span className="text-muted-foreground">Priority:</span>
          <div className="mt-1">
            <Badge variant="outline" className="font-mono text-xs">
              #{api.priority}
            </Badge>
          </div>
        </div>
      </div>

      <div>
        <span className="text-muted-foreground text-sm">Supported Assets:</span>
        <div className="flex flex-wrap gap-1 mt-1">
          {api.supportedAssets.slice(0, 3).map((asset, index) => (
            <Badge
              key={index}
              variant="outline"
              className={cn(
                "text-xs",
                asset.includes("Amazon")
                  ? "border-orange-500/30 text-orange-600 bg-orange-50"
                  : asset.includes("Steam")
                  ? "border-purple-500/30 text-purple-600 bg-purple-50"
                  : asset.includes("iTunes")
                  ? "border-blue-500/30 text-blue-600 bg-blue-50"
                  : "border-muted-foreground/30 text-muted-foreground"
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

      {api.errorCount > 0 && (
        <div>
          <Badge
            variant="outline"
            className="text-xs border-orange-500/30 text-orange-600 bg-orange-50"
          >
            {api.errorCount} errors
          </Badge>
        </div>
      )}

      {testingAPI === api.id && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Testing API connection...
        </div>
      )}
    </div>
  );

  // Statistics
  const totalAPIs = apiSources.length;
  const activeAPIs = apiSources.filter((s) => s.status === "active").length;
  const avgUptime =
    apiSources.length > 0
      ? apiSources.reduce((acc, s) => acc + s.uptime, 0) / apiSources.length
      : 0;
  const totalErrors = apiSources.reduce((acc, s) => acc + s.errorCount, 0);

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
                      Gift Card API Management
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>

              {/* Page Header */}
              <div className="flex flex-col space-y-2 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
                <div className="space-y-1">
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold font-poppins tracking-tight">
                    Gift Card API Management
                  </h1>
                  <p className="text-sm md:text-base text-muted-foreground">
                    Manage gift card rate sources and API integrations
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <Button
                    variant="outline"
                    className="bg-green-600 hover:bg-green-700 text-white cursor-pointer"
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
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-blue-400 hover:bg-blue-500 text-white cursor-pointer"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add API Source
                  </Button>

                  {/* Replaced Export Button */}
                  <ExportDropdown
                    data={filteredSources}
                    filename={`api_sources_${format(new Date(), "yyyy-MM-dd")}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer p-4 hover:border-none hover:text-white "
                  />
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
                    <Settings className="h-4 w-4 text-blue-500" />
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
                    Avg. Uptime
                  </CardTitle>
                  <div className="h-8 w-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-orange-500" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-1">
                  <div className="text-xl sm:text-2xl font-bold font-poppins">
                    {avgUptime.toFixed(1)}%
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    <span>Last 30 days</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-enhanced hover:shadow-lg transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                    Total Errors
                  </CardTitle>
                  <div className="h-8 w-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-1">
                  <div className="text-xl sm:text-2xl font-bold font-poppins">
                    {totalErrors}
                  </div>
                  <div className="flex items-center text-xs text-red-600">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    <span>Needs attention</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <SearchFilters
                searchPlaceholder="Search by name, URL, or supported assets..."
                filterOptions={filterOptions}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
                activeFilters={activeFilters}
                showDateFilter={true}
                dateRange={dateRange}
                onDateRangeChange={handleDateRangeChange}
                className="flex-1"
              />
            </div>

            {/* API Sources Table */}
            <Card className="card-enhanced shadow-sm">
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="p-6">
                    <TableSkeleton />
                  </div>
                ) : filteredSources.length === 0 ? (
                  <EmptyState
                    searchQuery={debouncedSearchQuery}
                    hasFilters={Object.values(activeFilters).some(Boolean)}
                    onClearFilters={handleClearFilters}
                  />
                ) : (
                  <>
                    <div className="rounded-lg border border-border/50 overflow-hidden">
                      <MobileTable
                        data={paginatedSources}
                        columns={columns}
                        actions={actions}
                        mobileCardRender={mobileCardRender}
                        emptyMessage="No API sources found"
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
                              filteredSources.length
                            )}{" "}
                            to{" "}
                            {Math.min(
                              currentPage * pageSize,
                              filteredSources.length
                            )}{" "}
                            of {filteredSources.length} APIs
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
      <AddAPIModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddAPI}
      />

      <ConfigureAPIModal
        api={selectedAPI}
        isOpen={isConfigureModalOpen}
        onClose={() => {
          setIsConfigureModalOpen(false);
          setSelectedAPI(null);
        }}
        onUpdate={handleUpdateAPI}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteDialog.isOpen}
        onOpenChange={(open) => setDeleteDialog({ isOpen: open, api: null })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete API Source</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteDialog.api?.name}"? This
              action cannot be undone and will remove all associated
              configurations.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deleteDialog.api && handleDeleteAPI(deleteDialog.api)
              }
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarProvider>
  );
}
