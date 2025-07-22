"use client";

import { useState, useEffect } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RateTicker } from "@/components/dashboard/rate-ticker";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Users,
  ArrowLeftRight,
  DollarSign,
  Clock,
  AlertTriangle,
  Activity,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

// Mock data matching the design
const dashboardMetrics = {
  totalUsers: 12847,
  userGrowth: 12,
  activeTradesToday: 73,
  tradesGrowth: 8,
  successfulPayouts: 45200000, // ₦45.2M
  payoutsGrowth: 15,
  avgTradeTime: "12.5 min",
  timeImprovement: -3,
  flaggedUsers: 8,
  flaggedChange: 2,
  systemUptime: 99.9,
};

// Mock chart data for daily trades
const dailyTradesData = [
  { day: "Mon", trades: 45, volume: 12500000 },
  { day: "Tue", trades: 52, volume: 15200000 },
  { day: "Wed", trades: 38, volume: 9800000 },
  { day: "Thu", trades: 61, volume: 18300000 },
  { day: "Fri", trades: 73, volume: 22100000 },
  { day: "Sat", trades: 67, volume: 19800000 },
  { day: "Sun", trades: 41, volume: 11200000 },
];

// Mock data for platform distribution
const platformData = [
  { name: "Telegram", value: 65, color: "#3b82f6" },
  { name: "WhatsApp", value: 35, color: "#10b981" },
];

export default function DashboardPage() {
  const [isLive, setIsLive] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

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
    if (growth > 0) return "text-green-400";
    if (growth < 0) return "text-red-400";
    return "text-muted-foreground";
  };

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) return <TrendingUp className="h-3 w-3" />;
    if (growth < 0) return <TrendingDown className="h-3 w-3" />;
    return null;
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="fixed-header-layout">
        <Header />
        <div className="scrollable-content flex flex-1 flex-col gap-6 container-padding">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="heading-responsive font-bold font-poppins">
                Dashboard Overview
              </h1>
              <p className="text-responsive text-muted-foreground">
                Monitor your platform's performance and key metrics
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </span>
              <div className="flex items-center gap-1">
                <div
                  className={`h-2 w-2 rounded-full ${
                    isLive ? "bg-green-500 animate-pulse" : "bg-gray-500"
                  }`}
                ></div>
                <Badge
                  variant={isLive ? "default" : "secondary"}
                  className="text-xs"
                >
                  {isLive ? "Live" : "Offline"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Metrics Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {/* Total Users */}
            <Card className="card-enhanced">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Users
                </CardTitle>
                <Users className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-poppins">
                  {dashboardMetrics.totalUsers.toLocaleString()}
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <div
                    className={`flex items-center gap-1 ${getGrowthColor(
                      dashboardMetrics.userGrowth
                    )}`}
                  >
                    {getGrowthIcon(dashboardMetrics.userGrowth)}
                    <span>+{dashboardMetrics.userGrowth}%</span>
                  </div>
                  <span className="text-muted-foreground">from last month</span>
                </div>
              </CardContent>
            </Card>

            {/* Active Trades Today */}
            <Card className="card-enhanced">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Trades Today
                </CardTitle>
                <ArrowLeftRight className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-poppins">
                  {dashboardMetrics.activeTradesToday}
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <div
                    className={`flex items-center gap-1 ${getGrowthColor(
                      dashboardMetrics.tradesGrowth
                    )}`}
                  >
                    {getGrowthIcon(dashboardMetrics.tradesGrowth)}
                    <span>+{dashboardMetrics.tradesGrowth}%</span>
                  </div>
                  <span className="text-muted-foreground">from yesterday</span>
                </div>
              </CardContent>
            </Card>

            {/* Successful Payouts */}
            <Card className="card-enhanced">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Successful Payouts
                </CardTitle>
                <DollarSign className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-poppins">
                  {formatCurrency(dashboardMetrics.successfulPayouts)}
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <div
                    className={`flex items-center gap-1 ${getGrowthColor(
                      dashboardMetrics.payoutsGrowth
                    )}`}
                  >
                    {getGrowthIcon(dashboardMetrics.payoutsGrowth)}
                    <span>+{dashboardMetrics.payoutsGrowth}%</span>
                  </div>
                  <span className="text-muted-foreground">from yesterday</span>
                </div>
              </CardContent>
            </Card>

            {/* Avg Trade Time */}
            <Card className="card-enhanced">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Avg. Trade Time
                </CardTitle>
                <Clock className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-poppins">
                  {dashboardMetrics.avgTradeTime}
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <div
                    className={`flex items-center gap-1 ${getGrowthColor(
                      dashboardMetrics.timeImprovement
                    )}`}
                  >
                    {getGrowthIcon(dashboardMetrics.timeImprovement)}
                    <span>{dashboardMetrics.timeImprovement} min</span>
                  </div>
                  <span className="text-muted-foreground">from last week</span>
                </div>
              </CardContent>
            </Card>

            {/* Flagged Users */}
            <Card className="card-enhanced">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Flagged Users
                </CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-poppins">
                  {dashboardMetrics.flaggedUsers}
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <div className="flex items-center gap-1 text-red-400">
                    <TrendingUp className="h-3 w-3" />
                    <span>+{dashboardMetrics.flaggedChange}</span>
                  </div>
                  <span className="text-muted-foreground">from yesterday</span>
                </div>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card className="card-enhanced">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  System Status
                </CardTitle>
                <Activity className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-poppins">
                  {dashboardMetrics.systemUptime}%
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <div className="flex items-center gap-1 text-green-400">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span>Uptime this month</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts and Activity Section */}
          <div className="grid gap-6 lg:grid-cols-4">
            {/* Daily Trades Chart */}
            <Card className="card-enhanced lg:col-span-2">
              <CardHeader>
                <CardTitle className="font-poppins">
                  Daily Trades (Last 7 Days)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    trades: {
                      label: "Trades",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dailyTradesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line
                        type="monotone"
                        dataKey="trades"
                        stroke="var(--color-trades)"
                        strokeWidth={3}
                        name="Daily Trades"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Platform Distribution Pie Chart */}
            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle className="font-poppins">Trade Source</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="w-full max-w-[200px] h-[200px] mb-4">
                  <ChartContainer
                    config={{
                      telegram: {
                        label: "Telegram",
                        color: "#3b82f6",
                      },
                      whatsapp: {
                        label: "WhatsApp",
                        color: "#10b981",
                      },
                    }}
                    className="w-full h-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={platformData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {platformData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
                <div className="space-y-2 w-full">
                  {platformData.map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span className="text-sm">{item.name}</span>
                      </div>
                      <span className="text-sm font-medium">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle className="font-poppins">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <RecentActivity />
              </CardContent>
            </Card>
          </div>

          {/* Live Rate Ticker */}
          <RateTicker />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
