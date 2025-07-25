// types/profile.ts
export interface AdminUser {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: "super_admin" | "admin" | "moderator";
  status: "active" | "inactive" | "suspended";
  joinedAt: string;
  lastLogin: string;
  location: string;
  timezone: string;
  avatar: string | null;
  bio: string;
  permissions: {
    user_management: boolean;
    system_maintenance: boolean;
    financial_oversight: boolean;
    security_admin: boolean;
    audit_access: boolean;
  };
  preferences: {
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
      marketing: boolean;
    };
    security: {
      twoFactorEnabled: boolean;
      sessionTimeout: number;
      ipRestriction: boolean;
    };
    display: {
      theme: string;
      language: string;
      timezone: string;
    };
  };
  activityStats: {
    totalLogins: number;
    averageSessionTime: string;
    lastPasswordChange: string;
    securityIncidents: number;
  };
}

export interface EditFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
  location: string;
}

export interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ShowPasswords {
  current: boolean;
  new: boolean;
  confirm: boolean;
}

export type PreferenceCategory = keyof AdminUser["preferences"];
export type PreferenceKey<T extends PreferenceCategory> =
  keyof AdminUser["preferences"][T];
