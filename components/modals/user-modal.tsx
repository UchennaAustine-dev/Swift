"use client";

import type React from "react";

import { useState } from "react";
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
import { AlertTriangle, Shield, Activity, CheckCircle } from "lucide-react";
import type { User as UserType } from "@/lib/types";

interface UserModalProps {
  user: UserType | null | any;
  isOpen: boolean;
  onClose: () => void;
  mode: "view" | "edit" | "block" | "reset";
}

export function UserModal({ user, isOpen, onClose, mode }: UserModalProps) {
  const [formData, setFormData] = useState({
    username: user?.username || "",
    role: user?.role || "customer",
    status: user?.status || "active",
    kycStatus: user?.kycStatus || "not_started",
    notes: "",
    blockReason: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log(`${mode} user:`, user.id, formData);
    setIsSubmitting(false);
    onClose();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "blocked":
        return "bg-red-500";
      case "flagged":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const getKycStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "not_started":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback>
                {user.username.slice(1, 3).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold">{user.username}</div>
              <div className="text-sm text-muted-foreground font-normal">
                {mode === "view" && "User Profile"}
                {mode === "edit" && "Edit User"}
                {mode === "block" && "Block User"}
                {mode === "reset" && "Reset Password"}
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        {mode === "view" && (
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="trades">Trades</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">User ID:</span>
                      <span className="font-mono">{user.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Platform:</span>
                      <Badge
                        variant={
                          user.platform === "telegram" ? "default" : "secondary"
                        }
                      >
                        {user.platform === "telegram" ? "Telegram" : "WhatsApp"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Role:</span>
                      <Badge variant="outline">{user.role}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Joined:</span>
                      <span>
                        {new Date(user.joinedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">
                      Status & Verification
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge
                        variant="outline"
                        className={`${getStatusColor(
                          user.status
                        )} text-white border-0`}
                      >
                        {user.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">KYC Status:</span>
                      <Badge
                        variant="outline"
                        className={`${getKycStatusColor(
                          user.kycStatus
                        )} text-white border-0`}
                      >
                        {user.kycStatus.replace("_", " ")}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Total Trades:
                      </span>
                      <span className="font-mono font-semibold">
                        {user.totalTrades}
                      </span>
                    </div>
                    {user.abuseScore && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Abuse Score:
                        </span>
                        <Badge
                          variant={
                            user.abuseScore > 70
                              ? "destructive"
                              : user.abuseScore > 40
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {user.abuseScore}/100
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Trading Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold">₦2.5M</div>
                      <div className="text-xs text-muted-foreground">
                        Total Volume
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">95%</div>
                      <div className="text-xs text-muted-foreground">
                        Success Rate
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">2.5h</div>
                      <div className="text-xs text-muted-foreground">
                        Avg Trade Time
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">0</div>
                      <div className="text-xs text-muted-foreground">
                        Disputes
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      {
                        action: "Trade Completed",
                        time: "2 hours ago",
                        icon: CheckCircle,
                        color: "text-green-600",
                      },
                      {
                        action: "Profile Updated",
                        time: "1 day ago",
                        icon: Activity,
                        color: "text-blue-600",
                      },
                      {
                        action: "KYC Submitted",
                        time: "3 days ago",
                        icon: Shield,
                        color: "text-purple-600",
                      },
                      {
                        action: "Account Created",
                        time: "1 week ago",
                        icon: Activity,
                        color: "text-gray-600",
                      },
                    ].map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50"
                      >
                        <activity.icon
                          className={`h-4 w-4 ${activity.color}`}
                        />
                        <div className="flex-1">
                          <div className="text-sm font-medium">
                            {activity.action}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {activity.time}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="trades" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Trade History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Trade history will be displayed here</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">
                    Security Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Login:</span>
                    <span>2 hours ago</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Login Attempts:
                    </span>
                    <span>0 failed</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">2FA Enabled:</span>
                    <Badge
                      variant="outline"
                      className="bg-red-50 text-red-700 border-red-200"
                    >
                      Disabled
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">IP Address:</span>
                    <span className="font-mono">192.168.1.100</span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        {mode === "edit" && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) =>
                    setFormData({ ...formData, role: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customer">Customer</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="support">Support</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
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
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="not_started">Not Started</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Admin Notes</Label>
              <Textarea
                id="notes"
                placeholder="Add any notes about this user..."
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
              />
            </div>
            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        )}

        {mode === "block" && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400 mb-2">
                <AlertTriangle className="h-4 w-4" />
                <span className="font-medium">Block User</span>
              </div>
              <p className="text-sm text-red-600 dark:text-red-400">
                This will prevent the user from accessing the platform and
                completing trades.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="blockReason">Reason for blocking</Label>
              <Select
                value={formData.blockReason}
                onValueChange={(value) =>
                  setFormData({ ...formData, blockReason: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="suspicious_activity">
                    Suspicious Activity
                  </SelectItem>
                  <SelectItem value="multiple_failed_trades">
                    Multiple Failed Trades
                  </SelectItem>
                  <SelectItem value="kyc_issues">KYC Issues</SelectItem>
                  <SelectItem value="user_request">User Request</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                placeholder="Provide additional details about the blocking reason..."
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                required
              />
            </div>
            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="destructive"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Blocking..." : "Block User"}
              </Button>
            </DialogFooter>
          </form>
        )}

        {mode === "reset" && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400 mb-2">
                <AlertTriangle className="h-4 w-4" />
                <span className="font-medium">Reset Password</span>
              </div>
              <p className="text-sm text-yellow-600 dark:text-yellow-400">
                This will send a password reset link to the user's registered
                contact method.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Reset Reason (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Reason for password reset..."
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
              />
            </div>
            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send Reset Link"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
