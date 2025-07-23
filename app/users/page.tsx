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
  Users,
  AlertTriangle,
  Clock,
  UserPlus,
  TrendingUp,
  Activity,
} from "lucide-react";
import { SearchFilters } from "@/components/ui/search-filters";
import { MobileTable } from "@/components/ui/mobile-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddUserModal } from "@/components/modals/add-user-modal";
import { UserModal } from "@/components/modals/user-modal";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import type { User } from "@/lib/types";
// import SearchFilters from "@/components/ui/search-filters";

// Mock user data matching the design
const mockUsers: User[] = [
  {
    id: "USR-001",
    username: "@cryptotrader_ng",
    platform: "telegram",
    role: "customer",
    status: "active",
    kycStatus: "verified",
    totalTrades: 45,
    joinedAt: "2024-01-15",
  },
  {
    id: "USR-002",
    username: "+23481234567",
    platform: "whatsapp",
    role: "customer",
    status: "active",
    kycStatus: "pending",
    totalTrades: 23,
    joinedAt: "2024-02-20",
  },
  {
    id: "USR-003",
    username: "@swiftlify_admin",
    platform: "telegram",
    role: "admin",
    status: "active",
    kycStatus: "not_started",
    totalTrades: 0,
    joinedAt: "2024-03-10",
  },
  {
    id: "USR-004",
    username: "@suspicioususer",
    platform: "telegram",
    role: "customer",
    status: "flagged",
    kycStatus: "failed",
    totalTrades: 12,
    joinedAt: "2024-01-05",
  },
  {
    id: "USR-005",
    username: "@newtrader2024",
    platform: "telegram",
    role: "customer",
    status: "active",
    kycStatus: "pending",
    totalTrades: 8,
    joinedAt: "2024-03-15",
  },
  {
    id: "USR-006",
    username: "+23487654321",
    platform: "whatsapp",
    role: "customer",
    status: "blocked",
    kycStatus: "failed",
    totalTrades: 3,
    joinedAt: "2024-02-28",
  },
];

