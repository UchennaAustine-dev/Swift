"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  FolderSyncIcon as Sync,
  Search,
  Filter,
  TrendingUp,
  MoreHorizontal,
  Edit,
  Trash2,
  RefreshCw,
  Activity,
  Target,
  Settings,
  Zap,
  ChevronLeft,
  ChevronRight,
  Download,
  Loader2,
  Plus,
} from "lucide-react";
import { EditRateModal } from "@/components/modals/edit-rate-modal";
import { AddRateModal } from "@/components/modals/add-rate-modal";
import { toast } from "sonner";
import { formatDistanceToNow, format } from "date-fns";
import { cn } from "@/lib/utils";

// Mock data for statistics
const statsData = {
  totalRates: 24,
  autoRates: 18,
  manualOverride: 6,
  avgAccuracy: 98.6,
};

// Mock data for rate history chart
const rateHistoryData = [
  { time: "00:00", btc: 98450000, eth: 5850000 },
  { time: "04:00", btc: 98200000, eth: 5820000 },
  { time: "08:00", btc: 98600000, eth: 5880000 },
  { time: "12:00", btc: 98800000, eth: 5900000 },
  { time: "16:00", btc: 99100000, eth: 5950000 },
];

// Enhanced mock data for exchange rates table
interface ExchangeRate {
  id: string;
  asset: string;
  platform: string;
  source: string;
  sourceType?: string;
  currentRate: string;
  autoMargin: string;
  change24h: string;
  accuracy: string;
  lastSynced: string;
  changePositive: boolean;
}

const exchangeRatesData: ExchangeRate[] = [
  {
    id: "1",
    asset: "BTC",
    platform: "Telegram",
    source: "API",
    currentRate: "₦98,450,000",
    autoMargin: "2.5%",
    change24h: "+2.3%",
    accuracy: "99.2%",
    lastSynced: "2025-01-08T14:45:30Z",
    changePositive: true,
  },
  {
    id: "2",
    asset: "BTC",
    platform: "WhatsApp",
    source: "Manual",
    sourceType: "Override",
    currentRate: "₦98,200,000",
    autoMargin: "N/A",
    change24h: "+2.1%",
    accuracy: "100%",
    lastSynced: "2025-01-08T12:30:15Z",
    changePositive: true,
  },
  {
    id: "3",
    asset: "ETH",
    platform: "Telegram",
    source: "API",
    currentRate: "₦5,850,000",
    autoMargin: "3.0%",
    change24h: "-1.2%",
    accuracy: "98.8%",
    lastSynced: "2025-01-08T14:44:22Z",
    changePositive: false,
  },
  {
    id: "4",
    asset: "Steam",
    platform: "WhatsApp",
    source: "API",
    currentRate: "₦1,425",
    autoMargin: "5.5%",
    change24h: "+0.5%",
    accuracy: "97.5%",
    lastSynced: "2025-01-08T14:43:15Z",
    changePositive: true,
  },
  {
    id: "5",
    asset: "ETH",
    platform: "WhatsApp",
    source: "API",
    currentRate: "₦5,820,000",
    autoMargin: "3.2%",
    change24h: "-1.5%",
    accuracy: "98.5%",
    lastSynced: "2025-01-08T14:42:10Z",
    changePositive: false,
  },
  {
    id: "6",
    asset: "USDT",
    platform: "Telegram",
    source: "API",
    currentRate: "₦1,650",
    autoMargin: "1.8%",
    change24h: "+0.1%",
    accuracy: "99.8%",
    lastSynced: "2025-01-08T14:45:00Z",
    changePositive: true,
  },
];

