// data/profileData.ts
import { AdminUser } from "@/types/profile";

export const mockAdminData: AdminUser = {
  id: "admin_001",
  username: "david.taiwo",
  firstName: "David",
  lastName: "Taiwo",
  email: "david@swiftlify.com",
  phone: "+234 816 123 4567",
  role: "super_admin",
  status: "active",
  joinedAt: "2023-01-15T10:30:00Z",
  lastLogin: "2024-01-20T14:22:00Z",
  location: "Lagos, Nigeria",
  timezone: "Africa/Lagos",
  avatar: null,
  bio: "Experienced fintech professional with a passion for building secure and scalable trading platforms.",
  permissions: {
    user_management: true,
    system_maintenance: true,
    financial_oversight: true,
    security_admin: true,
    audit_access: true,
  },
  preferences: {
    notifications: {
      email: true,
      push: true,
      sms: false,
      marketing: false,
    },
    security: {
      twoFactorEnabled: false,
      sessionTimeout: 30,
      ipRestriction: false,
    },
    display: {
      theme: "system",
      language: "en",
      timezone: "Africa/Lagos",
    },
  },
  activityStats: {
    totalLogins: 1247,
    averageSessionTime: "2.5h",
    lastPasswordChange: "2023-12-01T09:15:00Z",
    securityIncidents: 0,
  },
};
