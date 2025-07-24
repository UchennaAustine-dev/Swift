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
import { toast } from "sonner";

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddUserModal({ isOpen, onClose }: AddUserModalProps) {
  const [formData, setFormData] = useState({
    username: "",
    platform: "",
    role: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("User Added Successfully", {
        description: `${formData.username} has been added to the system.`,
      });

      // Reset form and close modal
      setFormData({ username: "", platform: "", role: "" });
      onClose();
    } catch (error) {
      toast.error("Error", {
        description: "Failed to add user. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>
            Create a new user account. Fill in the required information below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="@username or +1234567890"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="platform">Platform</Label>
              <Select
                value={formData.platform}
                onValueChange={(value) =>
                  setFormData({ ...formData, platform: value })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="telegram">Telegram</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value) =>
                  setFormData({ ...formData, role: value })
                }
                required
              >
                <SelectTrigger>
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
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add User"}
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
