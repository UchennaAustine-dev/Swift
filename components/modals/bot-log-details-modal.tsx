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
import { Copy, Bot, MessageSquare, Clock, User, Code } from "lucide-react";
import { toast } from "sonner";

interface BotLog {
  readonly id: string;
  timestamp: string;
  botType: "telegram" | "whatsapp";
  level: "info" | "warning" | "error" | "debug";
  event: string;
  message: string;
  userId?: string;
  username?: string;
  tradeId?: string;
  responseTime?: number;
  errorCode?: string;
  metadata?: Record<string, any>;
}

interface BotLogDetailsModalProps {
  log: BotLog | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BotLogDetailsModal({
  log,
  open,
  onOpenChange,
}: BotLogDetailsModalProps) {
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

  const getLevelColor = (level: string) => {
    switch (level) {
      case "error":
        return "bg-red-500";
      case "warning":
        return "bg-yellow-500";
      case "info":
        return "bg-blue-500";
      case "debug":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const getBotIcon = (botType: string) => {
    return botType === "telegram" ? (
      <Bot className="h-4 w-4" />
    ) : (
      <MessageSquare className="h-4 w-4" />
    );
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
            {getBotIcon(log.botType)}
            Bot Log Details
            <Badge
              variant="outline"
              className={`${getLevelColor(log.level)} text-white border-0 ml-2`}
            >
              {log.level.toUpperCase()}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="metadata">Metadata</TabsTrigger>
            <TabsTrigger value="context">Context</TabsTrigger>
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
                    {getBotIcon(log.botType)}
                    Bot Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        log.botType === "telegram" ? "default" : "secondary"
                      }
                    >
                      {log.botType === "telegram" ? "Telegram" : "WhatsApp"}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Event: <span className="font-mono">{log.event}</span>
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
                    <div className="font-medium">{log.username}</div>
                    {log.userId && (
                      <div className="text-sm text-muted-foreground font-mono">
                        ID: {log.userId}
                      </div>
                    )}
                    {log.tradeId && (
                      <div className="text-sm text-muted-foreground font-mono">
                        Trade: {log.tradeId}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {log.responseTime && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Response Time:
                      </span>
                      <span
                        className={`font-mono text-sm ${
                          log.responseTime > 1000
                            ? "text-red-600"
                            : log.responseTime > 500
                            ? "text-yellow-600"
                            : "text-green-600"
                        }`}
                      >
                        {log.responseTime}ms
                      </span>
                    </div>
                  )}
                  {log.errorCode && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Error Code:
                      </span>
                      <Badge
                        variant="destructive"
                        className="font-mono text-xs"
                      >
                        {log.errorCode}
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Message</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{log.message}</p>
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

          <TabsContent value="context" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Log Context</CardTitle>
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
                      className={`${getLevelColor(
                        log.level
                      )} text-white border-0`}
                    >
                      {log.level.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Event Type:</span>
                    <span className="font-mono">{log.event}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bot Platform:</span>
                    <span className="capitalize">{log.botType}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
