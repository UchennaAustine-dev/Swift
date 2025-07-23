"use client";

import { useState, useEffect } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

// Mock recent activity data
const recentActivityData = [
  {
    id: 1,
    user: "John D.",
    action: "Completed trade",
    amount: "₦250,000",
    time: "2 min ago",
    type: "success",
  },
  {
    id: 2,
    user: "Sarah M.",
    action: "Started trade",
    amount: "₦180,000",
    time: "5 min ago",
    type: "pending",
  },
  {
    id: 3,
    user: "Mike R.",
    action: "Trade flagged",
    amount: "₦500,000",
    time: "8 min ago",
    type: "warning",
  },
  {
    id: 4,
    user: "Lisa K.",
    action: "Completed trade",
    amount: "₦75,000",
    time: "12 min ago",
    type: "success",
  },
  {
    id: 5,
    user: "David L.",
    action: "Verification required",
    amount: "₦320,000",
    time: "15 min ago",
    type: "warning",
  },
];

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border rounded-lg shadow-lg p-3">
        <p className="text-sm font-medium">{`${label}`}</p>
        <p className="text-sm text-blue-600 dark:text-blue-400">{`Trades: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

// Custom Pie Tooltip
const PieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border rounded-lg shadow-lg p-2">
        <p className="text-sm font-medium">{`${payload[0].name}: ${payload[0].value}%`}</p>
      </div>
    );
  }
  return null;
};

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
    if (growth > 0) return "text-green-500";
    if (growth < 0) return "text-red-500";
    return "text-muted-foreground";
  };

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) return <TrendingUp className="h-3 w-3" />;
    if (growth < 0) return <TrendingDown className="h-3 w-3" />;
    return null;
  };

  const getActivityTypeColor = (type: any) => {
    switch (type) {
      case "success":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "warning":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "pending":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 bg-background">
          <div className="container-padding py-4 md:py-6 lg:py-8 space-y-4 md:space-y-6">
            {/* Header Section */}
            <div className="flex flex-col space-y-3 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
              <div className="space-y-1">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold font-poppins">
                  Dashboard Overview
                </h1>
                <p className="text-sm md:text-base text-muted-foreground">
                  Monitor your platform's performance and key metrics
                </p>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <span className="text-xs sm:text-sm text-muted-foreground">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </span>
                <div className="flex items-center gap-2">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      isLive ? "bg-green-500 animate-pulse" : "bg-gray-500"
                    }`}
                  />
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
            <div className="responsive-grid-6">
              {/* Total Users */}
              <Card className="card-enhanced">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium">
                    Total Users
                  </CardTitle>
                  <Users className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent className="space-y-1">
                  <div className="text-xl sm:text-2xl font-bold">
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
                    <span className="text-muted-foreground">
                      from last month
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Active Trades Today */}
              <Card className="card-enhanced">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium">
                    Active Trades Today
                  </CardTitle>
                  <ArrowLeftRight className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent className="space-y-1">
                  <div className="text-xl sm:text-2xl font-bold">
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
                    <span className="text-muted-foreground">
                      from yesterday
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Successful Payouts */}
              <Card className="card-enhanced">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium">
                    Successful Payouts
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-purple-500" />
                </CardHeader>
                <CardContent className="space-y-1">
                  <div className="text-xl sm:text-2xl font-bold">
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
                    <span className="text-muted-foreground">
                      from yesterday
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Avg Trade Time */}
              <Card className="card-enhanced">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium">
                    Avg. Trade Time
                  </CardTitle>
                  <Clock className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent className="space-y-1">
                  <div className="text-xl sm:text-2xl font-bold">
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
                    <span className="text-muted-foreground">
                      from last week
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Flagged Users */}
              <Card className="card-enhanced">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium">
                    Flagged Users
                  </CardTitle>
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent className="space-y-1">
                  <div className="text-xl sm:text-2xl font-bold">
                    {dashboardMetrics.flaggedUsers}
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <div className="flex items-center gap-1 text-red-500">
                      <TrendingUp className="h-3 w-3" />
                      <span>+{dashboardMetrics.flaggedChange}</span>
                    </div>
                    <span className="text-muted-foreground">
                      from yesterday
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* System Status */}
              <Card className="card-enhanced">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium">
                    System Status
                  </CardTitle>
                  <Activity className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent className="space-y-1">
                  <div className="text-xl sm:text-2xl font-bold">
                    {dashboardMetrics.systemUptime}%
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <div className="flex items-center gap-1 text-green-500">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <span>Uptime this month</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts and Activity Section */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
              {/* Daily Trades Chart */}
              <Card className="lg:col-span-2 card-enhanced">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base sm:text-lg font-semibold font-poppins">
                    Daily Trades (Last 7 Days)
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="chart-container-responsive">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={dailyTradesData}
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
                          dataKey="day"
                          tick={{ fontSize: 12 }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          tick={{ fontSize: 12 }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <CustomTooltip />
                        <Line
                          type="monotone"
                          dataKey="trades"
                          stroke="#3b82f6"
                          strokeWidth={3}
                          dot={{ r: 4, fill: "#3b82f6" }}
                          activeDot={{ r: 6, fill: "#1d4ed8" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Platform Distribution Pie Chart */}
              <Card className="card-enhanced">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base sm:text-lg font-semibold font-poppins">
                    Trade Source
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-full h-[160px] sm:h-[180px] md:h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={platformData}
                            cx="50%"
                            cy="50%"
                            innerRadius={30}
                            outerRadius={60}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {platformData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <PieTooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="w-full space-y-2">
                      {platformData.map((item) => (
                        <div
                          key={item.name}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: item.color }}
                            />
                            <span className="text-sm">{item.name}</span>
                          </div>
                          <span className="text-sm font-medium">
                            {item.value}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="card-enhanced">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base sm:text-lg font-semibold font-poppins">
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="space-y-3 max-h-[300px] overflow-y-auto scrollbar-thin">
                    {recentActivityData.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-start justify-between gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium truncate">
                              {activity.user}
                            </span>
                            <Badge
                              className={`text-xs px-1.5 py-0.5 ${getActivityTypeColor(
                                activity.type
                              )}`}
                            >
                              {activity.type}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {activity.action}
                          </p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs font-medium">
                              {activity.amount}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {activity.time}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Live Rate Ticker */}
            <Card className="card-enhanced">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base sm:text-lg font-semibold font-poppins flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                    Live Exchange Rates
                  </CardTitle>
                  <Badge
                    variant="secondary"
                    className="text-xs bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                  >
                    LIVE
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* BTC/NGN */}
                  <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/10 dark:to-orange-800/10 border border-orange-200 dark:border-orange-800/30">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-orange-500 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">₿</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">
                          BTC/NGN
                        </div>
                        <div className="text-lg sm:text-xl font-bold">
                          ₦65,420,000
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-green-500">
                        <TrendingUp className="h-3 w-3" />
                        <span className="text-sm font-medium">+2.5%</span>
                      </div>
                      <div className="text-xs text-muted-foreground">24h</div>
                    </div>
                  </div>

                  {/* ETH/NGN */}
                  <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/10 dark:to-blue-800/10 border border-blue-200 dark:border-blue-800/30">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">Ξ</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">
                          ETH/NGN
                        </div>
                        <div className="text-lg sm:text-xl font-bold">
                          ₦4,250,000
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-green-500">
                        <TrendingUp className="h-3 w-3" />
                        <span className="text-sm font-medium">+1.8%</span>
                      </div>
                      <div className="text-xs text-muted-foreground">24h</div>
                    </div>
                  </div>

                  {/* USDT/NGN */}
                  <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/10 dark:to-green-800/10 border border-green-200 dark:border-green-800/30 sm:col-span-2 lg:col-span-1">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center">
                        <span className="text-white font-bold text-xs">₮</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">
                          USDT/NGN
                        </div>
                        <div className="text-lg sm:text-xl font-bold">
                          ₦1,580
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-red-500">
                        <TrendingDown className="h-3 w-3" />
                        <span className="text-sm font-medium">-0.3%</span>
                      </div>
                      <div className="text-xs text-muted-foreground">24h</div>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                      <span>
                        Last updated: {lastUpdated.toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span>Market Cap: ₦2.1T</span>
                      <span>24h Volume: ₦450B</span>
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
