"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  Settings,
  User,
  LogOut,
  Shield,
  Activity,
  AlertTriangle,
  CheckCircle,
  Wrench,
  Monitor,
  Sun,
  Moon,
} from "lucide-react";
import { MaintenanceModeModal } from "./modals/maintenance-mode-modal";
import { useRouter } from "next/navigation";

export function Header() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
  const [notifications] = useState([
    {
      id: 1,
      type: "alert",
      message: "3 trades awaiting proof",
      time: "2 min ago",
    },
    {
      id: 2,
      type: "warning",
      message: "API rate limit approaching",
      time: "5 min ago",
    },
    {
      id: 3,
      type: "info",
      message: "Daily backup completed",
      time: "1 hour ago",
    },
  ]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMaintenanceToggle = (checked: boolean) => {
    setIsMaintenanceModalOpen(true);
  };

  const handleMaintenanceConfirm = (enabled: boolean, message?: string) => {
    setMaintenanceMode(enabled);
    // TODO: send maintenance status and message to backend
    console.log(
      `Maintenance mode ${enabled ? "enabled" : "disabled"}`,
      message
    );
    setIsMaintenanceModalOpen(false);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "alert":
        return (
          <AlertTriangle
            className="h-4 w-4 text-red-500"
            aria-label="Alert notification"
          />
        );
      case "warning":
        return (
          <AlertTriangle
            className="h-4 w-4 text-yellow-500"
            aria-label="Warning notification"
          />
        );
      case "info":
        return (
          <CheckCircle
            className="h-4 w-4 text-blue-500"
            aria-label="Info notification"
          />
        );
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getThemeIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="h-4 w-4" aria-hidden="true" />;
      case "dark":
        return <Moon className="h-4 w-4" aria-hidden="true" />;
      default:
        return <Monitor className="h-4 w-4" aria-hidden="true" />;
    }
  };

  if (!mounted) {
    return (
      <header className="flex h-16 items-center gap-2 border-b bg-background px-4 sticky top-0 z-50">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="flex flex-1 items-center justify-end">
          <Button
            variant="ghost"
            size="icon"
            disabled
            aria-label="Loading theme toggle"
          >
            <Sun className="h-4 w-4" />
          </Button>
        </div>
      </header>
    );
  }

  return (
    <>
      <header
        className="flex h-16 items-center gap-2 border-b bg-background px-4 sticky top-0 z-50 backdrop-blur-sm select-none"
        role="banner"
      >
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />

        {/* Logo and System Status */}
        <div className="flex items-center gap-2 md:gap-4 flex-1">
          <div
            className="flex items-center gap-2 cursor-default select-text"
            tabIndex={-1}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <span className="text-sm font-bold font-poppins">S</span>
            </div>
            <div className="hidden sm:block leading-tight">
              <div className="font-semibold font-poppins select-text">
                Swiftlify
              </div>
              <div className="text-xs text-muted-foreground select-text">
                Admin Dashboard
              </div>
            </div>
          </div>

          {/* Environment and Status Badges */}
          <div className="flex items-center gap-2">
            <Badge
              variant="default"
              className="bg-green-500 text-white text-xs cursor-default select-none"
              aria-label="Environment live status"
            >
              LIVE
            </Badge>
            {maintenanceMode ? (
              <Badge
                variant="destructive"
                className="animate-pulse text-xs flex items-center cursor-default select-none"
                aria-live="polite"
                aria-label="Maintenance mode active"
              >
                <Wrench className="h-3 w-3 mr-1" aria-hidden="true" />
                <span className="hidden sm:inline">MAINTENANCE</span>
              </Badge>
            ) : (
              <div
                className="flex items-center gap-1 cursor-default select-none"
                aria-label="System online status"
              >
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-xs text-muted-foreground hidden md:inline">
                  System Online
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-1 md:gap-2">
          {/* Theme Toggle Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                aria-label={`Current theme: ${theme}. Open theme settings`}
                className="hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {getThemeIcon()}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-background border border-border"
              sideOffset={4}
            >
              <DropdownMenuLabel>Theme</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setTheme("light")}
                className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Sun className="mr-2 h-4 w-4" />
                Light
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTheme("dark")}
                className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Moon className="mr-2 h-4 w-4" />
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTheme("system")}
                className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Monitor className="mr-2 h-4 w-4" />
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Maintenance Mode Toggle (Only visible on lg+) */}
          <div className="hidden lg:flex items-center gap-2 select-none">
            <Label
              htmlFor="maintenance-toggle"
              className="text-xs text-muted-foreground cursor-help"
              title="Enable maintenance mode to take the system offline for upgrades or fixes"
            >
              Maintenance
            </Label>
            <Switch
              id="maintenance-toggle"
              checked={maintenanceMode}
              onCheckedChange={handleMaintenanceToggle}
              className="data-[state=checked]:bg-red-500"
              aria-checked={maintenanceMode}
              aria-label="Toggle maintenance mode"
            />
          </div>

          <Separator orientation="vertical" className="h-4" />

          {/* Notifications Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="relative"
                aria-label={`You have ${notifications.length} notifications`}
              >
                <Bell className="h-4 w-4" aria-hidden="true" />
                {notifications.length > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs animate-pulse"
                    aria-live="assertive"
                    aria-atomic="true"
                  >
                    {notifications.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-80 bg-background border border-border"
              sideOffset={4}
            >
              <DropdownMenuLabel className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notifications
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className="flex items-start gap-3 p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                  >
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1 space-y-1">
                      <p className="text-sm">{notification.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {notification.time}
                      </p>
                    </div>
                  </DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem disabled>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle className="h-4 w-4" />
                    No new notifications
                  </div>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-center">
                <Button variant="ghost" size="sm" className="w-full">
                  View All Notifications
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* System Status Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                aria-label="View system status"
                className="hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <Activity className="h-4 w-4" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-64 bg-background border border-border"
              sideOffset={4}
            >
              <DropdownMenuLabel>System Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="p-3 space-y-3 text-sm">
                <StatusItem label="Database" status="Online" color="green" />
                <StatusItem
                  label="Telegram Bot"
                  status="Connected"
                  color="green"
                />
                <StatusItem
                  label="WhatsApp Bot"
                  status="Connected"
                  color="green"
                />
                <StatusItem
                  label="API Services"
                  status="Degraded"
                  color="yellow"
                />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-8 w-8 rounded-full hover:ring-2 hover:ring-primary focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="User menu"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    DT
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 bg-background border border-border"
              align="end"
              forceMount
              sideOffset={4}
            >
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1 px-2 py-1 select-none">
                  <p className="text-sm font-medium leading-none">
                    David Taiwo
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    david@swiftlify.com
                  </p>
                  <Badge
                    variant="outline"
                    className="w-fit mt-1 flex items-center gap-1 select-none cursor-default"
                    aria-label="User role Super Admin"
                  >
                    <Shield className="h-3 w-3" aria-hidden="true" />
                    Super Admin
                  </Badge>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => router.push("/profile")}
                className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                Profile{" "}
                <kbd className="ml-auto rounded border bg-muted px-1 text-xs font-sans">
                  P
                </kbd>
              </DropdownMenuItem>
              {/* Disabled Settings now */}
              {/* <DropdownMenuItem disabled className="opacity-50 cursor-default flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </DropdownMenuItem> */}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer text-red-600 hover:bg-red-50 dark:hover:bg-red-900 transition-colors flex items-center gap-2"
                onClick={() => {
                  // Add logout logic here
                  alert("Logging out...");
                }}
                aria-label="Log out"
              >
                <LogOut className="h-4 w-4" />
                Log out{" "}
                <kbd className="ml-auto rounded border bg-muted px-1 text-xs font-sans">
                  L
                </kbd>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Maintenance Mode Confirmation Dialog */}
      <MaintenanceModeModal
        isOpen={isMaintenanceModalOpen}
        onClose={() => setIsMaintenanceModalOpen(false)}
        currentMode={maintenanceMode}
        onConfirm={handleMaintenanceConfirm}
      />
    </>
  );
}

// Helper component for status indicator items
function StatusItem({
  label,
  status,
  color,
}: {
  label: string;
  status: string;
  color: "green" | "yellow" | "red";
}) {
  const colorClass =
    color === "green"
      ? "bg-green-500 text-green-700"
      : color === "yellow"
      ? "bg-yellow-500 text-yellow-700"
      : "bg-red-500 text-red-700";

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm">{label}</span>
      <div className="flex items-center gap-1">
        <div className={`h-2 w-2 rounded-full ${colorClass}`} />
        <span className={`text-xs font-medium ${colorClass}`}>{status}</span>
      </div>
    </div>
  );
}
