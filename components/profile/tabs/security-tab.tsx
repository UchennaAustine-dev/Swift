"use client";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Lock, Shield, Key } from "lucide-react";
import { AdminUser, PreferenceCategory } from "@/types/profile";
import { getDaysSince, formatDateTime } from "@/utils/profileUtils";

interface SecurityTabProps {
  adminData: AdminUser;
  onPreferenceChange: <T extends PreferenceCategory>(
    category: T,
    key: string,
    value: any
  ) => void;
  onPasswordModalOpen: () => void;
}

export function SecurityTab({
  adminData,
  onPreferenceChange,
  onPasswordModalOpen,
}: SecurityTabProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Password & Authentication */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Password & Authentication
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Password</p>
                <p className="text-sm text-muted-foreground">
                  Last changed{" "}
                  {getDaysSince(adminData.activityStats.lastPasswordChange)}{" "}
                  days ago
                </p>
              </div>
              <Button variant="outline" onClick={onPasswordModalOpen}>
                <Key className="h-4 w-4 mr-2" />
                Change Password
              </Button>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Two-Factor Authentication</p>
                <p className="text-sm text-muted-foreground">
                  Add an extra layer of security
                </p>
              </div>
              <Switch
                checked={adminData.preferences.security.twoFactorEnabled}
                onCheckedChange={(checked) =>
                  onPreferenceChange("security", "twoFactorEnabled", checked)
                }
              />
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Session Timeout</p>
                <p className="text-sm text-muted-foreground">
                  Auto-logout after inactivity
                </p>
              </div>
              <Select
                value={adminData.preferences.security.sessionTimeout.toString()}
                onValueChange={(value) =>
                  onPreferenceChange(
                    "security",
                    "sessionTimeout",
                    parseInt(value)
                  )
                }
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Security Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last Login:</span>
              <span>{formatDateTime(adminData.lastLogin)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                Failed Login Attempts:
              </span>
              <span>0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Active Sessions:</span>
              <span>1</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">IP Restriction:</span>
              <Switch
                checked={adminData.preferences.security.ipRestriction}
                onCheckedChange={(checked) =>
                  onPreferenceChange("security", "ipRestriction", checked)
                }
              />
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Current IP:</span>
              <span className="font-mono text-sm">192.168.1.100</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
