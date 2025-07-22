"use client";

import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";

interface ActivityItem {
  id: string;
  type: "trade" | "user" | "system";
  user?: string;
  action: string;
  details: string;
  timestamp: string;
  status?: "success" | "warning" | "error";
}

const mockActivity: ActivityItem[] = [
  {
    id: "1",
    type: "trade",
    user: "john_trader",
    action: "Trade Completed",
    details: "Bitcoin trade for ₦2,500,000",
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    status: "success",
  },
  {
    id: "2",
    type: "user",
    user: "sarah_crypto",
    action: "KYC Submitted",
    details: "Documents uploaded for verification",
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    status: "warning",
  },
  {
    id: "3",
    type: "trade",
    user: "mike_cards",
    action: "Trade Started",
    details: "Amazon Gift Card ₦50,000",
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: "4",
    type: "system",
    action: "Rate Updated",
    details: "Bitcoin rate updated to ₦65,500,000",
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
  },
  {
    id: "5",
    type: "trade",
    user: "alex_eth",
    action: "Payment Failed",
    details: "Ethereum payout failed - bank error",
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    status: "error",
  },
];

export function RecentActivity() {
  return (
    <div className="space-y-3">
      {mockActivity.slice(0, 4).map((item) => (
        <div
          key={item.id}
          className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
        >
          {item.user ? (
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-xs">
                {item.user.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          ) : (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted">
              <span className="text-xs font-semibold">SYS</span>
            </div>
          )}
          <div className="flex-1 space-y-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-xs truncate">
                {item.action}
              </span>
              {item.status && (
                <Badge
                  variant={
                    item.status === "success"
                      ? "default"
                      : item.status === "warning"
                      ? "secondary"
                      : "destructive"
                  }
                  className="text-xs px-1 py-0"
                >
                  {item.status}
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground truncate">
              {item.details}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(item.timestamp), {
                addSuffix: true,
              })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
