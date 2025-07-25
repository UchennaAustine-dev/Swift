// components/profile/ProfileHeader.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, Save, X, Camera, Shield } from "lucide-react";
import { AdminUser } from "@/types/profile";
import { getRoleColor, getStatusColor } from "@/utils/profileUtils";

interface ProfileHeaderProps {
  adminData: AdminUser;
  isEditing: boolean;
  isSubmitting: boolean;
  onEditToggle: () => void;
  onSave: () => void;
}

export function ProfileHeader({
  adminData,
  isEditing,
  isSubmitting,
  onEditToggle,
  onSave,
}: ProfileHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Avatar className="h-20 w-20">
            {adminData.avatar && <AvatarImage src={adminData.avatar} />}
            <AvatarFallback className="bg-primary text-primary-foreground text-xl">
              {adminData.firstName[0]}
              {adminData.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <Button
            size="sm"
            variant="secondary"
            className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full p-0"
          >
            <Camera className="h-4 w-4" />
          </Button>
        </div>
        <div>
          <h1 className="text-3xl font-bold">
            {adminData.firstName} {adminData.lastName}
          </h1>
          <p className="text-muted-foreground">{adminData.username}</p>
          <div className="flex items-center gap-2 mt-2">
            <Badge
              variant="outline"
              className={`${getRoleColor(adminData.role)} text-white border-0`}
            >
              <Shield className="h-3 w-3 mr-1" />
              {adminData.role.replace("_", " ").toUpperCase()}
            </Badge>
            <Badge
              variant="outline"
              className={`${getStatusColor(
                adminData.status
              )} text-white border-0`}
            >
              {adminData.status.toUpperCase()}
            </Badge>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        {!isEditing ? (
          <Button onClick={onEditToggle}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={onEditToggle}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={onSave} disabled={isSubmitting}>
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
