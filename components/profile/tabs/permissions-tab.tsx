"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";
import { AdminUser } from "@/types/profile";

interface PermissionsTabProps {
  adminData: AdminUser;
}

const permissionDescriptions = {
  user_management: "Create, edit, and manage user accounts",
  system_maintenance: "Access maintenance mode and system controls",
  financial_oversight: "View financial reports and transaction data",
  security_admin: "Manage security settings and audit logs",
  audit_access: "Access system audit trails and logs",
};

export function PermissionsTab({ adminData }: PermissionsTabProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Administrative Permissions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(adminData.permissions).map(([key, value]) => (
              <div
                key={key}
                className="flex items-center justify-between p-3 rounded-lg border"
              >
                <div>
                  <p className="font-medium capitalize">
                    {key.replace("_", " ")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {
                      permissionDescriptions[
                        key as keyof typeof permissionDescriptions
                      ]
                    }
                  </p>
                </div>
                <Badge
                  variant={value ? "default" : "secondary"}
                  className={value ? "bg-green-500" : ""}
                >
                  {value ? "Granted" : "Denied"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