const filterOptions = [
  {
    key: "platform",
    label: "All Sources",
    options: [
      { value: "telegram", label: "Telegram" },
      { value: "whatsapp", label: "WhatsApp" },
    ],
  },
  {
    key: "role",
    label: "All Roles",
    options: [
      { value: "customer", label: "Customer" },
      { value: "admin", label: "Admin" },
      { value: "support", label: "Support" },
      { value: "viewer", label: "Viewer" },
    ],
  },
  {
    key: "status",
    label: "All Status",
    options: [
      { value: "active", label: "Active" },
      { value: "blocked", label: "Blocked" },
      { value: "flagged", label: "Flagged" },
    ],
  },
];

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>(
    {}
  );
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalMode, setModalMode] = useState<
    "view" | "edit" | "block" | "reset"
  >("view");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredUsers = useMemo(() => {
    return mockUsers.filter((user) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !user.username.toLowerCase().includes(query) &&
          !user.id.toLowerCase().includes(query)
        ) {
          return false;
        }
      }

      // Other filters
      for (const [key, value] of Object.entries(activeFilters)) {
        if (value && user[key as keyof User] !== value) {
          return false;
        }
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
      key: "id",
      label: "USER ID",
      render: (value: string) => (
        <Button
          variant="link"
          className="p-0 h-auto font-mono text-blue-400 text-xs sm:text-sm"
        >
          {value}
        </Button>
      ),
    },
    {
      key: "username",
      label: "USERNAME",
      className: "font-medium text-xs sm:text-sm",
    },
    {
      key: "platform",
      label: "SOURCE",
      render: (value: string) => (
        <Badge
          variant="outline"
          className={`text-xs ${
            value === "telegram" ? "platform-telegram" : "platform-whatsapp"
          }`}
        >
          {value === "telegram" ? "Telegram" : "WhatsApp"}
        </Badge>
      ),
    },
    {
      key: "totalTrades",
      label: "TRADES",
      className: "font-mono text-xs sm:text-sm",
    },
    {
      key: "status",
      label: "STATUS",
      render: (value: string) => (
        <Badge
          variant="outline"
          className={`text-xs ${
            value === "active"
              ? "status-active"
              : value === "flagged"
              ? "bg-red-500/20 text-red-400 border-red-500/30"
              : "status-inactive"
          }`}
        >
          {value === "active" && "Active"}
          {value === "flagged" && "Flagged"}
          {value === "blocked" && "Blocked"}
        </Badge>
      ),
    },
    {
      key: "role",
      label: "ROLE",
      render: (value: string) => (
        <Badge variant="outline" className="capitalize text-xs">
          {value}
        </Badge>
      ),
    },
    {
      key: "kycStatus",
      label: "KYC",
      render: (value: string) => (
        <Badge
          variant="outline"
          className={`text-xs ${
            value === "verified"
              ? "bg-green-500/20 text-green-400 border-green-500/30"
              : value === "pending"
              ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
              : value === "failed"
              ? "bg-red-500/20 text-red-400 border-red-500/30"
              : "bg-gray-500/20 text-gray-400 border-gray-500/30"
          }`}
        >
          {value === "verified" && "✓"}
          {value === "pending" && "⏳"}
          {value === "failed" && "✗"}
          {value === "not_started" && "—"}
        </Badge>
      ),
    },
  ];

  const actions = [
    {
      label: "View",
      onClick: (user: User) => {
        setSelectedUser(user);
        setModalMode("view");
        setIsModalOpen(true);
      },
    },
    {
      label: "Block",
      onClick: (user: User) => {
        setSelectedUser(user);
        setModalMode("block");
        setIsModalOpen(true);
      },
    },
    {
      label: "Reset",
      onClick: (user: User) => {
        setSelectedUser(user);
        setModalMode("reset");
        setIsModalOpen(true);
      },
      variant: "destructive" as const,
    },
  ];

  // Statistics
  const totalUsers = mockUsers.length;
  const activeUsers = mockUsers.filter((u) => u.status === "active").length;
  const flaggedUsers = mockUsers.filter((u) => u.status === "flagged").length;
  const pendingKYC = mockUsers.filter((u) => u.kycStatus === "pending").length;

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
                      Users Management
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>

              {/* Page Header */}
              <div className="flex flex-col space-y-2 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
                <div className="space-y-1">
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold font-poppins tracking-tight">
                    Users Management
                  </h1>
                  <p className="text-sm md:text-base text-muted-foreground">
                    Manage customers, admins, and user permissions across all
                    platforms
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <Button
                    variant="outline"
                    className="bg-background hover:bg-muted"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Users
                  </Button>
                  <Button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add New User
                  </Button>
                </div>
              </div>
            </div>

            {/* Overview Statistics Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
              <Card className="card-enhanced hover:shadow-lg transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                    Total Users
                  </CardTitle>
                  <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <Users className="h-4 w-4 text-blue-500" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-1">
                  <div className="text-xl sm:text-2xl font-bold font-poppins">
                    {totalUsers.toLocaleString()}
                  </div>
                  <div className="flex items-center text-xs text-green-500">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    <span>+12% from last month</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-enhanced hover:shadow-lg transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                    Active Users
                  </CardTitle>
                  <div className="h-8 w-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <Activity className="h-4 w-4 text-green-500" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-1">
                  <div className="text-xl sm:text-2xl font-bold font-poppins">
                    {activeUsers.toLocaleString()}
                  </div>
                  <div className="flex items-center text-xs text-green-500">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    <span>+8% from yesterday</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-enhanced hover:shadow-lg transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                    Flagged Users
                  </CardTitle>
                  <div className="h-8 w-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-1">
                  <div className="text-xl sm:text-2xl font-bold font-poppins">
                    {flaggedUsers}
                  </div>
                  <div className="flex items-center text-xs text-red-500">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    <span>Requires attention</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-enhanced hover:shadow-lg transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                    Pending KYC
                  </CardTitle>
                  <div className="h-8 w-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                    <Clock className="h-4 w-4 text-orange-500" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-1">
                  <div className="text-xl sm:text-2xl font-bold font-poppins">
                    {pendingKYC}
                  </div>
                  <div className="flex items-center text-xs text-orange-500">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>Awaiting review</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Users Table Section */}
            <Card className="card-enhanced shadow-sm">
              <CardHeader className="border-b border-border/50">
                <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
                  <div className="space-y-1">
                    <CardTitle className="text-lg sm:text-xl font-poppins">
                      All Users
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Manage and monitor all registered users across platforms
                    </p>
                  </div>
                  {/* <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      variant="outline"
                      className="bg-background hover:bg-muted"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Export</span>
                    </Button>
                    <Button
                      onClick={() => setIsAddModalOpen(true)}
                      className="bg-primary hover:bg-primary/90"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Add User</span>
                    </Button>
                  </div> */}
                </div>
              </CardHeader>

              <CardContent className="p-0">
                <div className="p-4 sm:p-6 space-y-4">
                  <SearchFilters
                    searchPlaceholder="Search users by ID or username..."
                    filterOptions={filterOptions}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    onFilterChange={handleFilterChange}
                    onClearFilters={handleClearFilters}
                    activeFilters={activeFilters}
                  />

                  <div className="rounded-lg border border-border/50 overflow-hidden">
                    <MobileTable
                      data={filteredUsers}
                      columns={columns}
                      actions={actions}
                      emptyMessage="No users found matching your criteria"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-muted-foreground">
                    <div>
                      Showing {filteredUsers.length} of {totalUsers} users
                    </div>
                    <div className="flex items-center gap-2">
                      <span>Results per page:</span>
                      <select className="bg-background border border-border rounded px-2 py-1 text-sm">
                        <option>10</option>
                        <option>25</option>
                        <option>50</option>
                      </select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </SidebarInset>

      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
      <UserModal
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedUser(null);
        }}
        mode={modalMode}
      />
    </SidebarProvider>
  );
}
