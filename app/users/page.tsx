"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  Users,
  AlertTriangle,
  Clock,
  UserPlus,
  TrendingUp,
  Activity,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { SearchFilters } from "@/components/ui/search-filters";
import { MobileTable } from "@/components/ui/mobile-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddUserModal } from "@/components/modals/add-user-modal";
import { UserModal } from "@/components/modals/user-modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { toast } from "sonner";
import type { User } from "@/lib/types";

// Enhanced mock user data with more diversity
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
  {
    id: "USR-007",
    username: "@support_agent_1",
    platform: "telegram",
    role: "support",
    status: "active",
    kycStatus: "verified",
    totalTrades: 0,
    joinedAt: "2024-01-20",
  },
  {
    id: "USR-008",
    username: "@viewer_analytics",
    platform: "telegram",
    role: "viewer",
    status: "active",
    kycStatus: "not_started",
    totalTrades: 0,
    joinedAt: "2024-02-15",
  },
  {
    id: "USR-009",
    username: "+23489876543",
    platform: "whatsapp",
    role: "support",
    status: "active",
    kycStatus: "verified",
    totalTrades: 0,
    joinedAt: "2024-03-01",
  },
  {
    id: "USR-010",
    username: "@premium_trader",
    platform: "telegram",
    role: "customer",
    status: "active",
    kycStatus: "verified",
    totalTrades: 156,
    joinedAt: "2023-12-10",
  },
  {
    id: "USR-011",
    username: "@viewer_reports",
    platform: "telegram",
    role: "viewer",
    status: "active",
    kycStatus: "not_started",
    totalTrades: 0,
    joinedAt: "2024-02-25",
  },
  {
    id: "USR-012",
    username: "+23485551234",
    platform: "whatsapp",
    role: "customer",
    status: "flagged",
    kycStatus: "pending",
    totalTrades: 7,
    joinedAt: "2024-03-20",
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

// Custom hook for debounced search
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

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
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isExporting, setIsExporting] = useState(false);

  // Debounce search query
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const filteredUsers = useMemo(() => {
    return mockUsers.filter((user) => {
      // Search filter
      if (debouncedSearchQuery) {
        const query = debouncedSearchQuery.toLowerCase();
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
  }, [debouncedSearchQuery, activeFilters]);

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredUsers.slice(startIndex, startIndex + pageSize);
  }, [filteredUsers, currentPage, pageSize]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery, activeFilters, pageSize]);

  const handleFilterChange = useCallback((key: string, value: string) => {
    setActiveFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setActiveFilters({});
    setSearchQuery("");
  }, []);

  const handlePageSizeChange = useCallback((value: string) => {
    setPageSize(Number(value));
  }, []);

  const handleExportUsers = useCallback(async () => {
    setIsExporting(true);
    try {
      // Simulate export process
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Create CSV content
      const headers = [
        "User ID",
        "Username",
        "Platform",
        "Role",
        "Status",
        "KYC Status",
        "Total Trades",
        "Joined At",
      ];
      const csvContent = [
        headers.join(","),
        ...filteredUsers.map((user) =>
          [
            user.id,
            user.username,
            user.platform,
            user.role,
            user.status,
            user.kycStatus,
            user.totalTrades,
            user.joinedAt,
          ].join(",")
        ),
      ].join("\n");

      // Create and download file
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `users_export_${new Date().toISOString().split("T")[0]}.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Export Successful", {
        description: `Exported ${filteredUsers.length} users to CSV file.`,
      });
    } catch (error) {
      toast.error("Export Failed", {
        description: "There was an error exporting the users data.",
      });
    } finally {
      setIsExporting(false);
    }
  }, [filteredUsers]);

  const columns = [
    {
      key: "id",
      label: "USER ID",
      render: (value: string) => (
        <Button
          variant="link"
          className="p-0 h-auto font-mono text-blue-400 text-xs sm:text-sm hover:text-blue-300"
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
                    onClick={handleExportUsers}
                    disabled={isExporting}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {isExporting ? "Exporting..." : "Export Users"}
                  </Button>
                  <Button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-green-600 hover:bg-green-800 text-white cursor-pointer"
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
                      data={paginatedUsers}
                      columns={columns}
                      actions={actions}
                      emptyMessage="No users found matching your criteria"
                    />
                  </div>

                  {/* Pagination Controls */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <span>Results per page:</span>
                      <Select
                        value={pageSize.toString()}
                        onValueChange={handlePageSizeChange}
                      >
                        <SelectTrigger className="w-20 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="25">25</SelectItem>
                          <SelectItem value="50">50</SelectItem>
                          <SelectItem value="100">100</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center gap-4">
                      <div>
                        Showing{" "}
                        {Math.min(
                          (currentPage - 1) * pageSize + 1,
                          filteredUsers.length
                        )}{" "}
                        to{" "}
                        {Math.min(currentPage * pageSize, filteredUsers.length)}{" "}
                        of {filteredUsers.length} users
                      </div>

                      {totalPages > 1 && (
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setCurrentPage((prev) => Math.max(1, prev - 1))
                            }
                            disabled={currentPage === 1}
                            className="h-8 w-8 p-0"
                            aria-label="Previous page"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>

                          <div className="flex items-center gap-1">
                            {Array.from(
                              { length: Math.min(5, totalPages) },
                              (_, i) => {
                                let pageNum;
                                if (totalPages <= 5) {
                                  pageNum = i + 1;
                                } else if (currentPage <= 3) {
                                  pageNum = i + 1;
                                } else if (currentPage >= totalPages - 2) {
                                  pageNum = totalPages - 4 + i;
                                } else {
                                  pageNum = currentPage - 2 + i;
                                }

                                return (
                                  <Button
                                    key={pageNum}
                                    variant={
                                      currentPage === pageNum
                                        ? "default"
                                        : "outline"
                                    }
                                    size="sm"
                                    onClick={() => setCurrentPage(pageNum)}
                                    className="h-8 w-8 p-0"
                                    aria-label={`Page ${pageNum}`}
                                  >
                                    {pageNum}
                                  </Button>
                                );
                              }
                            )}
                          </div>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setCurrentPage((prev) =>
                                Math.min(totalPages, prev + 1)
                              )
                            }
                            disabled={currentPage === totalPages}
                            className="h-8 w-8 p-0"
                            aria-label="Next page"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
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

// "use client";

// import { useState, useMemo } from "react";
// import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
// import { AppSidebar } from "@/components/app-sidebar";
// import { Header } from "@/components/header";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import {
//   Plus,
//   Download,
//   Users,
//   AlertTriangle,
//   Clock,
//   UserPlus,
//   TrendingUp,
//   Activity,
// } from "lucide-react";
// import { SearchFilters } from "@/components/ui/search-filters";
// import { MobileTable } from "@/components/ui/mobile-table";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { AddUserModal } from "@/components/modals/add-user-modal";
// import { UserModal } from "@/components/modals/user-modal";
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbPage,
//   BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb";
// import type { User } from "@/lib/types";
// // import SearchFilters from "@/components/ui/search-filters";

// // Mock user data matching the design
// const mockUsers: User[] = [
//   {
//     id: "USR-001",
//     username: "@cryptotrader_ng",
//     platform: "telegram",
//     role: "customer",
//     status: "active",
//     kycStatus: "verified",
//     totalTrades: 45,
//     joinedAt: "2024-01-15",
//   },
//   {
//     id: "USR-002",
//     username: "+23481234567",
//     platform: "whatsapp",
//     role: "customer",
//     status: "active",
//     kycStatus: "pending",
//     totalTrades: 23,
//     joinedAt: "2024-02-20",
//   },
//   {
//     id: "USR-003",
//     username: "@swiftlify_admin",
//     platform: "telegram",
//     role: "admin",
//     status: "active",
//     kycStatus: "not_started",
//     totalTrades: 0,
//     joinedAt: "2024-03-10",
//   },
//   {
//     id: "USR-004",
//     username: "@suspicioususer",
//     platform: "telegram",
//     role: "customer",
//     status: "flagged",
//     kycStatus: "failed",
//     totalTrades: 12,
//     joinedAt: "2024-01-05",
//   },
//   {
//     id: "USR-005",
//     username: "@newtrader2024",
//     platform: "telegram",
//     role: "customer",
//     status: "active",
//     kycStatus: "pending",
//     totalTrades: 8,
//     joinedAt: "2024-03-15",
//   },
//   {
//     id: "USR-006",
//     username: "+23487654321",
//     platform: "whatsapp",
//     role: "customer",
//     status: "blocked",
//     kycStatus: "failed",
//     totalTrades: 3,
//     joinedAt: "2024-02-28",
//   },
// ];

// const filterOptions = [
//   {
//     key: "platform",
//     label: "All Sources",
//     options: [
//       { value: "telegram", label: "Telegram" },
//       { value: "whatsapp", label: "WhatsApp" },
//     ],
//   },
//   {
//     key: "role",
//     label: "All Roles",
//     options: [
//       { value: "customer", label: "Customer" },
//       { value: "admin", label: "Admin" },
//       { value: "support", label: "Support" },
//       { value: "viewer", label: "Viewer" },
//     ],
//   },
//   {
//     key: "status",
//     label: "All Status",
//     options: [
//       { value: "active", label: "Active" },
//       { value: "blocked", label: "Blocked" },
//       { value: "flagged", label: "Flagged" },
//     ],
//   },
// ];

// export default function UsersPage() {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [activeFilters, setActiveFilters] = useState<Record<string, string>>(
//     {}
//   );
//   const [selectedUser, setSelectedUser] = useState<User | null>(null);
//   const [modalMode, setModalMode] = useState<
//     "view" | "edit" | "block" | "reset"
//   >("view");
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);

//   const filteredUsers = useMemo(() => {
//     return mockUsers.filter((user) => {
//       // Search filter
//       if (searchQuery) {
//         const query = searchQuery.toLowerCase();
//         if (
//           !user.username.toLowerCase().includes(query) &&
//           !user.id.toLowerCase().includes(query)
//         ) {
//           return false;
//         }
//       }

//       // Other filters
//       for (const [key, value] of Object.entries(activeFilters)) {
//         if (value && user[key as keyof User] !== value) {
//           return false;
//         }
//       }

//       return true;
//     });
//   }, [searchQuery, activeFilters]);

//   const handleFilterChange = (key: string, value: string) => {
//     setActiveFilters((prev) => ({
//       ...prev,
//       [key]: value,
//     }));
//   };

//   const handleClearFilters = () => {
//     setActiveFilters({});
//     setSearchQuery("");
//   };

//   const columns = [
//     {
//       key: "id",
//       label: "USER ID",
//       render: (value: string) => (
//         <Button
//           variant="link"
//           className="p-0 h-auto font-mono text-blue-400 text-xs sm:text-sm"
//         >
//           {value}
//         </Button>
//       ),
//     },
//     {
//       key: "username",
//       label: "USERNAME",
//       className: "font-medium text-xs sm:text-sm",
//     },
//     {
//       key: "platform",
//       label: "SOURCE",
//       render: (value: string) => (
//         <Badge
//           variant="outline"
//           className={`text-xs ${
//             value === "telegram" ? "platform-telegram" : "platform-whatsapp"
//           }`}
//         >
//           {value === "telegram" ? "Telegram" : "WhatsApp"}
//         </Badge>
//       ),
//     },
//     {
//       key: "totalTrades",
//       label: "TRADES",
//       className: "font-mono text-xs sm:text-sm",
//     },
//     {
//       key: "status",
//       label: "STATUS",
//       render: (value: string) => (
//         <Badge
//           variant="outline"
//           className={`text-xs ${
//             value === "active"
//               ? "status-active"
//               : value === "flagged"
//               ? "bg-red-500/20 text-red-400 border-red-500/30"
//               : "status-inactive"
//           }`}
//         >
//           {value === "active" && "Active"}
//           {value === "flagged" && "Flagged"}
//           {value === "blocked" && "Blocked"}
//         </Badge>
//       ),
//     },
//     {
//       key: "role",
//       label: "ROLE",
//       render: (value: string) => (
//         <Badge variant="outline" className="capitalize text-xs">
//           {value}
//         </Badge>
//       ),
//     },
//     {
//       key: "kycStatus",
//       label: "KYC",
//       render: (value: string) => (
//         <Badge
//           variant="outline"
//           className={`text-xs ${
//             value === "verified"
//               ? "bg-green-500/20 text-green-400 border-green-500/30"
//               : value === "pending"
//               ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
//               : value === "failed"
//               ? "bg-red-500/20 text-red-400 border-red-500/30"
//               : "bg-gray-500/20 text-gray-400 border-gray-500/30"
//           }`}
//         >
//           {value === "verified" && "✓"}
//           {value === "pending" && "⏳"}
//           {value === "failed" && "✗"}
//           {value === "not_started" && "—"}
//         </Badge>
//       ),
//     },
//   ];

//   const actions = [
//     {
//       label: "View",
//       onClick: (user: User) => {
//         setSelectedUser(user);
//         setModalMode("view");
//         setIsModalOpen(true);
//       },
//     },
//     {
//       label: "Block",
//       onClick: (user: User) => {
//         setSelectedUser(user);
//         setModalMode("block");
//         setIsModalOpen(true);
//       },
//     },
//     {
//       label: "Reset",
//       onClick: (user: User) => {
//         setSelectedUser(user);
//         setModalMode("reset");
//         setIsModalOpen(true);
//       },
//       variant: "destructive" as const,
//     },
//   ];

//   // Statistics
//   const totalUsers = mockUsers.length;
//   const activeUsers = mockUsers.filter((u) => u.status === "active").length;
//   const flaggedUsers = mockUsers.filter((u) => u.status === "flagged").length;
//   const pendingKYC = mockUsers.filter((u) => u.kycStatus === "pending").length;

//   return (
//     <SidebarProvider>
//       <AppSidebar />
//       <SidebarInset className="flex flex-col min-h-screen">
//         <Header />
//         <main className="flex-1 bg-background">
//           <div className="container-padding py-4 md:py-6 lg:py-8 space-y-6">
//             {/* Breadcrumb Navigation */}
//             <div className="flex flex-col space-y-4">
//               <Breadcrumb>
//                 <BreadcrumbList>
//                   <BreadcrumbItem>
//                     <BreadcrumbLink
//                       href="/"
//                       className="text-muted-foreground hover:text-foreground"
//                     >
//                       Dashboard
//                     </BreadcrumbLink>
//                   </BreadcrumbItem>
//                   <BreadcrumbSeparator />
//                   <BreadcrumbItem>
//                     <BreadcrumbPage className="font-medium">
//                       Users Management
//                     </BreadcrumbPage>
//                   </BreadcrumbItem>
//                 </BreadcrumbList>
//               </Breadcrumb>

//               {/* Page Header */}
//               <div className="flex flex-col space-y-2 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
//                 <div className="space-y-1">
//                   <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold font-poppins tracking-tight">
//                     Users Management
//                   </h1>
//                   <p className="text-sm md:text-base text-muted-foreground">
//                     Manage customers, admins, and user permissions across all
//                     platforms
//                   </p>
//                 </div>
//                 <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
//                   <Button
//                     variant="outline"
//                     className="bg-background hover:bg-muted"
//                   >
//                     <Download className="h-4 w-4 mr-2" />
//                     Export Users
//                   </Button>
//                   <Button
//                     onClick={() => setIsAddModalOpen(true)}
//                     className="bg-primary hover:bg-primary/90"
//                   >
//                     <UserPlus className="h-4 w-4 mr-2" />
//                     Add New User
//                   </Button>
//                 </div>
//               </div>
//             </div>

//             {/* Overview Statistics Cards */}
//             <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
//               <Card className="card-enhanced hover:shadow-lg transition-all duration-300">
//                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                   <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
//                     Total Users
//                   </CardTitle>
//                   <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
//                     <Users className="h-4 w-4 text-blue-500" />
//                   </div>
//                 </CardHeader>
//                 <CardContent className="space-y-1">
//                   <div className="text-xl sm:text-2xl font-bold font-poppins">
//                     {totalUsers.toLocaleString()}
//                   </div>
//                   <div className="flex items-center text-xs text-green-500">
//                     <TrendingUp className="h-3 w-3 mr-1" />
//                     <span>+12% from last month</span>
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card className="card-enhanced hover:shadow-lg transition-all duration-300">
//                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                   <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
//                     Active Users
//                   </CardTitle>
//                   <div className="h-8 w-8 rounded-lg bg-green-500/10 flex items-center justify-center">
//                     <Activity className="h-4 w-4 text-green-500" />
//                   </div>
//                 </CardHeader>
//                 <CardContent className="space-y-1">
//                   <div className="text-xl sm:text-2xl font-bold font-poppins">
//                     {activeUsers.toLocaleString()}
//                   </div>
//                   <div className="flex items-center text-xs text-green-500">
//                     <TrendingUp className="h-3 w-3 mr-1" />
//                     <span>+8% from yesterday</span>
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card className="card-enhanced hover:shadow-lg transition-all duration-300">
//                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                   <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
//                     Flagged Users
//                   </CardTitle>
//                   <div className="h-8 w-8 rounded-lg bg-red-500/10 flex items-center justify-center">
//                     <AlertTriangle className="h-4 w-4 text-red-500" />
//                   </div>
//                 </CardHeader>
//                 <CardContent className="space-y-1">
//                   <div className="text-xl sm:text-2xl font-bold font-poppins">
//                     {flaggedUsers}
//                   </div>
//                   <div className="flex items-center text-xs text-red-500">
//                     <AlertTriangle className="h-3 w-3 mr-1" />
//                     <span>Requires attention</span>
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card className="card-enhanced hover:shadow-lg transition-all duration-300">
//                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                   <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
//                     Pending KYC
//                   </CardTitle>
//                   <div className="h-8 w-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
//                     <Clock className="h-4 w-4 text-orange-500" />
//                   </div>
//                 </CardHeader>
//                 <CardContent className="space-y-1">
//                   <div className="text-xl sm:text-2xl font-bold font-poppins">
//                     {pendingKYC}
//                   </div>
//                   <div className="flex items-center text-xs text-orange-500">
//                     <Clock className="h-3 w-3 mr-1" />
//                     <span>Awaiting review</span>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>

//             {/* Users Table Section */}
//             <Card className="card-enhanced shadow-sm">
//               <CardHeader className="border-b border-border/50">
//                 <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
//                   <div className="space-y-1">
//                     <CardTitle className="text-lg sm:text-xl font-poppins">
//                       All Users
//                     </CardTitle>
//                     <p className="text-sm text-muted-foreground">
//                       Manage and monitor all registered users across platforms
//                     </p>
//                   </div>
//                   {/* <div className="flex flex-col sm:flex-row gap-2">
//                     <Button
//                       variant="outline"
//                       className="bg-background hover:bg-muted"
//                     >
//                       <Download className="h-4 w-4 mr-2" />
//                       <span className="hidden sm:inline">Export</span>
//                     </Button>
//                     <Button
//                       onClick={() => setIsAddModalOpen(true)}
//                       className="bg-primary hover:bg-primary/90"
//                     >
//                       <Plus className="h-4 w-4 mr-2" />
//                       <span className="hidden sm:inline">Add User</span>
//                     </Button>
//                   </div> */}
//                 </div>
//               </CardHeader>

//               <CardContent className="p-0">
//                 <div className="p-4 sm:p-6 space-y-4">
//                   <SearchFilters
//                     searchPlaceholder="Search users by ID or username..."
//                     filterOptions={filterOptions}
//                     searchQuery={searchQuery}
//                     onSearchChange={setSearchQuery}
//                     onFilterChange={handleFilterChange}
//                     onClearFilters={handleClearFilters}
//                     activeFilters={activeFilters}
//                   />

//                   <div className="rounded-lg border border-border/50 overflow-hidden">
//                     <MobileTable
//                       data={filteredUsers}
//                       columns={columns}
//                       actions={actions}
//                       emptyMessage="No users found matching your criteria"
//                     />
//                   </div>

//                   <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-muted-foreground">
//                     <div>
//                       Showing {filteredUsers.length} of {totalUsers} users
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <span>Results per page:</span>
//                       <select className="bg-background border border-border rounded px-2 py-1 text-sm">
//                         <option>10</option>
//                         <option>25</option>
//                         <option>50</option>
//                       </select>
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </main>
//       </SidebarInset>

//       <AddUserModal
//         isOpen={isAddModalOpen}
//         onClose={() => setIsAddModalOpen(false)}
//       />
//       <UserModal
//         user={selectedUser}
//         isOpen={isModalOpen}
//         onClose={() => {
//           setIsModalOpen(false);
//           setSelectedUser(null);
//         }}
//         mode={modalMode}
//       />
//     </SidebarProvider>
//   );
// }
