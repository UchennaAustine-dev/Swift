"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, User, Shield, Lock, Settings } from "lucide-react";

const mockActivityData = [
  {
    action: "Profile Updated",
    description: "Changed email address",
    time: "2 hours ago",
    icon: User,
    color: "text-blue-600",
  },
  {
    action: "Security Settings Modified",
    description: "Enabled two-factor authentication",
    time: "1 day ago",
    icon: Shield,
    color: "text-green-600",
  },
  {
    action: "System Login",
    description: "Logged in from Lagos, Nigeria",
    time: "2 days ago",
    icon: Activity,
    color: "text-gray-600",
  },
  {
    action: "Password Changed",
    description: "Password updated successfully",
    time: "1 week ago",
    icon: Lock,
    color: "text-purple-600",
  },
  {
    action: "Maintenance Mode Enabled",
    description: "System maintenance performed",
    time: "2 weeks ago",
    icon: Settings,
    color: "text-orange-600",
  },
];

export function ActivityTab() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockActivityData.map((activity, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className={`p-2 rounded-full bg-muted ${activity.color}`}>
                  <activity.icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">
                    {activity.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
