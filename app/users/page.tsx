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
  Shield,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { SearchFilters } from "@/components/ui/search-filters";
import { MobileTable } from "@/components/ui/mobile-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddUserModal } from "@/components/modals/add-user-modal";
import { UserModal } from "@/components/modals/user-modal";
import type { User } from "@/lib/types";

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
        <Button variant="link" className="p-0 h-auto font-mono text-blue-400">
          {value}
        </Button>
      ),
    },
    {
      key: "username",
      label: "USERNAME",
      className: "font-medium",
    },
    {
      key: "platform",
      label: "SOURCE",
      render: (value: string) => (
        <Badge
          variant="outline"
          className={
            value === "telegram" ? "platform-telegram" : "platform-whatsapp"
          }
        >
          {value === "telegram" ? "Telegram" : "WhatsApp"}
        </Badge>
      ),
    },
    {
      key: "totalTrades",
      label: "TOTAL TRADES",
      className: "font-mono",
    },
    {
      key: "status",
      label: "STATUS",
      render: (value: string) => (
        <Badge
          variant="outline"
          className={
            value === "active"
              ? "status-active"
              : value === "flagged"
              ? "bg-red-500/20 text-red-400 border-red-500/30"
              : "status-inactive"
          }
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
        <Badge variant="outline" className="capitalize">
          {value}
        </Badge>
      ),
    },
    {
      key: "kycStatus",
      label: "KYC STATUS",
      render: (value: string) => (
        <Badge
          variant="outline"
          className={
            value === "verified"
              ? "bg-green-500/20 text-green-400 border-green-500/30"
              : value === "pending"
              ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
              : value === "failed"
              ? "bg-red-500/20 text-red-400 border-red-500/30"
              : "bg-gray-500/20 text-gray-400 border-gray-500/30"
          }
        >
          {value === "verified" && "Verified"}
          {value === "pending" && "Pending"}
          {value === "failed" && "Failed"}
          {value === "not_started" && "Not Required"}
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

  const totalUsers = 12847;
  const activeToday = 1247;
  const flaggedUsers = 8;
  const pendingKYC = 156;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <div className="flex flex-1 flex-col gap-6 container-padding pt-0">
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold font-poppins">
                Users Management
              </h1>
              <p className="text-muted-foreground">
                Manage customers, admins, and user permissions
              </p>
            </div>

            {/* Overview Cards */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card className="card-enhanced">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Users
                  </CardTitle>
                  <div className="h-8 w-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <Users className="h-4 w-4 text-blue-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold font-poppins">
                    {totalUsers.toLocaleString()}
                  </div>
                </CardContent>
              </Card>

              <Card className="card-enhanced">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Today
                  </CardTitle>
                  <div className="h-8 w-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <Shield className="h-4 w-4 text-green-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold font-poppins">
                    {activeToday.toLocaleString()}
                  </div>
                </CardContent>
              </Card>

              <Card className="card-enhanced">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Flagged Users
                  </CardTitle>
                  <div className="h-8 w-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                    <AlertTriangle className="h-4 w-4 text-red-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold font-poppins">
                    {flaggedUsers}
                  </div>
                </CardContent>
              </Card>

              <Card className="card-enhanced">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Pending KYC
                  </CardTitle>
                  <div className="h-8 w-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                    <Clock className="h-4 w-4 text-orange-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold font-poppins">
                    {pendingKYC}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Users Table */}
            <Card className="card-enhanced">
              <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <CardTitle className="font-poppins">All Users</CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto bg-transparent"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button
                    onClick={() => setIsAddModalOpen(true)}
                    className="w-full sm:w-auto"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                </div>
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
                  data={filteredUsers}
                  columns={columns}
                  actions={actions}
                  emptyMessage="No users found"
                />

                <div className="text-sm text-muted-foreground">
                  Showing 1 to 4 of 4 results
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
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
