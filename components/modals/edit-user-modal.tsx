"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
  Shield,
  Activity,
  CheckCircle,
  User,
  Lock,
  Edit,
  UserCheck,
  FileText,
  Clock,
  Loader2,
} from "lucide-react";
import type { User as UserType } from "@/lib/types";

interface EditUserModalProps {
  user: UserType | null;
  isOpen: boolean;
  onClose: () => void;
  onUserUpdate?: (updatedUser: UserType) => void;
}

// Permission categories and their permissions
const permissionCategories = {
  users: {
    label: "User Management",
    permissions: [
      {
        key: "users.view",
        label: "View Users",
        description: "Can view user list and profiles",
      },
      {
        key: "users.create",
        label: "Create Users",
        description: "Can add new users to the system",
      },
      {
        key: "users.edit",
        label: "Edit Users",
        description: "Can modify user information and settings",
      },
      {
        key: "users.delete",
        label: "Delete Users",
        description: "Can remove users from the system",
      },
      {
        key: "users.block",
        label: "Block/Unblock Users",
        description: "Can block or unblock user accounts",
      },
    ],
  },
  trades: {
    label: "Trade Management",
    permissions: [
      {
        key: "trades.view",
        label: "View Trades",
        description: "Can view trade history and details",
      },
      {
        key: "trades.approve",
        label: "Approve Trades",
        description: "Can approve pending trades",
      },
      {
        key: "trades.reject",
        label: "Reject Trades",
        description: "Can reject trades",
      },
      {
        key: "trades.cancel",
        label: "Cancel Trades",
        description: "Can cancel ongoing trades",
      },
    ],
  },
  rates: {
    label: "Rate Management",
    permissions: [
      {
        key: "rates.view",
        label: "View Rates",
        description: "Can view exchange rates",
      },
      {
        key: "rates.edit",
        label: "Edit Rates",
        description: "Can modify exchange rates",
      },
      {
        key: "rates.sync",
        label: "Sync Rates",
        description: "Can manually sync rates with APIs",
      },
    ],
  },
  system: {
    label: "System Administration",
    permissions: [
      {
        key: "system.settings",
        label: "System Settings",
        description: "Can modify system configuration",
      },
      {
        key: "system.logs",
        label: "View Logs",
        description: "Can access system and audit logs",
      },
      {
        key: "system.maintenance",
        label: "Maintenance Mode",
        description: "Can enable/disable maintenance mode",
      },
      {
        key: "system.backup",
        label: "Backup Management",
        description: "Can create and restore backups",
      },
    ],
  },
};

// Default permissions for each role
const defaultPermissions = {
  customer: [],
  support: ["users.view", "trades.view", "trades.approve", "trades.reject"],
  admin: [
    "users.view",
    "users.create",
    "users.edit",
    "users.block",
    "trades.view",
    "trades.approve",
    "trades.reject",
    "trades.cancel",
    "rates.view",
    "rates.edit",
    "rates.sync",
  ],
  viewer: ["users.view", "trades.view", "rates.view", "system.logs"],
};

