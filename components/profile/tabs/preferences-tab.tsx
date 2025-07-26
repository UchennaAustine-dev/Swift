"use client";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bell, Globe } from "lucide-react";
import { AdminUser, PreferenceCategory } from "@/types/profile";

interface PreferencesTabProps {
  adminData: AdminUser;
  onPreferenceChange: <T extends PreferenceCategory>(
    category: T,
    key: string,
    value: any
  ) => void;
}

export function PreferencesTab({
  adminData,
  onPreferenceChange,
}: PreferencesTabProps) {
  return (
    <div className="space-y-6 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Notification Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl font-semibold">
              <Bell className="h-5 w-5" />
              Notification Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 px-4 sm:px-6">
            {[
              {
                key: "email",
                label: "Email Notifications",
                description: "Receive notifications via email",
              },
              {
                key: "push",
                label: "Push Notifications",
                description: "Browser push notifications",
              },
              {
                key: "sms",
                label: "SMS Notifications",
                description: "Critical alerts via SMS",
              },
              {
                key: "marketing",
                label: "Marketing Communications",
                description: "Product updates and news",
              },
            ].map(({ key, label, description }) => (
              <div
                key={key}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div>
                  <p className="font-medium">{label}</p>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
                <Switch
                  checked={
                    adminData.preferences.notifications[
                      key as keyof typeof adminData.preferences.notifications
                    ]
                  }
                  onCheckedChange={(checked) =>
                    onPreferenceChange("notifications", key, checked)
                  }
                  aria-label={label}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Display Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl font-semibold">
              <Globe className="h-5 w-5" />
              Display Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 px-4 sm:px-6 max-w-full">
            <div className="space-y-4 max-w-full">
              <Label htmlFor="theme" className="block font-medium">
                Theme
              </Label>
              <Select
                value={adminData.preferences.display.theme}
                onValueChange={(value) =>
                  onPreferenceChange("display", "theme", value)
                }
              >
                <SelectTrigger
                  id="theme"
                  className="w-full min-w-[12rem]"
                  aria-label="Theme selection"
                >
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4 max-w-full">
              <Label htmlFor="language" className="block font-medium">
                Language
              </Label>
              <Select
                value={adminData.preferences.display.language}
                onValueChange={(value) =>
                  onPreferenceChange("display", "language", value)
                }
              >
                <SelectTrigger
                  id="language"
                  className="w-full min-w-[12rem]"
                  aria-label="Language selection"
                >
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4 max-w-full">
              <Label htmlFor="timezone" className="block font-medium">
                Timezone
              </Label>
              <Select
                value={adminData.preferences.display.timezone}
                onValueChange={(value) =>
                  onPreferenceChange("display", "timezone", value)
                }
              >
                <SelectTrigger
                  id="timezone"
                  className="w-full min-w-[12rem]"
                  aria-label="Timezone selection"
                >
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Africa/Lagos">Lagos (GMT+1)</SelectItem>
                  <SelectItem value="America/New_York">
                    New York (GMT-5)
                  </SelectItem>
                  <SelectItem value="Europe/London">London (GMT+0)</SelectItem>
                  <SelectItem value="Asia/Tokyo">Tokyo (GMT+9)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
