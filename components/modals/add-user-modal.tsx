"use client";

import React, { useState, useEffect, useRef } from "react";
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
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Simple regex to validate username (starts with @ or + and then alphanumeric/underscore)
const usernameRegex = /^[@+][\w\d_]{2,}$/;

export function AddUserModal({ isOpen, onClose }: AddUserModalProps) {
  const [formData, setFormData] = useState({
    username: "",
    platform: "",
    role: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    username: "",
    platform: "",
    role: "",
  });

  const usernameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && usernameRef.current) {
      usernameRef.current.focus();
    }
  }, [isOpen]);

  // Validate all fields and set errors
  const validate = () => {
    const errors = {
      username: "",
      platform: "",
      role: "",
    };
    if (!formData.username.trim()) {
      errors.username = "Username is required";
    } else if (!usernameRegex.test(formData.username.trim())) {
      errors.username =
        "Must start with '@' or '+' and be at least 3 characters";
    }
    if (!formData.platform) {
      errors.platform = "Platform is required";
    }
    if (!formData.role) {
      errors.role = "Role is required";
    }
    setValidationErrors(errors);

    return !errors.username && !errors.platform && !errors.role;
  };

  const isFormValid = () => {
    return (
      formData.username.trim() &&
      usernameRegex.test(formData.username.trim()) &&
      formData.platform &&
      formData.role
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Fake API call

      toast.success("User Added Successfully", {
        description: `${formData.username} has been added to the system.`,
      });

      setFormData({ username: "", platform: "", role: "" });
      onClose();
    } catch {
      toast.error("Error", {
        description: "Failed to add user. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] w-full">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>
            Create a new user account. Fill in the required information below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} noValidate>
          <div className="grid gap-6 py-4">
            {/* Username */}
            <div className="grid gap-1">
              <Label htmlFor="username" className="flex justify-between">
                Username
                {validationErrors.username && (
                  <span className="text-xs text-red-600" role="alert">
                    {validationErrors.username}
                  </span>
                )}
              </Label>
              <Input
                id="username"
                type="text"
                ref={usernameRef}
                placeholder="@username or +1234567890"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                aria-invalid={!!validationErrors.username}
                aria-describedby="username-error"
                autoComplete="username"
                disabled={isLoading}
                required
              />
            </div>

            {/* Platform */}
            <div className="grid gap-1">
              <Label htmlFor="platform" className="flex justify-between">
                Platform
                {validationErrors.platform && (
                  <span className="text-xs text-red-600" role="alert">
                    {validationErrors.platform}
                  </span>
                )}
              </Label>
              <Select
                value={formData.platform}
                onValueChange={(value) =>
                  setFormData({ ...formData, platform: value })
                }
                aria-invalid={!!validationErrors.platform}
                aria-describedby="platform-error"
                disabled={isLoading}
                required
              >
                <SelectTrigger id="platform" aria-required="true">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="telegram">Telegram</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Role */}
            <div className="grid gap-1">
              <Label htmlFor="role" className="flex justify-between">
                Role
                {validationErrors.role && (
                  <span className="text-xs text-red-600" role="alert">
                    {validationErrors.role}
                  </span>
                )}
              </Label>
              <Select
                value={formData.role}
                onValueChange={(value) =>
                  setFormData({ ...formData, role: value })
                }
                aria-invalid={!!validationErrors.role}
                aria-describedby="role-error"
                disabled={isLoading}
                required
              >
                <SelectTrigger id="role" aria-required="true">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="customer">Customer</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="support">Support</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid() || isLoading}
              className="cursor-pointer bg-blue-600 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add User"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// "use client";

// import type React from "react";

// import { useState } from "react";
// import { X, Plus } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// interface AddUserModalProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// export function AddUserModal({ isOpen, onClose }: AddUserModalProps) {
//   const [formData, setFormData] = useState({
//     username: "",
//     platform: "",
//     role: "customer",
//     status: "active",
//     kycStatus: "not_started",
//   });

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log("Creating user:", formData);
//     // Handle user creation logic here
//     onClose();
//     setFormData({
//       username: "",
//       platform: "",
//       role: "customer",
//       status: "active",
//       kycStatus: "not_started",
//     });
//   };

//   const handleInputChange = (field: string, value: string) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-md bg-card border-border/50">
//         <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
//           <DialogTitle className="font-poppins text-lg">
//             Add New User
//           </DialogTitle>
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={onClose}
//             className="h-6 w-6 p-0"
//           >
//             <X className="h-4 w-4" />
//           </Button>
//         </DialogHeader>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div className="space-y-2">
//             <Label htmlFor="username">Username</Label>
//             <Input
//               id="username"
//               placeholder="Enter username"
//               value={formData.username}
//               onChange={(e) => handleInputChange("username", e.target.value)}
//               className="bg-background/50 border-border/50"
//               required
//             />
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="platform">Platform</Label>
//             <Select
//               value={formData.platform}
//               onValueChange={(value) => handleInputChange("platform", value)}
//               required
//             >
//               <SelectTrigger className="bg-background/50 border-border/50">
//                 <SelectValue placeholder="Select platform" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="telegram">Telegram</SelectItem>
//                 <SelectItem value="whatsapp">WhatsApp</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="role">Role</Label>
//             <Select
//               value={formData.role}
//               onValueChange={(value) => handleInputChange("role", value)}
//             >
//               <SelectTrigger className="bg-background/50 border-border/50">
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="customer">Customer</SelectItem>
//                 <SelectItem value="admin">Admin</SelectItem>
//                 <SelectItem value="support">Support</SelectItem>
//                 <SelectItem value="viewer">Viewer</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="status">Status</Label>
//             <Select
//               value={formData.status}
//               onValueChange={(value) => handleInputChange("status", value)}
//             >
//               <SelectTrigger className="bg-background/50 border-border/50">
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="active">Active</SelectItem>
//                 <SelectItem value="blocked">Blocked</SelectItem>
//                 <SelectItem value="flagged">Flagged</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="kycStatus">KYC Status</Label>
//             <Select
//               value={formData.kycStatus}
//               onValueChange={(value) => handleInputChange("kycStatus", value)}
//             >
//               <SelectTrigger className="bg-background/50 border-border/50">
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="not_started">Not Started</SelectItem>
//                 <SelectItem value="pending">Pending</SelectItem>
//                 <SelectItem value="verified">Verified</SelectItem>
//                 <SelectItem value="failed">Failed</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           <div className="flex justify-end gap-2 pt-4">
//             <Button
//               type="button"
//               variant="outline"
//               onClick={onClose}
//               className="bg-background/50 border-border/50"
//             >
//               Cancel
//             </Button>
//             <Button type="submit">
//               <Plus className="h-4 w-4 mr-2" />
//               Create User
//             </Button>
//           </div>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }
