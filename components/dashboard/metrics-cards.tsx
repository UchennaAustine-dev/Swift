"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  ArrowLeftRight,
  DollarSign,
  Clock,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  RefreshCw,
} from "lucide-react";
import type { DashboardMetrics } from "@/lib/types";

interface MetricsCardsProps {
  metrics: DashboardMetrics;
}

export function MetricsCards({ metrics }: MetricsCardsProps) {
  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `₦${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `₦${(amount / 1000).toFixed(1)}K`;
    }
    return `₦${amount.toLocaleString()}`;
  };

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return "text-green-600 dark:text-green-400";
    if (growth < 0) return "text-red-600 dark:text-red-400";
    return "text-muted-foreground";
  };

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) return <TrendingUp className="h-3 w-3" />;
    if (growth < 0) return <TrendingDown className="h-3 w-3" />;
    return null;
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Users */}
      <Card className="card-enhanced">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold font-poppins">
            {metrics.totalUsers.toLocaleString()}
          </div>
          <div className="flex items-center gap-1 text-xs">
            <div
              className={`flex items-center gap-1 ${getGrowthColor(
                metrics.userGrowth
              )}`}
            >
              {getGrowthIcon(metrics.userGrowth)}
              <span>{Math.abs(metrics.userGrowth)}%</span>
            </div>
            <span className="text-muted-foreground">from last month</span>
          </div>
        </CardContent>
      </Card>

      {/* Active Trades */}
      <Card className="card-enhanced">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Trades</CardTitle>
          <ArrowLeftRight className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold font-poppins">
            {metrics.activeTrades}
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              {metrics.completedToday} completed today
            </p>
            {metrics.activeTrades > 10 && (
              <Badge variant="secondary" className="text-xs">
                High Volume
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Daily Earnings */}
      <Card className="card-enhanced">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Daily Earnings</CardTitle>
          <DollarSign className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold font-poppins">
            {formatCurrency(metrics.dailyEarnings)}
          </div>
          <div className="flex items-center gap-1 text-xs">
            <div
              className={`flex items-center gap-1 ${getGrowthColor(
                metrics.earningsGrowth
              )}`}
            >
              {getGrowthIcon(metrics.earningsGrowth)}
              <span>{Math.abs(metrics.earningsGrowth)}%</span>
            </div>
            <span className="text-muted-foreground">from yesterday</span>
          </div>
        </CardContent>
      </Card>

      {/* Average Trade Time */}
      <Card className="card-enhanced">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Trade Time</CardTitle>
          <Clock className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold font-poppins">
            {metrics.avgTradeTime}
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">Processing time</p>
            <Badge variant="outline" className="text-xs">
              Optimal
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Flagged Users - Full width on mobile, spans 2 columns on larger screens */}
      <Card className="card-enhanced md:col-span-2 lg:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">System Alerts</CardTitle>
          <AlertTriangle className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold font-poppins">
                {metrics.flaggedUsers}
              </div>
              <p className="text-xs text-muted-foreground">
                Users requiring attention
              </p>
            </div>
            <div className="flex items-center gap-2">
              {metrics.flaggedUsers > 0 && (
                <Badge variant="destructive" className="animate-pulse">
                  Action Required
                </Badge>
              )}
              <Button variant="outline" size="sm">
                <RefreshCw className="h-3 w-3 mr-1" />
                Refresh
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold">98.5%</div>
              <div className="text-xs text-muted-foreground">Success Rate</div>
            </div>
            <div>
              <div className="text-lg font-semibold">24/7</div>
              <div className="text-xs text-muted-foreground">Uptime</div>
            </div>
            <div>
              <div className="text-lg font-semibold">2.1s</div>
              <div className="text-xs text-muted-foreground">Avg Response</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
