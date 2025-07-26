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
    <div className="space-y-6 px-4 sm:px-6 md:px-0 max-w-5xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl font-semibold">
            <Shield className="h-5 w-5" />
            Administrative Permissions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {Object.entries(adminData.permissions).map(([key, value]) => (
              <div
                key={key}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border hover:shadow focus-within:ring-2 ring-primary transition-all cursor-default"
                tabIndex={0}
                role="group"
                aria-labelledby={`perm-label-${key}`}
              >
                <div className="mb-2 sm:mb-0 max-w-[calc(100%-120px)]">
                  <p
                    id={`perm-label-${key}`}
                    className="font-medium capitalize text-base sm:text-lg break-words"
                  >
                    {key.replace(/_/g, " ")}
                  </p>
                  <p className="text-sm text-muted-foreground leading-snug">
                    {
                      permissionDescriptions[
                        key as keyof typeof permissionDescriptions
                      ]
                    }
                  </p>
                </div>
                <Badge
                  variant={value ? "default" : "secondary"}
                  className={`min-w-[88px] text-center py-1 px-3 text-sm sm:text-base ${
                    value
                      ? "bg-green-600 text-white"
                      : "bg-muted text-muted-foreground"
                  } select-none rounded-full`}
                  aria-live="polite"
                  aria-atomic="true"
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
