// "use client";

// import type * as React from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import {
//   Home,
//   Users,
//   ArrowLeftRight,
//   Gift,
//   Bitcoin,
//   TrendingUp,
//   UserCog,
//   DollarSign,
//   AlertTriangle,
//   Bot,
//   FileText,
//   Settings,
// } from "lucide-react";
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarFooter,
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarGroupLabel,
//   SidebarHeader,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
//   SidebarMenuBadge,
//   SidebarRail,
// } from "@/components/ui/sidebar";
// import { Badge } from "@/components/ui/badge";
// import { cn } from "@/lib/utils";

// const navigationItems = [
//   {
//     title: "Dashboard",
//     url: "/",
//     icon: Home,
//   },
//   {
//     title: "Users",
//     url: "/users",
//     icon: Users,
//     badge: "1234",
//   },
//   {
//     title: "Trades",
//     url: "/trades",
//     icon: ArrowLeftRight,
//     badge: "23",
//   },
//   {
//     title: "Gift Card API",
//     url: "/gift-card-api",
//     icon: Gift,
//   },
//   {
//     title: "Crypto API",
//     url: "/crypto-api",
//     icon: Bitcoin,
//   },
//   {
//     title: "Rate Management",
//     url: "/rates",
//     icon: TrendingUp,
//   },
//   {
//     title: "Admin Management",
//     url: "/admins",
//     icon: UserCog,
//   },
//   {
//     title: "Payout Logs",
//     url: "/payouts",
//     icon: DollarSign,
//     badge: "5",
//   },
//   {
//     title: "Support & Alerts",
//     url: "/support",
//     icon: AlertTriangle,
//   },
//   {
//     title: "Bot Logs",
//     url: "/bot-logs",
//     icon: Bot,
//   },
//   {
//     title: "System Logs",
//     url: "/system-logs",
//     icon: FileText,
//   },
//   {
//     title: "Settings",
//     url: "/settings",
//     icon: Settings,
//   },
// ];

// export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
//   const pathname = usePathname();

//   return (
//     <Sidebar
//       variant="inset"
//       className="bg-sidebar border-r border-sidebar-border"
//       {...props}
//     >
//       <SidebarHeader className="bg-sidebar border-b border-sidebar-border">
//         <div className="flex items-center gap-2 px-4 py-2">
//           <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
//             <span className="text-sm font-bold font-poppins">S</span>
//           </div>
//           <div className="grid flex-1 text-left text-sm leading-tight">
//             <span className="truncate font-semibold font-poppins text-sidebar-foreground">
//               Swiftlify
//             </span>
//             <span className="truncate text-xs text-sidebar-foreground/70">
//               Admin Dashboard
//             </span>
//           </div>
//           <Badge
//             variant="secondary"
//             className="text-xs bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
//           >
//             LIVE
//           </Badge>
//         </div>
//       </SidebarHeader>
//       <SidebarContent className="bg-sidebar">
//         <SidebarGroup>
//           <SidebarGroupLabel className="text-sidebar-foreground/70">
//             Navigation
//           </SidebarGroupLabel>
//           <SidebarGroupContent>
//             <SidebarMenu>
//               {navigationItems.map((item) => {
//                 const isActive = pathname === item.url;
//                 return (
//                   <SidebarMenuItem key={item.title}>
//                     <SidebarMenuButton
//                       asChild
//                       isActive={isActive}
//                       className={cn(
//                         "text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent",
//                         isActive &&
//                           "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
//                       )}
//                     >
//                       <Link href={item.url}>
//                         <item.icon
//                           className={cn(
//                             "h-4 w-4",
//                             isActive && "text-primary-foreground"
//                           )}
//                         />
//                         <span
//                           className={cn(
//                             isActive && "text-primary-foreground font-medium"
//                           )}
//                         >
//                           {item.title}
//                         </span>
//                       </Link>
//                     </SidebarMenuButton>
//                     {item.badge && (
//                       <SidebarMenuBadge
//                         className={cn(
//                           "bg-primary text-primary-foreground",
//                           isActive && "bg-primary-foreground text-primary"
//                         )}
//                       >
//                         {item.badge}
//                       </SidebarMenuBadge>
//                     )}
//                   </SidebarMenuItem>
//                 );
//               })}
//             </SidebarMenu>
//           </SidebarGroupContent>
//         </SidebarGroup>
//       </SidebarContent>
//       <SidebarFooter className="bg-sidebar border-t border-sidebar-border">
//         <div className="p-4 text-xs text-sidebar-foreground/70">
//           <div className="flex items-center gap-2">
//             <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
//             <span>System Online</span>
//           </div>
//         </div>
//       </SidebarFooter>
//       <SidebarRail />
//     </Sidebar>
//   );
// }

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
import { cn } from "@/lib/utils";

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
    <Sidebar
      variant="inset"
      className="bg-sidebar border-r border-sidebar-border"
      {...props}
    >
      <SidebarHeader className="bg-sidebar border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="text-sm font-bold font-poppins">S</span>
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold font-poppins text-sidebar-foreground">
              Swiftlify
            </span>
            <span className="truncate text-xs text-sidebar-foreground/70">
              Admin Dashboard
            </span>
          </div>
          <Badge
            variant="secondary"
            className="text-xs bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400"
          >
            LIVE
          </Badge>
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-sidebar">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-3">
              {navigationItems.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={item.url}
                        className={cn(
                          "flex items-center gap-5 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
                          "text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent/80",
                          isActive && [
                            "bg-blue-600 text-white shadow-md",
                            "dark:bg-blue-500 dark:text-white",
                            "hover:bg-blue-700 hover:text-white",
                            "dark:hover:bg-blue-600 dark:hover:text-white",
                          ]
                        )}
                      >
                        <item.icon
                          className={cn("h-4 w-4", isActive && "text-white")}
                        />
                        <span
                          className={cn(isActive && "text-white font-semibold")}
                        >
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                    {item.badge && (
                      <SidebarMenuBadge
                        className={cn(
                          "ml-auto",
                          isActive
                            ? "bg-white/20 text-white border-white/30"
                            : "bg-primary/10 text-primary border-primary/20"
                        )}
                      >
                        {item.badge}
                      </SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="bg-sidebar border-t border-sidebar-border">
        <div className="p-4 text-xs text-sidebar-foreground/70">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
            <span>System Online</span>
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
