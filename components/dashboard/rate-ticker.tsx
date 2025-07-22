"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, TrendingUp, TrendingDown } from "lucide-react";

interface RateData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  icon: string;
}

export function RateTicker() {
  const [rates, setRates] = useState<RateData[]>([
    {
      symbol: "BTC",
      name: "Bitcoin",
      price: 98450000,
      change: 2250000,
      changePercent: 2.3,
      icon: "₿",
    },
    {
      symbol: "ETH",
      name: "Ethereum",
      price: 5850000,
      change: -125000,
      changePercent: -2.1,
      icon: "Ξ",
    },
    {
      symbol: "USDT",
      name: "Tether",
      price: 1685,
      change: 5,
      changePercent: 0.3,
      icon: "₮",
    },
    {
      symbol: "Steam",
      name: "Steam Card",
      price: 1425,
      change: 25,
      changePercent: 1.8,
      icon: "🎮",
    },
    {
      symbol: "Amazon",
      name: "Amazon Card",
      price: 1380,
      change: -20,
      changePercent: -1.4,
      icon: "📦",
    },
    {
      symbol: "iTunes",
      name: "iTunes Card",
      price: 1350,
      change: 15,
      changePercent: 1.1,
      icon: "🎵",
    },
  ]);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refreshRates();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const refreshRates = async () => {
    setIsRefreshing(true);

    // Simulate API call with random price fluctuations
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setRates((prevRates) =>
      prevRates.map((rate) => {
        const fluctuation = (Math.random() - 0.5) * 0.02; // ±1% fluctuation
        const newPrice = Math.round(rate.price * (1 + fluctuation));
        const change = newPrice - rate.price;
        const changePercent = (change / rate.price) * 100;

        return {
          ...rate,
          price: newPrice,
          change,
          changePercent: Number(changePercent.toFixed(2)),
        };
      })
    );

    setLastUpdated(new Date());
    setIsRefreshing(false);
  };

  const formatPrice = (price: number, symbol: string) => {
    if (symbol === "BTC" || symbol === "ETH") {
      return `₦${(price / 1000000).toFixed(2)}M`;
    }
    return `₦${price.toLocaleString()}`;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return "text-green-400";
    if (change < 0) return "text-red-400";
    return "text-muted-foreground";
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-3 w-3" />;
    if (change < 0) return <TrendingDown className="h-3 w-3" />;
    return null;
  };

  return (
    <Card className="card-enhanced">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-poppins">Live Rate Ticker</CardTitle>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={refreshRates}
            disabled={isRefreshing}
            className="h-8 w-8 p-0"
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {rates.map((rate) => (
            <div
              key={rate.symbol}
              className="flex flex-col items-center p-4 rounded-lg bg-muted/20 border border-border/50 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{rate.icon}</span>
                <div className="text-center">
                  <div className="font-semibold text-sm">{rate.symbol}</div>
                  <div className="text-xs text-muted-foreground">
                    {rate.name}
                  </div>
                </div>
              </div>

              <div className="text-center">
                <div className="font-mono font-bold text-lg">
                  {formatPrice(rate.price, rate.symbol)}
                </div>

                <div
                  className={`flex items-center justify-center gap-1 text-xs ${getChangeColor(
                    rate.change
                  )}`}
                >
                  {getChangeIcon(rate.change)}
                  <span>
                    {rate.changePercent > 0 ? "+" : ""}
                    {rate.changePercent}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="mt-6 pt-4 border-t border-border/50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-sm text-muted-foreground">Active Rates</div>
              <div className="text-lg font-bold">{rates.length}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Avg Change</div>
              <div
                className={`text-lg font-bold ${getChangeColor(
                  rates.reduce((acc, rate) => acc + rate.changePercent, 0) /
                    rates.length
                )}`}
              >
                {(
                  rates.reduce((acc, rate) => acc + rate.changePercent, 0) /
                  rates.length
                ).toFixed(1)}
                %
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Gainers</div>
              <div className="text-lg font-bold text-green-400">
                {rates.filter((rate) => rate.change > 0).length}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Losers</div>
              <div className="text-lg font-bold text-red-400">
                {rates.filter((rate) => rate.change < 0).length}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
