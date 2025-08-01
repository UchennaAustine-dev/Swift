"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockAdminData } from "@/data/profileData";
import {
  AdminUser,
  EditFormData,
  PasswordData,
  ShowPasswords,
  PreferenceCategory,
} from "@/types/profile";
import { PasswordModal } from "@/components/profile/password-modal";
import { ProfileHeader } from "@/components/profile/profile-header";
import { ActivityTab } from "@/components/profile/tabs/activity-tab";
import { OverviewTab } from "@/components/profile/tabs/overview-tab";
import { PermissionsTab } from "@/components/profile/tabs/permissions-tab";
import { PreferencesTab } from "@/components/profile/tabs/preferences-tab";
import { SecurityTab } from "@/components/profile/tabs/security-tab";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();

  const [adminData, setAdminData] = useState<AdminUser>(mockAdminData);
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<EditFormData>({
    firstName: adminData.firstName,
    lastName: adminData.lastName,
    email: adminData.email,
    phone: adminData.phone,
    bio: adminData.bio,
    location: adminData.location,
  });
  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState<ShowPasswords>({
    current: false,
    new: false,
    confirm: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEditToggle = () => {
    if (isEditing) {
      // Reset form data if canceling
      setEditFormData({
        firstName: adminData.firstName,
        lastName: adminData.lastName,
        email: adminData.email,
        phone: adminData.phone,
        bio: adminData.bio,
        location: adminData.location,
      });
    }
    setIsEditing(!isEditing);
  };

  const handleSaveProfile = async () => {
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Update admin data
    setAdminData((prev) => ({
      ...prev,
      ...editFormData,
    }));

    setIsEditing(false);
    setIsSubmitting(false);
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords don't match!");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Reset password form
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setIsPasswordModalOpen(false);
    setIsSubmitting(false);
    alert("Password changed successfully!");
  };

  const handlePreferenceChange = <T extends PreferenceCategory>(
    category: T,
    key: string,
    value: any
  ) => {
    setAdminData((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [category]: {
          ...prev.preferences[category],
          [key]: value,
        },
      },
    }));
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8 max-w-6xl">
      {/* Back Button */}
      <Button
        variant="outline"
        size="sm"
        className="mb-6 flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 focus-visible:ring-2 focus-visible:ring-primary transition-colors cursor-pointer"
        onClick={() => router.back()}
        aria-label="Go back"
      >
        <ChevronLeft className="h-4 w-4" />
        Back
      </Button>

      <ProfileHeader
        adminData={adminData}
        isEditing={isEditing}
        isSubmitting={isSubmitting}
        onEditToggle={handleEditToggle}
        onSave={handleSaveProfile}
      />

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList
          className="flex max-w-full overflow-x-auto rounded-md border border-border bg-background"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <TabsTrigger className="flex-shrink-0 min-w-[7rem]" value="overview">
            Overview
          </TabsTrigger>
          <TabsTrigger className="flex-shrink-0 min-w-[7rem]" value="security">
            Security
          </TabsTrigger>
          <TabsTrigger
            className="flex-shrink-0 min-w-[7rem]"
            value="preferences"
          >
            Preferences
          </TabsTrigger>
          <TabsTrigger
            className="flex-shrink-0 min-w-[7rem]"
            value="permissions"
          >
            Permissions
          </TabsTrigger>
          <TabsTrigger className="flex-shrink-0 min-w-[7rem]" value="activity">
            Activity
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab
            adminData={adminData}
            editFormData={editFormData}
            setEditFormData={setEditFormData}
            isEditing={isEditing}
          />
        </TabsContent>

        <TabsContent value="security">
          <SecurityTab
            adminData={adminData}
            onPreferenceChange={handlePreferenceChange}
            onPasswordModalOpen={() => setIsPasswordModalOpen(true)}
          />
        </TabsContent>

        <TabsContent value="preferences">
          <PreferencesTab
            adminData={adminData}
            onPreferenceChange={handlePreferenceChange}
          />
        </TabsContent>

        <TabsContent value="permissions">
          <PermissionsTab adminData={adminData} />
        </TabsContent>

        <TabsContent value="activity">
          <ActivityTab />
        </TabsContent>
      </Tabs>

      <PasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        passwordData={passwordData}
        setPasswordData={setPasswordData}
        showPasswords={showPasswords}
        setShowPasswords={setShowPasswords}
        onSubmit={handlePasswordChange}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
