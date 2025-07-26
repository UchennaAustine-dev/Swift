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
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notification Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-muted-foreground">
                  Receive notifications via email
                </p>
              </div>
              <Switch
                checked={adminData.preferences.notifications.email}
                onCheckedChange={(checked) =>
                  onPreferenceChange("notifications", "email", checked)
                }
              />
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Push Notifications</p>
                <p className="text-sm text-muted-foreground">
                  Browser push notifications
                </p>
              </div>
              <Switch
                checked={adminData.preferences.notifications.push}
                onCheckedChange={(checked) =>
                  onPreferenceChange("notifications", "push", checked)
                }
              />
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">SMS Notifications</p>
                <p className="text-sm text-muted-foreground">
                  Critical alerts via SMS
                </p>
              </div>
              <Switch
                checked={adminData.preferences.notifications.sms}
                onCheckedChange={(checked) =>
                  onPreferenceChange("notifications", "sms", checked)
                }
              />
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Marketing Communications</p>
                <p className="text-sm text-muted-foreground">
                  Product updates and news
                </p>
              </div>
              <Switch
                checked={adminData.preferences.notifications.marketing}
                onCheckedChange={(checked) =>
                  onPreferenceChange("notifications", "marketing", checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Display Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Display Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Theme</Label>
              <Select
                value={adminData.preferences.display.theme}
                onValueChange={(value) =>
                  onPreferenceChange("display", "theme", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Language</Label>
              <Select
                value={adminData.preferences.display.language}
                onValueChange={(value) =>
                  onPreferenceChange("display", "language", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Timezone</Label>
              <Select
                value={adminData.preferences.display.timezone}
                onValueChange={(value) =>
                  onPreferenceChange("display", "timezone", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
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