const filterOptions = [
  {
    key: "platform",
    label: "All Platforms",
    options: [
      { value: "Telegram", label: "Telegram" },
      { value: "WhatsApp", label: "WhatsApp" },
    ],
  },
  {
    key: "source",
    label: "All Sources",
    options: [
      { value: "API", label: "API" },
      { value: "Manual", label: "Manual" },
    ],
  },
  {
    key: "asset",
    label: "All Assets",
    options: [
      { value: "BTC", label: "Bitcoin" },
      { value: "ETH", label: "Ethereum" },
      { value: "USDT", label: "USDT" },
      { value: "Steam", label: "Steam" },
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

export default function RatesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>(
    {}
  );
  const [selectedRate, setSelectedRate] = useState<ExchangeRate | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [rates, setRates] = useState<ExchangeRate[]>(exchangeRatesData);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    rate: ExchangeRate | null;
  }>({
    isOpen: false,
    rate: null,
  });
  const [syncingRate, setSyncingRate] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Simulate initial loading
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const filteredRates = useMemo(() => {
    return rates.filter((rate) => {
      // Search filter
      if (debouncedSearchQuery) {
        const query = debouncedSearchQuery.toLowerCase();
        if (
          !rate.asset.toLowerCase().includes(query) &&
          !rate.platform.toLowerCase().includes(query) &&
          !rate.source.toLowerCase().includes(query)
        ) {
          return false;
        }
      }

      // Platform filter
      if (activeFilters.platform && rate.platform !== activeFilters.platform) {
        return false;
      }

      // Source filter
      if (activeFilters.source && rate.source !== activeFilters.source) {
        return false;
      }

      // Asset filter
      if (activeFilters.asset && rate.asset !== activeFilters.asset) {
        return false;
      }

      return true;
    });
  }, [debouncedSearchQuery, activeFilters, rates]);

  // Pagination logic
  const totalPages = Math.ceil(filteredRates.length / pageSize);
  const paginatedRates = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredRates.slice(startIndex, startIndex + pageSize);
  }, [filteredRates, currentPage, pageSize]);

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

  const handleSyncAll = useCallback(async () => {
    setIsSyncing(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      // Update last sync times
      setRates((prev) =>
        prev.map((rate) => ({
          ...rate,
          lastSynced: new Date().toISOString(),
        }))
      );
      toast.success("Sync Successful", {
        description: "All rates have been synchronized successfully.",
      });
    } catch (error) {
      toast.error("Sync Failed", {
        description: "Unable to sync rates. Please try again.",
      });
    } finally {
      setIsSyncing(false);
    }
  }, []);

  const handleExport = useCallback(async () => {
    setIsExporting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const headers = [
        "Asset",
        "Platform",
        "Source",
        "Current Rate",
        "Auto Margin",
        "24H Change",
        "Accuracy",
        "Last Synced",
      ];

      const csvContent = [
        headers.join(","),
        ...filteredRates.map((rate) =>
          [
            rate.asset,
            rate.platform,
            rate.source,
            rate.currentRate,
            rate.autoMargin,
            rate.change24h,
            rate.accuracy,
            format(new Date(rate.lastSynced), "yyyy-MM-dd HH:mm:ss"),
          ].join(",")
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `exchange_rates_${format(new Date(), "yyyy-MM-dd")}.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Export Successful", {
        description: `Exported ${filteredRates.length} exchange rates to CSV file.`,
      });
    } catch (error) {
      toast.error("Export Failed", {
        description: "There was an error exporting the rates data.",
      });
    } finally {
      setIsExporting(false);
    }
  }, [filteredRates]);

  const handleEditRate = useCallback((rate: ExchangeRate) => {
    setSelectedRate(rate);
    setIsEditModalOpen(true);
  }, []);

  const handleUpdateRate = useCallback((updatedRate: ExchangeRate) => {
    setRates((prev) =>
      prev.map((rate) => (rate.id === updatedRate.id ? updatedRate : rate))
    );
    toast.success("Rate Updated", {
      description: `${updatedRate.asset} rate has been updated successfully.`,
    });
  }, []);

  const handleSyncRate = useCallback(async (rate: ExchangeRate) => {
    setSyncingRate(rate.id);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setRates((prev) =>
        prev.map((r) =>
          r.id === rate.id ? { ...r, lastSynced: new Date().toISOString() } : r
        )
      );
      toast.success("Rate Synced", {
        description: `${rate.asset} rate has been synchronized.`,
      });
    } catch (error) {
      toast.error("Sync Failed", {
        description: "Unable to sync rate. Please try again.",
      });
    } finally {
      setSyncingRate(null);
    }
  }, []);

  const handleDeleteRate = useCallback(async (rate: ExchangeRate) => {
    try {
      setRates((prev) => prev.filter((r) => r.id !== rate.id));
      toast.success("Rate Deleted", {
        description: `${rate.asset} rate has been removed successfully.`,
      });
    } catch (error) {
      toast.error("Delete Failed", {
        description: "Unable to delete rate.",
      });
    } finally {
      setDeleteDialog({ isOpen: false, rate: null });
    }
  }, []);

  const handleAddRate = useCallback((newRate: Omit<ExchangeRate, "id">) => {
    const rateWithId = {
      ...newRate,
      id: Date.now().toString(),
      lastSynced: new Date().toISOString(),
    };
    setRates((prev) => [rateWithId, ...prev]);
    toast.success("Rate Added", {
      description: `${newRate.asset} rate has been added successfully.`,
    });
  }, []);

  const getPlatformBadgeClass = (platform: string) => {
    return platform === "Telegram" ? "platform-telegram" : "platform-whatsapp";
  };

  const getSourceBadge = (source: string, sourceType?: string) => {
    if (sourceType === "Override") {
      return (
        <div className="flex gap-1">
          <Badge
            variant="outline"
            className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-xs"
          >
            Manual
          </Badge>
          <Badge
            variant="outline"
            className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs"
          >
            Override
          </Badge>
        </div>
      );
    }
    return (
      <Badge
        variant="outline"
        className={`text-xs ${
          source === "API"
            ? "bg-green-500/20 text-green-400 border-green-500/30"
            : "bg-orange-500/20 text-orange-400 border-orange-500/30"
        }`}
      >
        {source}
      </Badge>
    );
  };

  const getChangeColor = (isPositive: boolean) => {
    return isPositive ? "text-green-400" : "text-red-400";
  };

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
                      Rate Management
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>

              {/* Page Header */}
              <div className="flex flex-col space-y-2 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
                <div className="space-y-1">
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold font-poppins tracking-tight">
                    Rate Management
                  </h1>
                  <p className="text-sm md:text-base text-muted-foreground">
                    Control and monitor exchange rates across platforms
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
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
                    variant="outline"
                    className="bg-background hover:bg-muted"
                    onClick={() => setIsAddModalOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Rate
                  </Button>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={handleSyncAll}
                    disabled={isSyncing}
                  >
                    <Sync
                      className={cn(
                        "h-4 w-4 mr-2",
                        isSyncing && "animate-spin"
                      )}
                    />
                    {isSyncing ? "Syncing..." : "Sync All Rates"}
                  </Button>
                </div>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
              <Card className="card-enhanced hover:shadow-lg transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                    Total Rates
                  </CardTitle>
                  <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <Activity className="h-4 w-4 text-blue-500" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-1">
                  <div className="text-xl sm:text-2xl font-bold font-poppins">
                    {statsData.totalRates}
                  </div>
                  <div className="flex items-center text-xs text-blue-500">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    <span>Active rates</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-enhanced hover:shadow-lg transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                    Auto Rates
                  </CardTitle>
                  <div className="h-8 w-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <Zap className="h-4 w-4 text-green-500" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-1">
                  <div className="text-xl sm:text-2xl font-bold font-poppins">
                    {statsData.autoRates}
                  </div>
                  <div className="flex items-center text-xs text-green-500">
                    <RefreshCw className="h-3 w-3 mr-1" />
                    <span>Automated</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-enhanced hover:shadow-lg transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                    Manual Override
                  </CardTitle>
                  <div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <Settings className="h-4 w-4 text-purple-500" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-1">
                  <div className="text-xl sm:text-2xl font-bold font-poppins">
                    {statsData.manualOverride}
                  </div>
                  <div className="flex items-center text-xs text-purple-500">
                    <Edit className="h-3 w-3 mr-1" />
                    <span>Manual control</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-enhanced hover:shadow-lg transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                    Avg. Accuracy
                  </CardTitle>
                  <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <Target className="h-4 w-4 text-emerald-500" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-1">
                  <div className="text-xl sm:text-2xl font-bold font-poppins">
                    {statsData.avgAccuracy}%
                  </div>
                  <div className="flex items-center text-xs text-emerald-500">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    <span>High precision</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Rate History Chart */}
            <Card className="card-enhanced shadow-sm">
              <CardHeader className="border-b border-border/50">
                <CardTitle className="text-lg sm:text-xl font-poppins">
                  Rate History (Last 24 Hours)
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ChartContainer
                  config={{
                    btc: {
                      label: "Bitcoin",
                      color: "#f7931a",
                    },
                    eth: {
                      label: "Ethereum",
                      color: "#627eea",
                    },
                  }}
                  className="h-[250px] sm:h-[300px] md:h-[350px] w-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={rateHistoryData}
                      margin={{
                        top: 5,
                        right: 10,
                        left: 10,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        className="opacity-30"
                      />
                      <XAxis
                        dataKey="time"
                        tick={{ fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                        className="text-muted-foreground"
                      />
                      <YAxis
                        tick={{ fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                        className="text-muted-foreground"
                        tickFormatter={(value) =>
                          `${(value / 1000000).toFixed(0)}M`
                        }
                      />
                      <ChartTooltip
                        content={<ChartTooltipContent />}
                        formatter={(value: any, name: string) => [
                          `₦${(value / 1000000).toFixed(1)}M`,
                          name === "btc" ? "Bitcoin" : "Ethereum",
                        ]}
                      />
                      <Line
                        type="monotone"
                        dataKey="btc"
                        stroke="var(--color-btc)"
                        strokeWidth={3}
                        dot={{ r: 4, fill: "var(--color-btc)" }}
                        activeDot={{ r: 6, fill: "var(--color-btc)" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="eth"
                        stroke="var(--color-eth)"
                        strokeWidth={3}
                        dot={{ r: 4, fill: "var(--color-eth)" }}
                        activeDot={{ r: 6, fill: "var(--color-eth)" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Exchange Rates Table */}
            <Card className="card-enhanced shadow-sm">
              <CardHeader className="border-b border-border/50">
                <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
                  <CardTitle className="text-lg sm:text-xl font-poppins">
                    Exchange Rates
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="p-6">
                    <TableSkeleton />
                  </div>
                ) : (
                  <>
                    <div className="p-4 sm:p-6 space-y-4">
                      {/* Search and Filters */}
                      <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                        <div className="relative flex-1">
                          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            placeholder="Search by asset, platform, or source..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 bg-background/50 border-border/50"
                          />
                        </div>
                        <div className="flex items-center gap-2 overflow-x-auto scrollbar-thin pb-2 sm:pb-0 sm:overflow-x-visible">
                          <div className="flex items-center gap-2 min-w-max">
                            {filterOptions.map((filter) => (
                              <DropdownMenu key={filter.key}>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      "bg-background/50 border-border/50 whitespace-nowrap hover:bg-muted focus:bg-muted",
                                      activeFilters[filter.key] &&
                                        "bg-primary/10 border-primary/30"
                                    )}
                                  >
                                    <Filter className="h-4 w-4 mr-2" />
                                    {activeFilters[filter.key]
                                      ? filter.options.find(
                                          (opt) =>
                                            opt.value ===
                                            activeFilters[filter.key]
                                        )?.label || filter.label
                                      : filter.label}
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  align="end"
                                  className="w-48"
                                >
                                  {filter.options.map((option) => (
                                    <DropdownMenuItem
                                      key={option.value}
                                      onSelect={() =>
                                        handleFilterChange(
                                          filter.key,
                                          option.value
                                        )
                                      }
                                      className={cn(
                                        "cursor-pointer",
                                        activeFilters[filter.key] ===
                                          option.value && "bg-primary/10"
                                      )}
                                    >
                                      {option.label}
                                    </DropdownMenuItem>
                                  ))}
                                  {activeFilters[filter.key] && (
                                    <>
                                      <DropdownMenuItem
                                        onSelect={() =>
                                          handleFilterChange(filter.key, "")
                                        }
                                        className="cursor-pointer text-muted-foreground"
                                      >
                                        Clear filter
                                      </DropdownMenuItem>
                                    </>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            ))}

                            {/* Clear All Filters */}
                            {Object.values(activeFilters).some(Boolean) && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleClearFilters}
                                className="text-muted-foreground hover:text-foreground whitespace-nowrap"
                              >
                                Clear All
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Table */}
                      <div className="rounded-lg border border-border/50 overflow-hidden">
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow className="bg-muted/30">
                                <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                  Asset
                                </TableHead>
                                <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                  Platform
                                </TableHead>
                                <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                  Source
                                </TableHead>
                                <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                  Current Rate
                                </TableHead>
                                <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                  Auto Margin
                                </TableHead>
                                <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                  24H Change
                                </TableHead>
                                <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                  Accuracy
                                </TableHead>
                                <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                  Last Synced
                                </TableHead>
                                <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                  Actions
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {paginatedRates.map((rate) => (
                                <TableRow
                                  key={rate.id}
                                  className="hover:bg-muted/20"
                                >
                                  <TableCell className="font-medium">
                                    {rate.asset}
                                  </TableCell>
                                  <TableCell>
                                    <Badge
                                      variant="outline"
                                      className={`text-xs ${getPlatformBadgeClass(
                                        rate.platform
                                      )}`}
                                    >
                                      {rate.platform}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    {getSourceBadge(
                                      rate.source,
                                      rate.sourceType
                                    )}
                                  </TableCell>
                                  <TableCell className="font-mono font-medium">
                                    {rate.currentRate}
                                  </TableCell>
                                  <TableCell className="text-green-400 font-medium">
                                    {rate.autoMargin}
                                  </TableCell>
                                  <TableCell>
                                    <span
                                      className={getChangeColor(
                                        rate.changePositive
                                      )}
                                    >
                                      {rate.change24h}
                                    </span>
                                  </TableCell>
                                  <TableCell className="text-green-400 font-medium">
                                    {rate.accuracy}
                                  </TableCell>
                                  <TableCell className="text-xs text-muted-foreground">
                                    <div>
                                      {formatDistanceToNow(
                                        new Date(rate.lastSynced),
                                        { addSuffix: true }
                                      )}
                                    </div>
                                    <div className="text-xs opacity-70">
                                      {format(
                                        new Date(rate.lastSynced),
                                        "MMM d, HH:mm"
                                      )}
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-8 w-8 p-0"
                                        >
                                          <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuItem
                                          onClick={() => handleEditRate(rate)}
                                        >
                                          <Edit className="h-4 w-4 mr-2" />
                                          Edit Rate
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          onClick={() => handleSyncRate(rate)}
                                          disabled={syncingRate === rate.id}
                                        >
                                          {syncingRate === rate.id ? (
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                          ) : (
                                            <RefreshCw className="h-4 w-4 mr-2" />
                                          )}
                                          Sync Now
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          className="text-red-600"
                                          onClick={() =>
                                            setDeleteDialog({
                                              isOpen: true,
                                              rate,
                                            })
                                          }
                                        >
                                          <Trash2 className="h-4 w-4 mr-2" />
                                          Delete
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>

                      {/* Pagination Controls */}
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
                              filteredRates.length
                            )}{" "}
                            to{" "}
                            {Math.min(
                              currentPage * pageSize,
                              filteredRates.length
                            )}{" "}
                            of {filteredRates.length} rates
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
      <AddRateModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddRate}
      />
      <EditRateModal
        rate={selectedRate}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedRate(null);
        }}
        onUpdate={handleUpdateRate}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteDialog.isOpen}
        onOpenChange={(open) => setDeleteDialog({ isOpen: open, rate: null })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Exchange Rate</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the {deleteDialog.rate?.asset}{" "}
              rate for {deleteDialog.rate?.platform}? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deleteDialog.rate && handleDeleteRate(deleteDialog.rate)
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
