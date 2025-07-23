"use client";

import { useState, useMemo } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Download } from "lucide-react";
import { SearchFilters } from "@/components/ui/search-filters";
import { MobileTable } from "@/components/ui/mobile-table";
import type { Trade } from "@/lib/types";
import { TradeModal } from "@/components/modals/trade-modal";
// import SearchFilters from "@/components/ui/search-filters";

// Mock trade data
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
    flags: ["missing_proof"],
  },
  {
    id: "TXN003",
    userId: "3",
    user: { username: "@+234812345678", platform: "whatsapp" },
    assetType: "Ethereum",
    amount: "2.5 ETH",
    status: "started",
    rate: 4200000,
    payout: 10500000,
    createdAt: "2024-01-20T16:45:00Z",
    updatedAt: "2024-01-20T16:45:00Z",
    flags: [],
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
    flags: ["suspicious"],
  },
];

const filterOptions = [
  {
    key: "status",
    label: "Status",
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
    label: "Asset Type",
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
    label: "Platform",
    options: [
      { value: "telegram", label: "Telegram" },
      { value: "whatsapp", label: "WhatsApp" },
    ],
  },
];

export default function TradesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>(
    {}
  );

  // Add state management:
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [modalMode, setModalMode] = useState<
    "view" | "note" | "recalculate" | "cancel"
  >("view");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredTrades = useMemo(() => {
    return mockTrades.filter((trade) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !trade.id.toLowerCase().includes(query) &&
          !trade.user.username.toLowerCase().includes(query) &&
          !trade.assetType.toLowerCase().includes(query)
        ) {
          return false;
        }
      }

      // Status filter
      if (activeFilters.status && trade.status !== activeFilters.status) {
        return false;
      }

      // Asset type filter
      if (
        activeFilters.assetType &&
        trade.assetType !== activeFilters.assetType
      ) {
        return false;
      }

      // Platform filter
      if (
        activeFilters.platform &&
        trade.user.platform !== activeFilters.platform
      ) {
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

  const handleExport = () => {
    console.log("Exporting trades data...");
    // Implementation for export functionality
  };

  const columns = [
    {
      key: "id",
      label: "Trade ID",
      className: "font-mono font-medium",
    },
    {
      key: "user",
      label: "User",
      render: (_: any, row: Trade) => (
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
      key: "assetType",
      label: "Asset Type",
      render: (value: string) => (
        <Badge
          variant="outline"
          className={
            value.includes("Bitcoin")
              ? "border-orange-500 text-orange-600"
              : value.includes("Ethereum")
              ? "border-blue-500 text-blue-600"
              : "border-purple-500 text-purple-600"
          }
        >
          {value}
        </Badge>
      ),
    },
    {
      key: "amount",
      label: "Amount",
      className: "font-mono",
    },
    {
      key: "status",
      label: "Status",
      render: (value: string) => (
        <Badge
          variant={
            value === "completed"
              ? "default"
              : value === "awaiting_proof"
              ? "secondary"
              : value === "cancelled"
              ? "destructive"
              : "outline"
          }
          className={
            value === "completed"
              ? "bg-green-500"
              : value === "awaiting_proof"
              ? "bg-orange-500"
              : ""
          }
        >
          {value.replace("_", " ")}
        </Badge>
      ),
    },
    {
      key: "rate",
      label: "Rate",
      render: (value: number) => `₦${value.toLocaleString()}`,
      className: "font-mono",
    },
    {
      key: "payout",
      label: "Payout",
      render: (value: number) => `₦${value.toLocaleString()}`,
      className: "font-mono",
    },
    {
      key: "flags",
      label: "Flags",
      render: (flags: string[]) =>
        flags.length > 0 ? (
          <Badge variant="destructive" className="text-xs">
            {flags[0].replace("_", " ")}
          </Badge>
        ) : (
          <span className="text-muted-foreground text-sm">None</span>
        ),
    },
  ];

  // Update actions:
  const actions = [
    {
      label: "View Details",
      onClick: (trade: Trade) => {
        setSelectedTrade(trade);
        setModalMode("view");
        setIsModalOpen(true);
      },
    },
    {
      label: "Add Note",
      onClick: (trade: Trade) => {
        setSelectedTrade(trade);
        setModalMode("note");
        setIsModalOpen(true);
      },
    },
    {
      label: "Recalculate",
      onClick: (trade: Trade) => {
        setSelectedTrade(trade);
        setModalMode("recalculate");
        setIsModalOpen(true);
      },
    },
    {
      label: "Cancel Trade",
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
        <div className="font-mono font-semibold">{trade.id}</div>
        <Badge
          variant={
            trade.status === "completed"
              ? "default"
              : trade.status === "awaiting_proof"
              ? "secondary"
              : trade.status === "cancelled"
              ? "destructive"
              : "outline"
          }
          className={
            trade.status === "completed"
              ? "bg-green-500"
              : trade.status === "awaiting_proof"
              ? "bg-orange-500"
              : ""
          }
        >
          {trade.status.replace("_", " ")}
        </Badge>
      </div>

      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8">
          <AvatarFallback>
            {trade.user.username.slice(1, 3).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="font-medium">{trade.user.username}</div>
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
              className={
                trade.assetType.includes("Bitcoin")
                  ? "border-orange-500 text-orange-600"
                  : trade.assetType.includes("Ethereum")
                  ? "border-blue-500 text-blue-600"
                  : "border-purple-500 text-purple-600"
              }
            >
              {trade.assetType}
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
          <div className="font-mono font-medium">
            ₦{trade.payout?.toLocaleString()}
          </div>
        </div>
      </div>

      {trade.flags.length > 0 && (
        <div>
          <span className="text-muted-foreground text-sm">Flags:</span>
          <div className="mt-1">
            <Badge variant="destructive" className="text-xs">
              {trade.flags[0].replace("_", " ")}
            </Badge>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <div className="flex flex-1 flex-col gap-6 container-padding pt-0">
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="heading-responsive font-bold tracking-tight">
                Trade Management
              </h1>
              <p className="text-responsive text-muted-foreground">
                Monitor and manage all trading activities with real-time
                updates.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <SearchFilters
                searchPlaceholder="Search by Trade ID or User..."
                filters={filterOptions}
                onSearch={setSearchQuery}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
                activeFilters={activeFilters}
                className="flex-1"
              />
              <Button onClick={handleExport} className="sm:ml-4">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>

            <MobileTable
              columns={columns}
              data={filteredTrades}
              actions={actions}
              mobileCardRender={mobileCardRender}
              emptyMessage="No trades found matching your criteria."
            />

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div>
                Showing {filteredTrades.length} of {mockTrades.length} trades
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
      <TradeModal
        trade={selectedTrade}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTrade(null);
        }}
        mode={modalMode}
      />
    </SidebarProvider>
  );
}
