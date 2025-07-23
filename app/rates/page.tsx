"use client";

import { useState } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";

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

// Mock data for exchange rates table
const exchangeRatesData = [
  {
    id: "1",
    asset: "BTC",
    platform: "Telegram",
    source: "API",
    currentRate: "₦98,450,000",
    autoMargin: "2.5%",
    change24h: "+2.3%",
    accuracy: "99.2%",
    lastSynced: "2025-01-08 14:45:30",
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
    lastSynced: "2025-01-08 12:30:15",
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
    lastSynced: "2025-01-08 14:44:22",
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
    lastSynced: "2025-01-08 14:43:15",
    changePositive: true,
  },
];

const filterOptions = [
  {
    key: "platform",
    label: "All Platforms",
    options: [
      { value: "telegram", label: "Telegram" },
      { value: "whatsapp", label: "WhatsApp" },
    ],
  },
  {
    key: "source",
    label: "All Sources",
    options: [
      { value: "api", label: "API" },
      { value: "manual", label: "Manual" },
    ],
  },
  {
    key: "asset",
    label: "All Assets",
    options: [
      { value: "btc", label: "Bitcoin" },
      { value: "eth", label: "Ethereum" },
      { value: "steam", label: "Steam" },
    ],
  },
];

export default function RatesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>(
    {}
  );

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
                <Button className="bg-blue-600 hover:bg-blue-700 w-fit">
                  <Sync className="h-4 w-4 mr-2" />
                  Sync All Rates
                </Button>
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
                <div className="p-4 sm:p-6 space-y-4">
                  {/* Search and Filters */}
                  <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 bg-background/50 border-border/50"
                      />
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto scrollbar-thin pb-2 sm:pb-0 sm:overflow-x-visible">
                      <div className="flex items-center gap-2 min-w-max">
                        <Button
                          variant="outline"
                          className="bg-background/50 border-border/50 whitespace-nowrap"
                        >
                          <Filter className="h-4 w-4 mr-2" />
                          Filter
                        </Button>
                        {filterOptions.map((filter) => (
                          <DropdownMenu key={filter.key}>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="outline"
                                className="bg-background/50 border-border/50 whitespace-nowrap"
                              >
                                {filter.label}
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              {filter.options.map((option) => (
                                <DropdownMenuItem key={option.value}>
                                  {option.label}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        ))}
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
                          {exchangeRatesData.map((rate) => (
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
                                {getSourceBadge(rate.source, rate.sourceType)}
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
                              <TableCell className="text-xs text-muted-foreground font-mono">
                                {rate.lastSynced}
                              </TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                      <Edit className="h-4 w-4 mr-2" />
                                      Edit Rate
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <RefreshCw className="h-4 w-4 mr-2" />
                                      Sync Now
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-600">
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
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
