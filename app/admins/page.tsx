"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Plus,
  Shield,
  UserCheck,
  Clock,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit,
  UserX,
} from "lucide-react";
import { SearchFilters } from "@/components/ui/search-filters";
import { MobileTable } from "@/components/ui/mobile-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddAdminModal } from "@/components/modals/add-admin-modal";
import { ViewAdminModal } from "@/components/modals/view-admin-modal";
import { EditAdminModal } from "@/components/modals/edit-admin-modal";
import { ExportDropdown } from "@/components/ui/export-dropdown";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { toast } from "sonner";
import { formatDistanceToNow, format } from "date-fns";

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

// Enhanced mock admin data
const mockAdmins: Admin[] = [
  {
    id: "1",
    username: "super_admin",
    role: "Owner",
    permissions: ["All Modules"],
    status: "Active",
    created: "2024-11-01T10:00:00Z",
    lastLogin: "2025-01-08T14:30:22Z",
    createdBy: "System",
  },
  {
    id: "2",
    username: "trade_manager",
    role: "Admin",
    permissions: ["Trades", "Users", "Analytics"],
    status: "Active",
    created: "2024-12-15T09:15:00Z",
    lastLogin: "2025-01-08T09:45:10Z",
    createdBy: "super_admin",
  },
  {
    id: "3",
    username: "support_agent",
    role: "Support",
    permissions: ["Support & Alerts", "Users (View Only)"],
    status: "Active",
    created: "2025-01-02T14:20:00Z",
    lastLogin: "2025-01-08T13:22:15Z",
    createdBy: "super_admin",
  },
  {
    id: "4",
    username: "viewer_john",
    role: "Viewer",
    permissions: ["Dashboard (View Only)", "System Logs (View Only)"],
    status: "Suspended",
    created: "2025-01-05T11:30:00Z",
    lastLogin: "2025-01-07T16:20:30Z",
    createdBy: "trade_manager",
  },
  {
    id: "5",
    username: "api_manager",
    role: "Admin",
    permissions: ["API Management", "Rate Management", "Users"],
    status: "Active",
    created: "2024-12-20T16:45:00Z",
    lastLogin: "2025-01-08T11:15:45Z",
    createdBy: "super_admin",
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

// Custom hook for debounced search
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

// Loading skeleton component
const TableSkeleton = () => (
  <div className="space-y-4">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="flex items-center space-x-4 p-4">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[150px]" />
        </div>
        <Skeleton className="h-8 w-[100px]" />
        <Skeleton className="h-8 w-[80px]" />
      </div>
    ))}
  </div>
);

