"use client";

import { useState, useMemo } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Download,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react";
import { SearchFilters } from "@/components/ui/search-filters";
import { MobileTable } from "@/components/ui/mobile-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddCryptoAPIModal } from "@/components/modals/add-crypto-api-modal";
import type { APIConfig } from "@/lib/types";

// Mock crypto API data
const mockCryptoAPIs: APIConfig[] = [
  {
    id: "1",
    name: "CoinGecko",
    type: "crypto",
    status: "active",
    priority: 1,
    autoMargin: 2.0,
    supportedAssets: ["Bitcoin", "Ethereum", "USDT", "BNB"],
    lastSync: "2025-01-08 14:30:00",
    errorCount: 0,
    uptime: 99.9,
  },
  {
    id: "2",
    name: "Binance API",
    type: "crypto",
    status: "active",
    priority: 2,
    autoMargin: 1.5,
    supportedAssets: ["Bitcoin", "Ethereum", "BNB", "Cardano"],
    lastSync: "2025-01-08 14:28:00",
    errorCount: 2,
    uptime: 98.5,
  },
  {
    id: "3",
    name: "CoinMarketCap",
    type: "crypto",
    status: "error",
    priority: 3,
    autoMargin: 2.5,
    supportedAssets: ["Bitcoin", "Ethereum", "XRP"],
    lastSync: "2025-01-08 13:45:00",
    errorCount: 15,
    uptime: 85.2,
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

export default function CryptoAPIPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>(
    {}
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredAPIs = useMemo(() => {
    return mockCryptoAPIs.filter((api) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!api.name.toLowerCase().includes(query)) {
          return false;
        }
      }

      for (const [key, value] of Object.entries(activeFilters)) {
        if (value && api[key as keyof APIConfig]?.toString() !== value) {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "status-active";
      case "inactive":
        return "status-inactive";
      case "error":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getUptimeColor = (uptime: number) => {
    if (uptime >= 99) return "text-green-400";
    if (uptime >= 95) return "text-yellow-400";
    return "text-red-400";
  };

  const columns = [
    {
      key: "name",
      label: "API NAME",
      className: "font-medium",
    },
    {
      key: "status",
      label: "STATUS",
      render: (value: string) => (
        <Badge variant="outline" className={getStatusColor(value)}>
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
        <Badge variant="outline" className="font-mono">
          {value}
        </Badge>
      ),
    },
    {
      key: "autoMargin",
      label: "AUTO MARGIN",
      render: (value: number) => <span className="font-mono">+{value}%</span>,
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
              className="text-xs asset-crypto"
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
        <span className={`font-mono font-medium ${getUptimeColor(value)}`}>
          {value}%
        </span>
      ),
    },
    {
      key: "errorCount",
      label: "ERRORS",
      render: (value: number) => (
        <span
          className={`font-mono ${
            value > 0 ? "text-red-400" : "text-green-400"
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: "lastSync",
      label: "LAST SYNC",
      className: "font-mono text-sm text-muted-foreground",
    },
  ];

  const actions = [
    { label: "Edit", onClick: (api: APIConfig) => console.log("Edit", api.id) },
    { label: "Test", onClick: (api: APIConfig) => console.log("Test", api.id) },
    {
      label: "Disable",
      onClick: (api: APIConfig) => console.log("Disable", api.id),
      variant: "destructive" as const,
    },
  ];

  const totalAPIs = 3;
  const activeAPIs = 2;
  const errorAPIs = 1;
  const avgUptime = 94.5;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <div className="flex flex-1 flex-col gap-6 container-padding pt-0">
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold font-poppins">
                Crypto API Management
              </h1>
              <p className="text-muted-foreground">
                Manage cryptocurrency price data sources and configurations
              </p>
            </div>

            {/* Overview Cards */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card className="card-enhanced">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total APIs
                  </CardTitle>
                  <div className="h-8 w-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-blue-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold font-poppins">
                    {totalAPIs}
                  </div>
                </CardContent>
              </Card>

              <Card className="card-enhanced">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active APIs
                  </CardTitle>
                  <div className="h-8 w-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold font-poppins">
                    {activeAPIs}
                  </div>
                </CardContent>
              </Card>

              <Card className="card-enhanced">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Error APIs
                  </CardTitle>
                  <div className="h-8 w-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                    <AlertTriangle className="h-4 w-4 text-red-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold font-poppins">
                    {errorAPIs}
                  </div>
                </CardContent>
              </Card>

              <Card className="card-enhanced">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Avg Uptime
                  </CardTitle>
                  <div className="h-8 w-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                    <Clock className="h-4 w-4 text-orange-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold font-poppins">
                    {avgUptime}%
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* APIs Table */}
            <Card className="card-enhanced">
              <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <CardTitle className="font-poppins">Crypto APIs</CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto bg-background/50 border-border/50"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button
                    onClick={() => setIsAddModalOpen(true)}
                    className="w-full sm:w-auto"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add API
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <SearchFilters
                  searchPlaceholder="Search APIs..."
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  filterOptions={filterOptions}
                  onFilterChange={handleFilterChange}
                  onClearFilters={handleClearFilters}
                  activeFilters={activeFilters}
                />

                <MobileTable
                  data={filteredAPIs}
                  columns={columns}
                  actions={actions}
                  emptyMessage="No crypto APIs found"
                />

                <div className="text-sm text-muted-foreground">
                  Showing {filteredAPIs.length} of {mockCryptoAPIs.length} APIs
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>

      <AddCryptoAPIModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </SidebarProvider>
  );
}
