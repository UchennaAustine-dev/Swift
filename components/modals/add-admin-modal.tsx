"use client";

import type React from "react";

import { useState } from "react";
import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AddAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const permissions = [
  {
    id: "dashboard",
    label: "Dashboard",
    description: "View dashboard metrics",
  },
  { id: "users", label: "Users", description: "Manage user accounts" },
  { id: "trades", label: "Trades", description: "View and manage trades" },
  {
    id: "gift_card_api",
    label: "Gift Card API",
    description: "Manage gift card APIs",
  },
  { id: "crypto_api", label: "Crypto API", description: "Manage crypto APIs" },
  {
    id: "rates",
    label: "Rate Management",
    description: "Manage exchange rates",
  },
  { id: "payouts", label: "Payout Logs", description: "View payout history" },
  {
    id: "support",
    label: "Support & Alerts",
    description: "Handle support requests",
  },
  {
    id: "system_logs",
    label: "System Logs",
    description: "View system activity",
  },
  { id: "bot_logs", label: "Bot Logs", description: "Monitor bot activities" },
  { id: "settings", label: "Settings", description: "System configuration" },
  {
    id: "admin_management",
    label: "Admin Management",
    description: "Manage admin accounts",
  },
];

export function AddAdminModal({ isOpen, onClose }: AddAdminModalProps) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "admin",
    permissions: [] as string[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Creating admin:", formData);
    // Handle admin creation logic here
    onClose();
    setFormData({
      username: "",
      email: "",
      role: "admin",
      permissions: [],
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      permissions: checked
        ? [...prev.permissions, permissionId]
        : prev.permissions.filter((p) => p !== permissionId),
    }));
  };

  const handleRoleChange = (role: string) => {
    setFormData((prev) => ({ ...prev, role }));

    // Set default permissions based on role
    if (role === "owner") {
      setFormData((prev) => ({
        ...prev,
        permissions: permissions.map((p) => p.id),
      }));
    } else if (role === "admin") {
      setFormData((prev) => ({
        ...prev,
        permissions: permissions
          .filter((p) => p.id !== "admin_management")
          .map((p) => p.id),
      }));
    } else if (role === "support") {
      setFormData((prev) => ({
        ...prev,
        permissions: ["dashboard", "users", "trades", "support", "bot_logs"],
      }));
    } else if (role === "viewer") {
      setFormData((prev) => ({
        ...prev,
        permissions: ["dashboard"],
      }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-card border-border/50">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="font-poppins text-lg">
            Add New Admin
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="Enter username"
              value={formData.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
              className="bg-background/50 border-border/50"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter email address"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="bg-background/50 border-border/50"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select value={formData.role} onValueChange={handleRoleChange}>
              <SelectTrigger className="bg-background/50 border-border/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="support">Support</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
                <SelectItem value="owner">Owner</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Permissions</Label>
            <ScrollArea className="h-48 w-full border border-border/50 rounded-md p-3 bg-background/50">
              <div className="space-y-3">
                {permissions.map((permission) => (
                  <div
                    key={permission.id}
                    className="flex items-start space-x-2"
                  >
                    <Checkbox
                      id={permission.id}
                      checked={formData.permissions.includes(permission.id)}
                      onCheckedChange={(checked) =>
                        handlePermissionChange(
                          permission.id,
                          checked as boolean
                        )
                      }
                    />
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor={permission.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {permission.label}
                      </label>
                      <p className="text-xs text-muted-foreground">
                        {permission.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="bg-background/50 border-border/50"
            >
              Cancel
            </Button>
            <Button type="submit">
              <Plus className="h-4 w-4 mr-2" />
              Create Admin
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
