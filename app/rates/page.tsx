"use client";

import { useState } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SearchFilters } from "@/components/ui/search-filters";
import { AddRateModal } from "@/components/modals/add-rate-modal";
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
  Plus,
  Search,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Bitcoin,
  Smartphone,
} from "lucide-react";

// Mock data for rates
const mockRates = [
  {
    id: "1",
    asset: "Bitcoin",
    symbol: "BTC",
    platform: "Telegram",
    buyRate: 65500000,
    sellRate: 66200000,
    change: 2.5,
    lastUpdated: "2 min ago",
    status: "active",
    icon: Bitcoin,
  },
  {
    id: "2",
    asset: "Ethereum",
    symbol: "ETH",
    platform: "WhatsApp",
    buyRate: 4200000,
    sellRate: 4250000,
    change: -1.2,
    lastUpdated: "5 min ago",
    status: "active",
    icon: DollarSign,
  },
  {
    id: "3",
    asset: "Amazon Gift Card",
    symbol: "AGC",
    platform: "Both",
    buyRate: 850,
    sellRate: 900,
    change: 0.8,
    lastUpdated: "10 min ago",
    status: "active",
    icon: Smartphone,
  },
];

// Mock data for rate history chart
const rateHistoryData = [
  { time: "00:00", bitcoin: 65200000, ethereum: 4180000 },
  { time: "04:00", bitcoin: 65400000, ethereum: 4190000 },
  { time: "08:00", bitcoin: 65100000, ethereum: 4170000 },
  { time: "12:00", bitcoin: 65600000, ethereum: 4210000 },
  { time: "16:00", bitcoin: 65800000, ethereum: 4230000 },
  { time: "20:00", bitcoin: 65500000, ethereum: 4200000 },
  { time: "24:00", bitcoin: 66200000, ethereum: 4250000 },
];

export default function RatesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `₦${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `₦${(amount / 1000).toFixed(0)}K`;
    }
    return `₦${amount.toLocaleString()}`;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return "text-green-500";
    if (change < 0) return "text-red-500";
    return "text-muted-foreground";
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-3 w-3" />;
    if (change < 0) return <TrendingDown className="h-3 w-3" />;
    return null;
  };

  const filteredRates = mockRates.filter(
    (rate) =>
      rate.asset.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rate.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rate.platform.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="fixed-header-layout">
        <Header />
        <div className="scrollable-content flex flex-1 flex-col gap-6 container-padding">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-9">
            <div>
              <h1 className="heading-responsive font-bold font-poppins">
                Exchange Rates
              </h1>
              <p className="text-responsive text-muted-foreground">
                Manage trading rates for cryptocurrencies and gift cards
              </p>
            </div>
            <Button onClick={() => setIsAddModalOpen(true)} className="w-fit">
              <Plus className="h-4 w-4 mr-2" />
              Add Rate
            </Button>
          </div>

          {/* Rate History Chart */}
          <Card className="card-enhanced">
            <CardHeader>
              <CardTitle className="font-poppins">
                Rate History (Last 24 Hours)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  bitcoin: {
                    label: "Bitcoin",
                    color: "#f7931a",
                  },
                  ethereum: {
                    label: "Ethereum",
                    color: "#627eea",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={rateHistoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="bitcoin"
                      stroke="var(--color-bitcoin)"
                      strokeWidth={2}
                      name="Bitcoin (₦)"
                    />
                    <Line
                      type="monotone"
                      dataKey="ethereum"
                      stroke="var(--color-ethereum)"
                      strokeWidth={2}
                      name="Ethereum (₦)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search rates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <SearchFilters />
          </div>

          {/* Rates Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredRates.map((rate) => {
              const IconComponent = rate.icon;
              return (
                <Card key={rate.id} className="card-enhanced">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <IconComponent className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-base font-poppins">
                            {rate.asset}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {rate.symbol}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          rate.platform === "Telegram"
                            ? "platform-telegram"
                            : rate.platform === "WhatsApp"
                            ? "platform-whatsapp"
                            : ""
                        }
                      >
                        {rate.platform}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          Buy Rate
                        </span>
                        <span className="font-semibold text-green-600">
                          {formatCurrency(rate.buyRate)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          Sell Rate
                        </span>
                        <span className="font-semibold text-blue-600">
                          {formatCurrency(rate.sellRate)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          24h Change
                        </span>
                        <div
                          className={`flex items-center gap-1 ${getChangeColor(
                            rate.change
                          )}`}
                        >
                          {getChangeIcon(rate.change)}
                          <span className="font-semibold">
                            {rate.change > 0 ? "+" : ""}
                            {rate.change}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="pt-3 border-t">
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>Last updated: {rate.lastUpdated}</span>
                        <Badge
                          variant={
                            rate.status === "active" ? "default" : "secondary"
                          }
                          className="text-xs"
                        >
                          {rate.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredRates.length === 0 && (
            <div className="text-center py-12">
              <div className="text-muted-foreground">
                No rates found matching your search.
              </div>
            </div>
          )}
        </div>
      </SidebarInset>

      <AddRateModal open={isAddModalOpen} onOpenChange={setIsAddModalOpen} />
    </SidebarProvider>
  );
}
