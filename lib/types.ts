export interface User {
  readonly id: string;
  username: string;
  platform: "telegram" | "whatsapp";
  role: "customer" | "admin" | "support" | "viewer";
  status: "active" | "blocked" | "flagged";
  kycStatus: "verified" | "pending" | "not_started" | "failed";
  totalTrades: number;
  joinedAt: string;
}
// export interface Trade {
//   readonly id: string;
//   readonly userId: string;
//   user: Pick<User, "username" | "platform" | "avatar">;
//   assetType: string;
//   amount: number | string | any;
//   status:
//     | "started"
//     | "awaiting_proof"
//     | "rate_set"
//     | "paid"
//     | "cancelled"
//     | "completed";
//   rate?: number;
//   payout?: number;
//   flags: Array<"missing_proof" | "suspicious" | "needs_review">;
//   adminNotes?: string;
//   readonly createdAt: string;
//   readonly updatedAt: string;
// }

export interface Trade {
  readonly id: string;
  userId: string;
  user: { username: string; platform: "telegram" | "whatsapp" };
  assetType: string;
  amount: string;
  status:
    | "started"
    | "awaiting_proof"
    | "rate_set"
    | "paid"
    | "completed"
    | "cancelled";
  rate?: number;
  payout?: number;
  readonly createdAt: string;
  readonly updatedAt: string;
  flags: string[];
  adminNotes?: string;
}

// export interface APISource {
//   readonly id: string;
//   name: string;
//   sourceUrl: string;
//   type: "gift_card" | "crypto";
//   supportedAssets: string[];
//   status: "active" | "down";
//   uptime: number;
//   lastSync: string;
//   errorCount: number;
//   priority: number;
//   autoMargin?: number;
// }

export interface Rate {
  readonly id: string;
  assetName: string;
  assetType: "crypto" | "gift_card";
  platform: "telegram" | "whatsapp" | "both";
  rate: number;
  currency: "NGN";
  source: "api" | "manual";
  autoMargin?: number;
  isActive: boolean;
  setBy: "admin" | "system";
  readonly updatedAt: string;
}

export interface DashboardMetrics {
  totalUsers: number;
  userGrowth: number;
  activeTrades: number;
  completedToday: number;
  dailyEarnings: number;
  earningsGrowth: number;
  avgTradeTime: string;
  flaggedUsers: number;
}

export interface SupportRequest {
  readonly id: string;
  user: string;
  issueType: string;
  severity: "low" | "medium" | "high" | "critical";
  status: "open" | "in_progress" | "resolved" | "escalated";
  assignedTo: string;
  readonly created: string;
  description: string;
}

export interface Alert {
  readonly id: string;
  type: "critical" | "high" | "medium" | "low";
  message: string;
  timestamp: string;
  status: "active" | "resolved";
  source: string;
}

export type ApiResponse<T> = {
  data: T;
  success: boolean;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
  };
};

export interface APIConfig {
  readonly id: string;
  name: string;
  type: "crypto" | "gift_card";
  status: "active" | "inactive" | "error";
  priority: number;
  autoMargin?: number;
  supportedAssets: string[];
  lastSync?: string;
  errorCount: number;
  uptime: number;
}
