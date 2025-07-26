// app/profile/page.tsx
"use client";

import { useState } from "react";
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

export default function ProfilePage() {
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
    <div className="container mx-auto p-6 max-w-6xl">
      <ProfileHeader
        adminData={adminData}
        isEditing={isEditing}
        isSubmitting={isSubmitting}
        onEditToggle={handleEditToggle}
        onSave={handleSaveProfile}
      />

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
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
