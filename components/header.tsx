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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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

export function Header() {
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
    if (checked) {
      setIsMaintenanceModalOpen(true);
    } else {
      setMaintenanceMode(false);
    }
  };

  const confirmMaintenanceMode = () => {
    setMaintenanceMode(true);
    setIsMaintenanceModalOpen(false);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "alert":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "info":
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getThemeIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="h-4 w-4" />;
      case "dark":
        return <Moon className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  if (!mounted) {
    return (
      <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4 sticky top-0 z-50">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="flex flex-1 items-center justify-end">
          <Button variant="ghost" size="icon" disabled>
            <Sun className="h-4 w-4" />
          </Button>
        </div>
      </header>
    );
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4 sticky top-0 z-50 backdrop-blur-sm">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />

        {/* Logo and System Status */}
        <div className="flex items-center gap-2 md:gap-4 flex-1">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <span className="text-sm font-bold font-poppins">S</span>
            </div>
            <div className="hidden sm:block">
              <div className="font-semibold font-poppins">Swiftlify</div>
              <div className="text-xs text-muted-foreground">
                Admin Dashboard
              </div>
            </div>
          </div>

          {/* Environment and Status Badges */}
          <div className="flex items-center gap-2">
            <Badge
              variant="default"
              className="bg-green-500 text-white text-xs"
            >
              LIVE
            </Badge>
            {maintenanceMode ? (
              <Badge variant="destructive" className="animate-pulse text-xs">
                <Wrench className="h-3 w-3 mr-1" />
                <span className="hidden sm:inline">MAINTENANCE</span>
              </Badge>
            ) : (
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-xs text-muted-foreground hidden md:inline">
                  System Online
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-1 md:gap-2">
          {/* Theme Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                {getThemeIcon()}
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-background border border-border"
            >
              <DropdownMenuLabel>Theme</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <Sun className="mr-2 h-4 w-4" />
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                <Moon className="mr-2 h-4 w-4" />
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                <Monitor className="mr-2 h-4 w-4" />
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Maintenance Mode Toggle - Only for Super Admin */}
          <div className="hidden lg:flex items-center gap-2">
            <Label
              htmlFor="maintenance-toggle"
              className="text-xs text-muted-foreground"
            >
              Maintenance
            </Label>
            <Switch
              id="maintenance-toggle"
              checked={maintenanceMode}
              onCheckedChange={handleMaintenanceToggle}
              className="data-[state=checked]:bg-red-500"
            />
          </div>

          <Separator orientation="vertical" className="h-4" />

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                {notifications.length > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs"
                  >
                    {notifications.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-80 bg-background border border-border"
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
                    className="flex items-start gap-3 p-3"
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

          {/* System Status */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <Activity className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-64 bg-background border border-border"
            >
              <DropdownMenuLabel>System Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="p-3 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Database</span>
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span className="text-xs text-green-600">Online</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Telegram Bot</span>
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span className="text-xs text-green-600">Connected</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">WhatsApp Bot</span>
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span className="text-xs text-green-600">Connected</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">API Services</span>
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                    <span className="text-xs text-yellow-600">Degraded</span>
                  </div>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
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
            >
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    David Taiwo
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    david@swiftlify.com
                  </p>
                  <Badge variant="outline" className="w-fit mt-1">
                    <Shield className="h-3 w-3 mr-1" />
                    Super Admin
                  </Badge>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Maintenance Mode Confirmation Dialog */}
      <Dialog
        open={isMaintenanceModalOpen}
        onOpenChange={setIsMaintenanceModalOpen}
      >
        <DialogContent className="bg-background border border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Enable Maintenance Mode
            </DialogTitle>
            <DialogDescription>
              This will temporarily disable the platform for all users. Only
              administrators will be able to access the system.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400 mb-2">
              <Wrench className="h-4 w-4" />
              <span className="font-medium">Impact:</span>
            </div>
            <ul className="text-sm text-red-600 dark:text-red-400 space-y-1">
              <li>• All user trading will be suspended</li>
              <li>• Bots will show maintenance messages</li>
              <li>• New registrations will be disabled</li>
              <li>• API endpoints will return maintenance status</li>
            </ul>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsMaintenanceModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmMaintenanceMode}>
              Enable Maintenance Mode
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