export default function AdminsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>(
    {}
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [admins, setAdmins] = useState<Admin[]>(mockAdmins);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [suspendDialog, setSuspendDialog] = useState<{
    isOpen: boolean;
    admin: Admin | null;
  }>({
    isOpen: false,
    admin: null,
  });
  const [dateRange, setDateRange] = useState<{ from: string; to: string }>({
    from: "",
    to: "",
  });

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Simulate initial loading
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const filteredAdmins = useMemo(() => {
    return admins.filter((admin) => {
      // Search filter
      if (debouncedSearchQuery) {
        const query = debouncedSearchQuery.toLowerCase();
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
  }, [debouncedSearchQuery, activeFilters, admins]);

  // Pagination logic
  const totalPages = Math.ceil(filteredAdmins.length / pageSize);
  const paginatedAdmins = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredAdmins.slice(startIndex, startIndex + pageSize);
  }, [filteredAdmins, currentPage, pageSize]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery, activeFilters, pageSize]);

  const handleFilterChange = useCallback((key: string, value: string) => {
    setActiveFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setActiveFilters({});
    setSearchQuery("");
  }, []);

  const handlePageSizeChange = useCallback((value: string) => {
    setPageSize(Number(value));
  }, []);

  // Prepare export data with proper formatting
  const exportData = useMemo(() => {
    return filteredAdmins.map((admin) => ({
      Username: admin.username,
      Role: admin.role,
      Status: admin.status,
      Permissions: admin.permissions.join(", "),
      Created: format(new Date(admin.created), "yyyy-MM-dd HH:mm:ss"),
      "Last Login": admin.lastLogin
        ? format(new Date(admin.lastLogin), "yyyy-MM-dd HH:mm:ss")
        : "Never",
      "Created By": admin.createdBy,
    }));
  }, [filteredAdmins]);

  const handleAddAdmin = useCallback(
    (newAdmin: Omit<Admin, "id" | "created">) => {
      const adminWithId = {
        ...newAdmin,
        id: Date.now().toString(),
        created: new Date().toISOString(),
      };
      setAdmins((prev) => [...prev, adminWithId]);
      toast.success("Admin Added", {
        description: `${newAdmin.username} has been added successfully.`,
      });
    },
    []
  );

  const handleViewAdmin = useCallback((admin: Admin) => {
    setSelectedAdmin(admin);
    setIsViewModalOpen(true);
  }, []);

  const handleEditAdmin = useCallback((admin: Admin) => {
    setSelectedAdmin(admin);
    setIsEditModalOpen(true);
  }, []);

  const handleUpdateAdmin = useCallback((updatedAdmin: Admin) => {
    setAdmins((prev) =>
      prev.map((admin) => (admin.id === updatedAdmin.id ? updatedAdmin : admin))
    );
    toast.success("Admin Updated", {
      description: `${updatedAdmin.username} has been updated successfully.`,
    });
  }, []);

  const handleSuspendAdmin = useCallback(async (admin: Admin) => {
    const newStatus = admin.status === "Active" ? "Suspended" : "Active";
    try {
      setAdmins((prev) =>
        prev.map((a) => (a.id === admin.id ? { ...a, status: newStatus } : a))
      );
      toast.success("Status Updated", {
        description: `${admin.username} has been ${newStatus.toLowerCase()}.`,
      });
    } catch (error) {
      toast.error("Update Failed", {
        description: "Unable to update admin status.",
      });
    } finally {
      setSuspendDialog({ isOpen: false, admin: null });
    }
  }, []);

  const handleDateRangeChange = (range: { from: string; to: string }) => {
    setDateRange(range);
    setCurrentPage(1);
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
          {permissions.slice(0, 2).map((permission, index) => (
            <Badge
              key={index}
              variant="outline"
              className="text-xs bg-green-500/20 text-green-400 border-green-500/30"
            >
              {permission}
            </Badge>
          ))}
          {permissions.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{permissions.length - 2}
            </Badge>
          )}
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
      render: (value: string) => (
        <div className="text-sm">
          <div className="text-muted-foreground">
            {formatDistanceToNow(new Date(value), { addSuffix: true })}
          </div>
          <div className="text-xs text-muted-foreground">
            {format(new Date(value), "MMM d, yyyy")}
          </div>
        </div>
      ),
    },
    {
      key: "lastLogin",
      label: "LAST LOGIN",
      render: (value?: string) => (
        <div className="text-sm">
          {value ? (
            <>
              <div className="text-muted-foreground">
                {formatDistanceToNow(new Date(value), { addSuffix: true })}
              </div>
              <div className="text-xs text-muted-foreground">
                {format(new Date(value), "MMM d, HH:mm")}
              </div>
            </>
          ) : (
            <span className="text-muted-foreground">Never</span>
          )}
        </div>
      ),
    },
    {
      key: "createdBy",
      label: "CREATED BY",
      className: "text-muted-foreground text-sm",
    },
  ];

  const actions = [
    {
      label: "View",
      onClick: handleViewAdmin,
      icon: Eye,
    },
    {
      label: "Edit",
      onClick: handleEditAdmin,
      icon: Edit,
    },
    {
      label: "Suspend",
      onClick: (admin: Admin) => setSuspendDialog({ isOpen: true, admin }),
      variant: "destructive" as const,
      icon: UserX,
    },
  ];

  // Mobile card render
  const mobileCardRender = (admin: Admin) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="font-medium">{admin.username}</div>
        <Badge
          variant="outline"
          className={
            admin.status === "Active" ? "status-active" : "status-inactive"
          }
        >
          {admin.status}
        </Badge>
      </div>

      <div className="flex items-center gap-2">
        <Badge variant="outline" className={getRoleColor(admin.role)}>
          {admin.role}
        </Badge>
      </div>

      <div>
        <span className="text-muted-foreground text-sm">Permissions:</span>
        <div className="flex flex-wrap gap-1 mt-1">
          {admin.permissions.slice(0, 3).map((permission, index) => (
            <Badge
              key={index}
              variant="outline"
              className="text-xs bg-green-500/20 text-green-400 border-green-500/30"
            >
              {permission}
            </Badge>
          ))}
          {admin.permissions.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{admin.permissions.length - 3}
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-muted-foreground">Created:</span>
          <div className="mt-1">
            <div className="text-muted-foreground">
              {formatDistanceToNow(new Date(admin.created), {
                addSuffix: true,
              })}
            </div>
          </div>
        </div>
        <div>
          <span className="text-muted-foreground">Last Login:</span>
          <div className="mt-1">
            {admin.lastLogin ? (
              <div className="text-muted-foreground">
                {formatDistanceToNow(new Date(admin.lastLogin), {
                  addSuffix: true,
                })}
              </div>
            ) : (
              <span className="text-muted-foreground">Never</span>
            )}
          </div>
        </div>
      </div>

      <div className="text-sm">
        <span className="text-muted-foreground">Created by:</span>
        <div className="mt-1 text-muted-foreground">{admin.createdBy}</div>
      </div>
    </div>
  );

  // Statistics
  const totalAdmins = admins.length;
  const activeAdmins = admins.filter(
    (admin) => admin.status === "Active"
  ).length;
  const superAdmins = admins.filter((admin) => admin.role === "Owner").length;
  const pendingRequests = 2; // Mock data

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
                      Admin Management
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>

              {/* Page Header */}
              <div className="flex flex-col space-y-2 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
                <div className="space-y-1">
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold font-poppins tracking-tight">
                    Admin Management
                  </h1>
                  <p className="text-sm md:text-base text-muted-foreground">
                    Manage admin accounts and permissions
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <ExportDropdown
                    data={exportData}
                    filename={`admins_export_${format(
                      new Date(),
                      "yyyy-MM-dd"
                    )}`}
                    className="bg-green-600 hover:bg-green-700 text-white cursor-pointer hover:text-white hover:border-none"
                  />
                  <Button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-blue-400 hover:bg-blue-500 text-white cursor-pointer hover:text-white hover:border-none"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Admin
                  </Button>
                </div>
              </div>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
              <Card className="card-enhanced hover:shadow-lg transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                    Total Admins
                  </CardTitle>
                  <div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <UserCheck className="h-4 w-4 text-purple-500" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-1">
                  <div className="text-xl sm:text-2xl font-bold font-poppins">
                    {totalAdmins}
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <UserCheck className="h-3 w-3 mr-1" />
                    <span>All accounts</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-enhanced hover:shadow-lg transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                    Active Admins
                  </CardTitle>
                  <div className="h-8 w-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <UserCheck className="h-4 w-4 text-green-500" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-1">
                  <div className="text-xl sm:text-2xl font-bold font-poppins">
                    {activeAdmins}
                  </div>
                  <div className="flex items-center text-xs text-green-600">
                    <UserCheck className="h-3 w-3 mr-1" />
                    <span>Online access</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-enhanced hover:shadow-lg transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                    Super Admins
                  </CardTitle>
                  <div className="h-8 w-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                    <Shield className="h-4 w-4 text-red-500" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-1">
                  <div className="text-xl sm:text-2xl font-bold font-poppins">
                    {superAdmins}
                  </div>
                  <div className="flex items-center text-xs text-red-600">
                    <Shield className="h-3 w-3 mr-1" />
                    <span>Full access</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-enhanced hover:shadow-lg transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                    Pending Requests
                  </CardTitle>
                  <div className="h-8 w-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                    <Clock className="h-4 w-4 text-orange-500" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-1">
                  <div className="text-xl sm:text-2xl font-bold font-poppins">
                    {pendingRequests}
                  </div>
                  <div className="flex items-center text-xs text-orange-600">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>Awaiting approval</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Admin Accounts Table */}
            <Card className="card-enhanced shadow-sm">
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="p-6">
                    <TableSkeleton />
                  </div>
                ) : (
                  <>
                    <div className="p-4 sm:p-6 space-y-4">
                      <SearchFilters
                        searchPlaceholder="Search by username..."
                        filterOptions={filterOptions}
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        onFilterChange={handleFilterChange}
                        onClearFilters={handleClearFilters}
                        activeFilters={activeFilters}
                        showDateFilter={true}
                        dateRange={dateRange}
                        onDateRangeChange={handleDateRangeChange}
                      />

                      <div className="rounded-lg border border-border/50 overflow-hidden">
                        <MobileTable
                          data={paginatedAdmins}
                          columns={columns}
                          actions={actions}
                          mobileCardRender={mobileCardRender}
                          emptyMessage="No administrators found"
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
                              filteredAdmins.length
                            )}{" "}
                            to{" "}
                            {Math.min(
                              currentPage * pageSize,
                              filteredAdmins.length
                            )}{" "}
                            of {filteredAdmins.length} admins
                          </div>

                          {totalPages > 1 && (
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  setCurrentPage((prev) =>
                                    Math.max(1, prev - 1)
                                  )
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
                                    if (totalPages <= 5) pageNum = i + 1;
                                    else if (currentPage <= 3) pageNum = i + 1;
                                    else if (currentPage >= totalPages - 2)
                                      pageNum = totalPages - 4 + i;
                                    else pageNum = currentPage - 2 + i;

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
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </SidebarInset>

      {/* Modals */}
      <AddAdminModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddAdmin}
      />

      <ViewAdminModal
        admin={selectedAdmin}
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedAdmin(null);
        }}
      />

      <EditAdminModal
        admin={selectedAdmin}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedAdmin(null);
        }}
        onUpdate={handleUpdateAdmin}
      />

      {/* Suspend Confirmation Dialog */}
      <AlertDialog
        open={suspendDialog.isOpen}
        onOpenChange={(open) => setSuspendDialog({ isOpen: open, admin: null })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {suspendDialog.admin?.status === "Active"
                ? "Suspend"
                : "Activate"}{" "}
              Admin Account
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to{" "}
              {suspendDialog.admin?.status === "Active"
                ? "suspend"
                : "activate"}{" "}
              "{suspendDialog.admin?.username}"? This will{" "}
              {suspendDialog.admin?.status === "Active" ? "revoke" : "restore"}{" "}
              their access to the admin panel.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                suspendDialog.admin && handleSuspendAdmin(suspendDialog.admin)
              }
              className={
                suspendDialog.admin?.status === "Active"
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : ""
              }
            >
              {suspendDialog.admin?.status === "Active"
                ? "Suspend"
                : "Activate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarProvider>
  );
}
