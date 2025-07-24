"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";

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

interface ViewAdminModalProps {
  admin: Admin | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ViewAdminModal({
  admin,
  isOpen,
  onClose,
}: ViewAdminModalProps) {
  if (!admin) return null;

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Admin Details</DialogTitle>
          <DialogDescription>
            View detailed information about this admin account.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Username</Label>
              <div className="font-medium">{admin.username}</div>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Badge
                variant="outline"
                className={
                  admin.status === "Active"
                    ? "status-active"
                    : "status-inactive"
                }
              >
                {admin.status}
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Role</Label>
            <Badge variant="outline" className={getRoleColor(admin.role)}>
              {admin.role}
            </Badge>
          </div>

          <div className="space-y-2">
            <Label>Permissions</Label>
            <div className="flex flex-wrap gap-2">
              {admin.permissions.map((permission, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-xs bg-green-500/20 text-green-400 border-green-500/30"
                >
                  {permission}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Created</Label>
              <div className="text-sm text-muted-foreground">
                {format(new Date(admin.created), "PPpp")}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Last Login</Label>
              <div className="text-sm text-muted-foreground">
                {admin.lastLogin
                  ? format(new Date(admin.lastLogin), "PPpp")
                  : "Never"}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Created By</Label>
            <div className="text-sm text-muted-foreground">
              {admin.createdBy}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
