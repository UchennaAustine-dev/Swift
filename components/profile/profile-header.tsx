"use client";

import { useState, useEffect, ChangeEvent, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, Save, X, Camera, Shield, Loader2 } from "lucide-react";
import { AdminUser } from "@/types/profile";
import { getRoleColor, getStatusColor } from "@/utils/profileUtils";

interface ProfileHeaderProps {
  adminData: AdminUser;
  isEditing: boolean;
  isSubmitting: boolean;
  onEditToggle: () => void;
  onSave: () => void;
  onAvatarChange?: (file: File) => void; // New callback to parent for avatar upload
}

export function ProfileHeader({
  adminData,
  isEditing,
  isSubmitting,
  onEditToggle,
  onSave,
  onAvatarChange,
}: ProfileHeaderProps) {
  const [localAvatarUrl, setLocalAvatarUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update local avatar preview if adminData.avatar changes from the outside
  useEffect(() => {
    setLocalAvatarUrl(adminData.avatar ?? null);
  }, [adminData.avatar]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file (png, jpg, jpeg).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setLocalAvatarUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    onAvatarChange && onAvatarChange(file);
  };

  const handleAvatarButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 mb-8 px-4 sm:px-0 max-w-4xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 flex-1 w-full">
        <div className="relative shrink-0">
          <Avatar className="h-16 w-16 sm:h-20 sm:w-20">
            {localAvatarUrl ? (
              <AvatarImage src={localAvatarUrl} alt="User avatar" />
            ) : (
              <AvatarFallback className="bg-primary text-primary-foreground text-xl select-none flex items-center justify-center">
                {adminData.firstName[0]}
                {adminData.lastName[0]}
              </AvatarFallback>
            )}
          </Avatar>

          <input
            type="file"
            accept="image/png, image/jpeg, image/jpg"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
            disabled={!isEditing || isSubmitting}
            aria-hidden="true"
            tabIndex={-1}
          />

          <Button
            size="sm"
            variant="secondary"
            className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full p-0 flex items-center justify-center touch-manipulation"
            onClick={handleAvatarButtonClick}
            disabled={!isEditing || isSubmitting}
            aria-label="Upload avatar"
            title={
              !isEditing
                ? "Enable edit mode to change avatar"
                : isSubmitting
                ? "Uploading avatar, please wait"
                : "Change avatar"
            }
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Camera className="h-4 w-4" aria-hidden="true" />
            )}
          </Button>
        </div>

        <div className="flex flex-col gap-1 flex-grow w-full sm:w-auto max-w-full">
          <h1 className="text-2xl sm:text-3xl font-bold truncate">
            {adminData.firstName} {adminData.lastName}
          </h1>
          <p className="text-muted-foreground truncate break-words">
            {adminData.username}
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <Badge
              variant="outline"
              className={`${getRoleColor(
                adminData.role
              )} text-white border-0 max-w-full truncate flex items-center`}
              style={{ minWidth: 80 }}
            >
              <Shield className="h-3 w-3 mr-1 shrink-0" />
              {adminData.role.replace("_", " ").toUpperCase()}
            </Badge>
            <Badge
              variant="outline"
              className={`${getStatusColor(
                adminData.status
              )} text-white border-0 max-w-full truncate`}
              style={{ minWidth: 80 }}
            >
              {adminData.status.toUpperCase()}
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        {!isEditing ? (
          <Button
            onClick={onEditToggle}
            aria-label="Edit Profile"
            className="w-full sm:w-auto bg-blue-700 text-white"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2 w-full sm:w-auto flex-col sm:flex-row">
            <Button
              variant="outline"
              onClick={onEditToggle}
              aria-label="Cancel editing profile"
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={onSave}
              disabled={isSubmitting}
              aria-label="Save profile changes"
              className="w-full sm:w-auto bg-blue-700 text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2
                    className="h-4 w-4 mr-2 animate-spin"
                    aria-hidden="true"
                  />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
