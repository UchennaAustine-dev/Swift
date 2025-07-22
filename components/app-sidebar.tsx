"use client";

import type * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Users,
  ArrowLeftRight,
  Gift,
  Bitcoin,
  TrendingUp,
  UserCog,
  DollarSign,
  AlertTriangle,
  Bot,
  FileText,
  Settings,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuBadge,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";

const navigationItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Users",
    url: "/users",
    icon: Users,
    badge: "1234",
  },
  {
    title: "Trades",
    url: "/trades",
    icon: ArrowLeftRight,
    badge: "23",
  },
  {
    title: "Gift Card API",
    url: "/gift-card-api",
    icon: Gift,
  },
  {
    title: "Crypto API",
    url: "/crypto-api",
    icon: Bitcoin,
  },
  {
    title: "Rate Management",
    url: "/rates",
    icon: TrendingUp,
  },
  {
    title: "Admin Management",
    url: "/admins",
    icon: UserCog,
  },
  {
    title: "Payout Logs",
    url: "/payouts",
    icon: DollarSign,
    badge: "5",
  },
  {
    title: "Support & Alerts",
    url: "/support",
    icon: AlertTriangle,
  },
  {
    title: "Bot Logs",
    url: "/bot-logs",
    icon: Bot,
  },
  {
    title: "System Logs",
    url: "/system-logs",
    icon: FileText,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-900 text-primary-foreground">
            <span className="text-sm font-bold">S</span>
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">Swiftlify</span>
            <span className="truncate text-xs text-muted-foreground">
              Admin Dashboard
            </span>
          </div>
          <Badge variant="secondary" className="text-xs">
            LIVE
          </Badge>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                  {item.badge && (
                    <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <span>System Online</span>
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
