"use client";

import { useState, useMemo } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  TestTube,
  AlertCircle,
  CheckCircle,
  Settings,
  Power,
  Trash2,
} from "lucide-react";
import { SearchFilters } from "@/components/ui/search-filters";
import { MobileTable } from "@/components/ui/mobile-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddAPIModal } from "@/components/modals/add-api-modal";
import type { APISource } from "@/lib/types";

// Mock API source data matching the design
const mockAPISources: APISource[] = [
  {
    id: "1",
    name: "CardCash API",
    sourceUrl: "https://api.cardcash.com/v1",
    type: "gift_card",
    supportedAssets: ["Amazon", "Steam", "iTunes", "+1 more"],
    status: "active",
    uptime: 99.2,
    lastSync: "2025-01-08T14:45:30Z",
    errorCount: 2,
    priority: 1,
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
];

export default function GiftCardAPIPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>(
    {}
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredSources = useMemo(() => {
    return mockAPISources.filter((source) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !source.name.toLowerCase().includes(query) &&
          !source.sourceUrl.toLowerCase().includes(query)
        ) {
          return false;
        }
      }

      // Status filter
      if (activeFilters.status && source.status !== activeFilters.status) {
        return false;
      }

      return true;
    });
  }, [searchQuery, activeFilters]);

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

  const columns = [
    {
      key: "name",
      label: "API NAME",
      className: "font-medium",
    },
    {
      key: "sourceUrl",
      label: "SOURCE URL",
      render: (value: string) => (
        <code className="text-xs bg-muted/50 px-2 py-1 rounded text-muted-foreground">
          {value}
        </code>
      ),
    },
    {
      key: "supportedAssets",
      label: "SUPPORTED ASSETS",
      render: (assets: string[]) => (
        <div className="flex flex-wrap gap-1">
          {assets.map((asset, index) => (
            <Badge
              key={index}
              variant="outline"
              className={`text-xs ${
                asset.includes("Amazon")
                  ? "border-orange-500/30 text-orange-400"
                  : asset.includes("Steam")
                  ? "border-purple-500/30 text-purple-400"
                  : asset.includes("iTunes")
                  ? "border-blue-500/30 text-blue-400"
                  : "border-muted-foreground/30 text-muted-foreground"
              }`}
            >
              {asset}
            </Badge>
          ))}
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
            className={`${
              value === "active"
                ? "status-active border-green-500/30"
                : "status-inactive border-red-500/30"
            }`}
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
              className="text-xs border-orange-500/30 text-orange-400"
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
        <span className="font-mono text-sm">{value}%</span>
      ),
    },
    {
      key: "priority",
      label: "PRIORITY",
      render: (value: number) => (
        <Badge variant="outline" className="font-mono">
          #{value}
        </Badge>
      ),
    },
    {
      key: "lastSync",
      label: "LAST SYNC",
      render: (value: string) => (
        <span className="text-sm text-muted-foreground">
          {new Date(value).toLocaleString()}
        </span>
      ),
    },
  ];

  const actions = [
    {
      label: "Configure",
      onClick: (source: APISource) => console.log("Configure", source.id),
      icon: Settings,
    },
    {
      label: "Test API",
      onClick: (source: APISource) => console.log("Test", source.id),
      icon: TestTube,
    },
    {
      label: "Toggle Status",
      onClick: (source: APISource) => console.log("Toggle", source.id),
      icon: Power,
    },
    {
      label: "Delete",
      onClick: (source: APISource) => console.log("Delete", source.id),
      variant: "destructive" as const,
      icon: Trash2,
    },
  ];

  const totalAPIs = mockAPISources.length;
  const activeAPIs = mockAPISources.filter((s) => s.status === "active").length;
  const avgUptime =
    mockAPISources.reduce((acc, s) => acc + s.uptime, 0) /
    mockAPISources.length;
  const totalErrors = mockAPISources.reduce((acc, s) => acc + s.errorCount, 0);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <div className="flex flex-1 flex-col gap-6 container-padding pt-0">
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold font-poppins">
                Gift Card API Management
              </h1>
              <p className="text-muted-foreground">
                Manage gift card rate sources and API integrations
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
                    <span className="text-blue-400 font-bold">📊</span>
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
                    Avg. Uptime
                  </CardTitle>
                  <div className="h-8 w-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                    <span className="text-orange-400 font-bold">📈</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold font-poppins">
                    {avgUptime.toFixed(1)}%
                  </div>
                </CardContent>
              </Card>

              <Card className="card-enhanced">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Errors
                  </CardTitle>
                  <div className="h-8 w-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                    <AlertCircle className="h-4 w-4 text-red-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold font-poppins">
                    {totalErrors}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* API Sources Table */}
            <Card className="card-enhanced">
              <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <CardTitle className="font-poppins">Gift Card APIs</CardTitle>
                <Button
                  onClick={() => setIsAddModalOpen(true)}
                  className="w-full sm:w-auto"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add API Source
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <SearchFilters
                  searchPlaceholder="Search..."
                  filterOptions={filterOptions}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  onFilterChange={handleFilterChange}
                  onClearFilters={handleClearFilters}
                  activeFilters={activeFilters}
                />

                <MobileTable
                  data={filteredSources}
                  columns={columns}
                  actions={actions}
                  emptyMessage="No API sources found"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>

      <AddAPIModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        type="giftcard"
      />
    </SidebarProvider>
  );
}
