"use client";

import { useState, useMemo } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Shield, UserCheck, Clock } from "lucide-react";
import { SearchFilters } from "@/components/ui/search-filters";
import { MobileTable } from "@/components/ui/mobile-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddAdminModal } from "@/components/modals/add-admin-modal";

interface Admin {
  readonly id: string;
  username: string;
  role: "Owner" | "Admin" | "Support" | "Viewer";
  permissions: string[];
  status: "Active" | "Suspended";
  readonly created: string;
  lastLogin?: string;
  createdBy: string;
}

// Mock admin data matching the design
const mockAdmins: Admin[] = [
  {
    id: "1",
    username: "super_admin",
    role: "Owner",
    permissions: ["All Modules"],
    status: "Active",
    created: "2024-11-01",
    lastLogin: "2025-01-08 14:30:22",
    createdBy: "System",
  },
  {
    id: "2",
    username: "trade_manager",
    role: "Admin",
    permissions: ["Trades", "Users", "+1 more"],
    status: "Active",
    created: "2024-12-15",
    lastLogin: "2025-01-08 09:45:10",
    createdBy: "super_admin",
  },
  {
    id: "3",
    username: "support_agent",
    role: "Support",
    permissions: ["Support & Alerts", "Users (View Only)"],
    status: "Active",
    created: "2025-01-02",
    lastLogin: "2025-01-08 13:22:15",
    createdBy: "super_admin",
  },
  {
    id: "4",
    username: "viewer_john",
    role: "Viewer",
    permissions: ["Dashboard (View Only)", "System Logs (View Only)"],
    status: "Suspended",
    created: "2025-01-05",
    lastLogin: "2025-01-07 16:20:30",
    createdBy: "trade_manager",
  },
];

const filterOptions = [
  {
    key: "role",
    label: "All Roles",
    options: [
      { value: "Owner", label: "Owner" },
      { value: "Admin", label: "Admin" },
      { value: "Support", label: "Support" },
      { value: "Viewer", label: "Viewer" },
    ],
  },
  {
    key: "status",
    label: "All Status",
    options: [
      { value: "Active", label: "Active" },
      { value: "Suspended", label: "Suspended" },
    ],
  },
];

export default function AdminsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>(
    {}
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredAdmins = useMemo(() => {
    return mockAdmins.filter((admin) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!admin.username.toLowerCase().includes(query)) {
          return false;
        }
      }

      // Role filter
      if (activeFilters.role && admin.role !== activeFilters.role) {
        return false;
      }

      // Status filter
      if (activeFilters.status && admin.status !== activeFilters.status) {
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

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Owner":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "Admin":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "Support":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "Viewer":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const columns = [
    {
      key: "username",
      label: "USERNAME",
      className: "font-medium",
    },
    {
      key: "role",
      label: "ROLE",
      render: (value: string) => (
        <Badge variant="outline" className={getRoleColor(value)}>
          {value}
        </Badge>
      ),
    },
    {
      key: "permissions",
      label: "PERMISSIONS",
      render: (permissions: string[]) => (
        <div className="flex flex-wrap gap-1">
          {permissions.map((permission, index) => (
            <Badge
              key={index}
              variant="outline"
              className="text-xs bg-green-500/20 text-green-400 border-green-500/30"
            >
              {permission}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      key: "status",
      label: "STATUS",
      render: (value: string) => (
        <Badge
          variant="outline"
          className={value === "Active" ? "status-active" : "status-inactive"}
        >
          {value}
        </Badge>
      ),
    },
    {
      key: "created",
      label: "CREATED",
      className: "text-muted-foreground text-sm",
    },
    {
      key: "lastLogin",
      label: "LAST LOGIN",
      render: (value?: string) => (
        <span className="text-muted-foreground text-sm">
          {value || "Never"}
        </span>
      ),
    },
    {
      key: "createdBy",
      label: "CREATED BY",
      className: "text-muted-foreground text-sm",
    },
  ];

  const actions = [
    { label: "View", onClick: (admin: Admin) => console.log("View", admin.id) },
    { label: "Edit", onClick: (admin: Admin) => console.log("Edit", admin.id) },
    {
      label: "Suspend",
      onClick: (admin: Admin) => console.log("Suspend", admin.id),
      variant: "destructive" as const,
    },
  ];

  const totalAdmins = 4;
  const activeAdmins = 3;
  const superAdmins = 1;
  const pendingRequests = 2;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <div className="flex flex-1 flex-col gap-6 container-padding pt-0">
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold font-poppins">
                Admin Management
              </h1>
              <p className="text-muted-foreground">
                Manage admin accounts and permissions
              </p>
            </div>

            {/* Overview Cards */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card className="card-enhanced">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Admins
                  </CardTitle>
                  <div className="h-8 w-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <UserCheck className="h-4 w-4 text-purple-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold font-poppins">
                    {totalAdmins}
                  </div>
                </CardContent>
              </Card>

              <Card className="card-enhanced">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Admins
                  </CardTitle>
                  <div className="h-8 w-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <UserCheck className="h-4 w-4 text-green-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold font-poppins">
                    {activeAdmins}
                  </div>
                </CardContent>
              </Card>

              <Card className="card-enhanced">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Super Admins
                  </CardTitle>
                  <div className="h-8 w-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                    <Shield className="h-4 w-4 text-red-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold font-poppins">
                    {superAdmins}
                  </div>
                </CardContent>
              </Card>

              <Card className="card-enhanced">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Pending Requests
                  </CardTitle>
                  <div className="h-8 w-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                    <Clock className="h-4 w-4 text-orange-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold font-poppins">
                    {pendingRequests}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Admin Accounts Table */}
            <Card className="card-enhanced">
              <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <CardTitle className="font-poppins">Admin Accounts</CardTitle>
                <Button
                  onClick={() => setIsAddModalOpen(true)}
                  className="w-full sm:w-auto"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Admin
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
                  data={filteredAdmins}
                  columns={columns}
                  actions={actions}
                  emptyMessage="No administrators found"
                />

                <div className="text-sm text-muted-foreground">
                  Showing 1 to 4 of 4 results
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>

      <AddAdminModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </SidebarProvider>
  );
}
