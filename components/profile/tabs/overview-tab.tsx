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
    <div className="space-y-6 px-4 sm:px-6 md:px-8 lg:px-0 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Personal Information */}
        <Card className="shadow-sm hover:shadow md:transition md:duration-300 md:ease-in-out rounded-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl font-semibold">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 px-4 sm:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <Label htmlFor="firstName" className="mb-1">
                  First Name
                </Label>
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
                  className="w-full"
                  aria-disabled={!isEditing}
                />
              </div>
              <div className="flex flex-col">
                <Label htmlFor="lastName" className="mb-1">
                  Last Name
                </Label>
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
                  className="w-full"
                  aria-disabled={!isEditing}
                />
              </div>
            </div>
            <div className="flex flex-col">
              <Label htmlFor="email" className="mb-1">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={editFormData.email}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, email: e.target.value })
                }
                disabled={!isEditing}
                className="w-full"
                aria-disabled={!isEditing}
              />
            </div>
            <div className="flex flex-col">
              <Label htmlFor="phone" className="mb-1">
                Phone
              </Label>
              <Input
                id="phone"
                value={editFormData.phone}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, phone: e.target.value })
                }
                disabled={!isEditing}
                className="w-full"
                aria-disabled={!isEditing}
              />
            </div>
            <div className="flex flex-col">
              <Label htmlFor="location" className="mb-1">
                Location
              </Label>
              <Input
                id="location"
                value={editFormData.location}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, location: e.target.value })
                }
                disabled={!isEditing}
                className="w-full"
                aria-disabled={!isEditing}
              />
            </div>
            <div className="flex flex-col">
              <Label htmlFor="bio" className="mb-1">
                Bio
              </Label>
              <Textarea
                id="bio"
                value={editFormData.bio}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, bio: e.target.value })
                }
                disabled={!isEditing}
                className="min-h-[100px] resize-none w-full"
                aria-disabled={!isEditing}
              />
            </div>
          </CardContent>
        </Card>

        {/* Account Details */}
        <Card className="shadow-sm hover:shadow md:transition md:duration-300 md:ease-in-out rounded-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl font-semibold">
              <Settings className="h-5 w-5" />
              Account Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 px-4 sm:px-6">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">User ID:</span>
              <span className="font-mono text-sm truncate max-w-[60%]">
                {adminData.id}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Username:</span>
              <span className="text-sm truncate max-w-[60%]">
                @{adminData.username}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Role:</span>
              <Badge
                variant="outline"
                className="capitalize max-w-[60%] truncate"
              >
                {adminData.role.replace("_", " ")}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Status:</span>
              <Badge
                variant="outline"
                className={`${getStatusColor(
                  adminData.status
                )} text-white border-0 max-w-[60%] truncate`}
              >
                {adminData.status}
              </Badge>
            </div>
            <Separator className="my-4" />
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Joined:</span>
              <span className="text-sm truncate max-w-[60%]">
                {formatDate(adminData.joinedAt)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Last Login:</span>
              <span className="text-sm truncate max-w-[60%]">
                {formatDateTime(adminData.lastLogin)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Timezone:</span>
              <span className="text-sm truncate max-w-[60%]">
                {adminData.timezone}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Stats */}
      <Card className="shadow-sm hover:shadow md:transition md:duration-300 md:ease-in-out rounded-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl font-semibold">
            <Activity className="h-5 w-5" />
            Activity Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 truncate">
                {adminData.activityStats.totalLogins.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Total Logins</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 truncate">
                {adminData.activityStats.averageSessionTime}
              </div>
              <div className="text-sm text-muted-foreground">Avg Session</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 truncate">
                {getDaysSince(adminData.activityStats.lastPasswordChange)}d
              </div>
              <div className="text-sm text-muted-foreground">
                Since Password Change
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-red-600 truncate">
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
