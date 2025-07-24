"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Copy,
  User,
  Settings,
  Shield,
  Database,
  FileText,
  AlertTriangle,
  Clock,
  Code,
} from "lucide-react";
import { toast } from "sonner";

interface SystemLog {
  readonly id: string;
  timestamp: string;
  category:
    | "user_action"
    | "admin_action"
    | "system_event"
    | "security"
    | "database"
    | "api";
  action: string;
  description: string;
  userId?: string;
  username?: string;
  ipAddress?: string;
  userAgent?: string;
  severity: "info" | "warning" | "error" | "critical";
  metadata?: Record<string, any>;
}

interface SystemLogDetailsModalProps {
  log: SystemLog | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SystemLogDetailsModal({
  log,
  open,
  onOpenChange,
}: SystemLogDetailsModalProps) {
  const [activeTab, setActiveTab] = useState("details");

  if (!log) return null;

  const handleCopyId = () => {
    navigator.clipboard.writeText(log.id);
    toast.success("Log ID copied to clipboard");
  };

  const handleCopyMetadata = () => {
    if (log.metadata) {
      navigator.clipboard.writeText(JSON.stringify(log.metadata, null, 2));
      toast.success("Metadata copied to clipboard");
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "user_action":
        return <User className="h-4 w-4" />;
      case "admin_action":
        return <Shield className="h-4 w-4" />;
      case "system_event":
        return <Settings className="h-4 w-4" />;
      case "security":
        return <Shield className="h-4 w-4" />;
      case "database":
        return <Database className="h-4 w-4" />;
      case "api":
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500";
      case "error":
        return "bg-red-400";
      case "warning":
        return "bg-yellow-500";
      case "info":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString(),
      relative: getRelativeTime(date),
    };
  };

  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const dateInfo = formatDate(log.timestamp);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getCategoryIcon(log.category)}
            System Log Details
            <Badge
              variant="outline"
              className={`${getSeverityColor(
                log.severity
              )} text-white border-0 ml-2`}
            >
              {log.severity === "critical" && (
                <AlertTriangle className="h-3 w-3 mr-1" />
              )}
              {log.severity.toUpperCase()}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="metadata">Metadata</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Timestamp
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="font-mono text-sm">
                    {dateInfo.date} {dateInfo.time}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {dateInfo.relative}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    {getCategoryIcon(log.category)}
                    Category & Action
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {log.category.replace("_", " ").toUpperCase()}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Action:{" "}
                    <span className="font-mono">
                      {log.action.replace("_", " ")}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {log.username && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <User className="h-4 w-4" />
                      User Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {log.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{log.username}</span>
                    </div>
                    {log.userId && (
                      <div className="text-sm text-muted-foreground font-mono">
                        ID: {log.userId}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Network Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {log.ipAddress && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        IP Address:
                      </span>
                      <span className="font-mono text-sm">{log.ipAddress}</span>
                    </div>
                  )}
                  {log.userAgent && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">User Agent:</span>
                      <div className="font-mono text-xs mt-1 p-2 bg-muted rounded">
                        {log.userAgent}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{log.description}</p>
              </CardContent>
            </Card>

            <div className="flex gap-2">
              <Button onClick={handleCopyId} variant="outline" size="sm">
                <Copy className="h-4 w-4 mr-2" />
                Copy Log ID
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="metadata" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  Raw Metadata
                  <Button
                    onClick={handleCopyMetadata}
                    variant="outline"
                    size="sm"
                    className="ml-auto bg-transparent"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {log.metadata ? (
                  <pre className="bg-muted p-4 rounded-md text-xs overflow-x-auto">
                    {JSON.stringify(log.metadata, null, 2)}
                  </pre>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No metadata available
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Security Context
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Log ID:</span>
                    <span className="font-mono">{log.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Severity Level:
                    </span>
                    <Badge
                      variant="outline"
                      className={`${getSeverityColor(
                        log.severity
                      )} text-white border-0`}
                    >
                      {log.severity === "critical" && (
                        <AlertTriangle className="h-3 w-3 mr-1" />
                      )}
                      {log.severity.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Category:</span>
                    <span className="capitalize">
                      {log.category.replace("_", " ")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Action Type:</span>
                    <span className="font-mono">{log.action}</span>
                  </div>
                  {log.ipAddress && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Source IP:</span>
                      <span className="font-mono">{log.ipAddress}</span>
                    </div>
                  )}
                </div>

                {log.category === "security" && (
                  <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-md border border-yellow-200 dark:border-yellow-800">
                    <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="font-medium">Security Event</span>
                    </div>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                      This log entry represents a security-related event that
                      may require attention.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
