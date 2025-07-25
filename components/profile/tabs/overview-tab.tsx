"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { User, Settings, Activity } from "lucide-react";
import { AdminUser, EditFormData } from "@/types/profile";
import {
  getRoleColor,
  getStatusColor,
  formatDate,
  formatDateTime,
  getDaysSince,
} from "@/utils/profileUtils";

interface OverviewTabProps {
  adminData: AdminUser;
  editFormData: EditFormData;
  setEditFormData: (data: EditFormData) => void;
  isEditing: boolean;
}

export function OverviewTab({
  adminData,
  editFormData,
  setEditFormData,
  isEditing,
}: OverviewTabProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={editFormData.firstName}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      firstName: e.target.value,
                    })
                  }
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={editFormData.lastName}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      lastName: e.target.value,
                    })
                  }
                  disabled={!isEditing}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={editFormData.email}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    email: e.target.value,
                  })
                }
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={editFormData.phone}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    phone: e.target.value,
                  })
                }
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={editFormData.location}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    location: e.target.value,
                  })
                }
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={editFormData.bio}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    bio: e.target.value,
                  })
                }
                disabled={!isEditing}
                className="min-h-[80px]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Account Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Account Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">User ID:</span>
              <span className="font-mono text-sm">{adminData.id}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Username:</span>
              <span className="text-sm">@{adminData.username}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Role:</span>
              <Badge variant="outline">
                {adminData.role.replace("_", " ")}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Status:</span>
              <Badge
                variant="outline"
                className={`${getStatusColor(
                  adminData.status
                )} text-white border-0`}
              >
                {adminData.status}
              </Badge>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Joined:</span>
              <span className="text-sm">{formatDate(adminData.joinedAt)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Last Login:</span>
              <span className="text-sm">
                {formatDateTime(adminData.lastLogin)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Timezone:</span>
              <span className="text-sm">{adminData.timezone}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Activity Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600">
                {adminData.activityStats.totalLogins.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Total Logins</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">
                {adminData.activityStats.averageSessionTime}
              </div>
              <div className="text-sm text-muted-foreground">Avg Session</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600">
                {getDaysSince(adminData.activityStats.lastPasswordChange)}d
              </div>
              <div className="text-sm text-muted-foreground">
                Since Password Change
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-red-600">
                {adminData.activityStats.securityIncidents}
              </div>
              <div className="text-sm text-muted-foreground">
                Security Incidents
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