export function EditUserModal({
  user,
  isOpen,
  onClose,
  onUserUpdate,
}: EditUserModalProps) {
  const [activeTab, setActiveTab] = useState("basic");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    role: "customer",
    status: "active",
    kycStatus: "not_started",
    notes: "",
    permissions: [] as string[],
    twoFactorEnabled: false,
    emailNotifications: true,
    smsNotifications: false,
  });

  // Initialize form data when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        role: user.role || "customer",
        status: user.status || "active",
        kycStatus: user.kycStatus || "not_started",
        notes: "",
        permissions:
          defaultPermissions[user.role as keyof typeof defaultPermissions] ||
          [],
        twoFactorEnabled: false,
        emailNotifications: true,
        smsNotifications: false,
      });
    }
  }, [user]);

  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const updatedUser: any = {
        ...user,
        username: formData.username,
        role: formData.role,
        status: formData.status,
        kycStatus: formData.kycStatus,
      };

      onUserUpdate?.(updatedUser);
      toast.success("User Updated Successfully", {
        description: `${formData.username} has been updated.`,
      });
      onClose();
    } catch (error) {
      toast.error("Update Failed", {
        description: "Failed to update user. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRoleChange = (newRole: string) => {
    setFormData((prev) => ({
      ...prev,
      role: newRole,
      permissions:
        defaultPermissions[newRole as keyof typeof defaultPermissions] || [],
    }));
  };

  const handlePermissionChange = (permissionKey: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      permissions: checked
        ? [...prev.permissions, permissionKey]
        : prev.permissions.filter((p) => p !== permissionKey),
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "blocked":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "flagged":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getKycStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "failed":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary/10 text-primary">
                {user.username.slice(1, 3).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold">{user.username}</div>
              <div className="text-sm text-muted-foreground font-normal">
                Edit User Profile & Permissions
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Basic Info</span>
              </TabsTrigger>
              <TabsTrigger
                value="permissions"
                className="flex items-center gap-2"
              >
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Permissions</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                <span className="hidden sm:inline">Security</span>
              </TabsTrigger>
              <TabsTrigger value="activity" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                <span className="hidden sm:inline">Activity</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Basic Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={formData.username}
                        onChange={(e) =>
                          setFormData({ ...formData, username: e.target.value })
                        }
                        placeholder="Enter username"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select
                        value={formData.role}
                        onValueChange={handleRoleChange}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="customer">Customer</SelectItem>
                          <SelectItem value="support">Support Agent</SelectItem>
                          <SelectItem value="admin">Administrator</SelectItem>
                          <SelectItem value="viewer">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status">Account Status</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) =>
                          setFormData({ ...formData, status: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="blocked">Blocked</SelectItem>
                          <SelectItem value="flagged">Flagged</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="kycStatus">KYC Status</Label>
                      <Select
                        value={formData.kycStatus}
                        onValueChange={(value) =>
                          setFormData({ ...formData, kycStatus: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="not_started">
                            Not Started
                          </SelectItem>
                          <SelectItem value="pending">
                            Pending Review
                          </SelectItem>
                          <SelectItem value="verified">Verified</SelectItem>
                          <SelectItem value="failed">Failed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      Current Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        User ID:
                      </span>
                      <Badge variant="outline" className="font-mono">
                        {user.id}
                      </Badge>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Platform:
                      </span>
                      <Badge
                        variant="outline"
                        className={
                          user.platform === "telegram"
                            ? "platform-telegram"
                            : "platform-whatsapp"
                        }
                      >
                        {user.platform === "telegram" ? "Telegram" : "WhatsApp"}
                      </Badge>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Status:
                      </span>
                      <Badge
                        variant="outline"
                        className={getStatusColor(formData.status)}
                      >
                        {formData.status}
                      </Badge>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        KYC:
                      </span>
                      <Badge
                        variant="outline"
                        className={getKycStatusColor(formData.kycStatus)}
                      >
                        {formData.kycStatus.replace("_", " ")}
                      </Badge>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Total Trades:
                      </span>
                      <span className="font-mono font-semibold">
                        {user.totalTrades}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Joined:
                      </span>
                      <span className="text-sm">
                        {new Date(user.joinedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Admin Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Add any notes about this user..."
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    rows={3}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="permissions" className="space-y-6 mt-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">User Permissions</h3>
                    <p className="text-sm text-muted-foreground">
                      Configure what this user can access and modify in the
                      system
                    </p>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {formData.role}
                  </Badge>
                </div>

                {Object.entries(permissionCategories).map(
                  ([categoryKey, category]) => (
                    <Card key={categoryKey}>
                      <CardHeader>
                        <CardTitle className="text-base">
                          {category.label}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {category.permissions.map((permission) => (
                          <div
                            key={permission.key}
                            className="flex items-start space-x-3"
                          >
                            <Checkbox
                              id={permission.key}
                              checked={formData.permissions.includes(
                                permission.key
                              )}
                              onCheckedChange={(checked) =>
                                handlePermissionChange(
                                  permission.key,
                                  checked as boolean
                                )
                              }
                              disabled={formData.role === "customer"}
                            />
                            <div className="grid gap-1.5 leading-none">
                              <Label
                                htmlFor={permission.key}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {permission.label}
                              </Label>
                              <p className="text-xs text-muted-foreground">
                                {permission.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )
                )}

                {formData.role === "customer" && (
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <Shield className="h-4 w-4 inline mr-2" />
                      Customer accounts have limited permissions by default and
                      cannot be modified.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="security" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Security Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Require 2FA for enhanced account security
                      </p>
                    </div>
                    <Switch
                      checked={formData.twoFactorEnabled}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, twoFactorEnabled: checked })
                      }
                    />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">
                      Notification Preferences
                    </h4>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive important updates via email
                        </p>
                      </div>
                      <Switch
                        checked={formData.emailNotifications}
                        onCheckedChange={(checked) =>
                          setFormData({
                            ...formData,
                            emailNotifications: checked,
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>SMS Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive alerts via SMS
                        </p>
                      </div>
                      <Switch
                        checked={formData.smsNotifications}
                        onCheckedChange={(checked) =>
                          setFormData({
                            ...formData,
                            smsNotifications: checked,
                          })
                        }
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">
                      Security Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Last Login:
                        </span>
                        <span>2 hours ago</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Failed Attempts:
                        </span>
                        <span>0</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          IP Address:
                        </span>
                        <span className="font-mono">192.168.1.100</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Device:</span>
                        <span>Mobile App</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        action: "Profile Updated",
                        time: "2 hours ago",
                        icon: Edit,
                        color: "text-blue-600",
                        description: "Username changed",
                      },
                      {
                        action: "Trade Completed",
                        time: "1 day ago",
                        icon: CheckCircle,
                        color: "text-green-600",
                        description: "BTC trade for ₦2.5M",
                      },
                      {
                        action: "KYC Submitted",
                        time: "3 days ago",
                        icon: Shield,
                        color: "text-purple-600",
                        description: "Documents uploaded for verification",
                      },
                      {
                        action: "Account Created",
                        time: "1 week ago",
                        icon: UserCheck,
                        color: "text-gray-600",
                        description: "User registered via Telegram",
                      },
                    ].map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50"
                      >
                        <div
                          className={`p-2 rounded-full bg-muted ${activity.color}`}
                        >
                          <activity.icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">
                              {activity.action}
                            </p>
                            <span className="text-xs text-muted-foreground">
                              {activity.time}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {activity.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700 text-white hover:text-white cursor-pointer "
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white hover:text-white cursor-pointer "
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving Changes...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
