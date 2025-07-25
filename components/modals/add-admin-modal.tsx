"use client";

import type React from "react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

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

interface AddAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (admin: Omit<Admin, "id" | "created">) => void;
}

const PERMISSION_OPTIONS = [
  { id: "all", label: "All Modules", roles: ["Owner"] },
  { id: "trades", label: "Trades", roles: ["Admin", "Support"] },
  { id: "users", label: "Users", roles: ["Admin", "Support"] },
  { id: "analytics", label: "Analytics", roles: ["Admin", "Viewer"] },
  { id: "api", label: "API Management", roles: ["Admin"] },
  { id: "rates", label: "Rate Management", roles: ["Admin"] },
  { id: "support", label: "Support & Alerts", roles: ["Support"] },
  { id: "dashboard", label: "Dashboard (View Only)", roles: ["Viewer"] },
  { id: "logs", label: "System Logs (View Only)", roles: ["Viewer"] },
  {
    id: "users_view",
    label: "Users (View Only)",
    roles: ["Support", "Viewer"],
  },
];

export function AddAdminModal({ isOpen, onClose, onAdd }: AddAdminModalProps) {
  const [formData, setFormData] = useState({
    username: "",
    role: "" as Admin["role"] | "",
    permissions: [] as string[],
    status: "Active" as const,
    createdBy: "super_admin", // This would come from current user context
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!formData.role) {
      newErrors.role = "Role is required";
    }

    if (formData.permissions.length === 0) {
      newErrors.permissions = "At least one permission is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Validation Error", {
        description: "Please fix the errors in the form.",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const newAdmin: Omit<Admin, "id" | "created"> = {
        ...formData,
        role: formData.role as Admin["role"],
      };

      onAdd(newAdmin);
      handleClose();
    } catch (error) {
      toast.error("Error", {
        description: "Failed to add admin. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      username: "",
      role: "",
      permissions: [],
      status: "Active",
      createdBy: "super_admin",
    });
    setErrors({});
    onClose();
  };

  const handleRoleChange = (role: Admin["role"]) => {
    setFormData((prev) => ({ ...prev, role, permissions: [] }));
  };

  const handlePermissionChange = (permission: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      permissions: checked
        ? [...prev.permissions, permission]
        : prev.permissions.filter((p) => p !== permission),
    }));
  };

  const availablePermissions = PERMISSION_OPTIONS.filter((perm) =>
    formData.role ? perm.roles.includes(formData.role) : false
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Admin</DialogTitle>
          <DialogDescription>
            Create a new admin account with specific roles and permissions.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username">Username *</Label>
            <Input
              id="username"
              placeholder="Enter username"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              className={errors.username ? "border-red-500" : ""}
            />
            {errors.username && (
              <p className="text-sm text-red-500">{errors.username}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role *</Label>
            <Select value={formData.role} onValueChange={handleRoleChange}>
              <SelectTrigger className={errors.role ? "border-red-500" : ""}>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Support">Support</SelectItem>
                <SelectItem value="Viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-sm text-red-500">{errors.role}</p>
            )}
          </div>

          {formData.role && (
            <div className="space-y-2">
              <Label>Permissions *</Label>
              <div className="space-y-3 max-h-48 overflow-y-auto border rounded-md p-3">
                {availablePermissions.map((permission) => (
                  <div
                    key={permission.id}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={permission.id}
                      checked={formData.permissions.includes(permission.label)}
                      onCheckedChange={(checked) =>
                        handlePermissionChange(
                          permission.label,
                          checked as boolean
                        )
                      }
                    />
                    <Label
                      htmlFor={permission.id}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {permission.label}
                    </Label>
                  </div>
                ))}
              </div>
              {errors.permissions && (
                <p className="text-sm text-red-500">{errors.permissions}</p>
              )}
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Admin"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
