"use client";

import { useState } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  SettingsIcon,
  RefreshCw,
  Webhook,
  Bell,
  AlertTriangle,
  Save,
} from "lucide-react";

export default function SettingsPage() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [autoCancel, setAutoCancel] = useState("30");
  const [tradeRetry, setTradeRetry] = useState("3");
  const [payoutTimeout, setPayoutTimeout] = useState("60");
  const [telegramToken, setTelegramToken] = useState(
    "••••••••••••••••••••••••••••••••••••"
  );
  const [whatsappToken, setWhatsappToken] = useState(
    "••••••••••••••••••••••••••••••••••••"
  );
  const [webhookUrl, setWebhookUrl] = useState(
    "https://api.swiftlify.com/webhook"
  );
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [slackNotifications, setSlackNotifications] = useState(true);
  const [telegramNotifications, setTelegramNotifications] = useState(false);
  const [emailRecipients, setEmailRecipients] = useState(
    "admin@swiftlify.com, support@swiftlify.com"
  );
  const [slackWebhook, setSlackWebhook] = useState(
    "https://hooks.slack.com/services/••••••••••••••••••••••"
  );

  const handleTestToken = (type: "telegram" | "whatsapp") => {
    console.log(`Testing ${type} token...`);
    // Implement token testing logic
  };

  const handleSave = () => {
    console.log("Saving settings...");
    // Implement save logic
  };

  const handleEmailNotificationsChange = (
    checked: boolean | "indeterminate"
  ) => {
    if (typeof checked === "boolean") {
      setEmailNotifications(checked);
    }
  };

  const handleSlackNotificationsChange = (
    checked: boolean | "indeterminate"
  ) => {
    if (typeof checked === "boolean") {
      setSlackNotifications(checked);
    }
  };

  const handleTelegramNotificationsChange = (
    checked: boolean | "indeterminate"
  ) => {
    if (typeof checked === "boolean") {
      setTelegramNotifications(checked);
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="fixed-header-layout">
        <Header />
        <div className="scrollable-content flex flex-1 flex-col gap-6 container-padding">
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold font-poppins">Settings</h1>
              <p className="text-muted-foreground">
                Configure system settings and integrations
              </p>
            </div>

            {/* Maintenance Mode */}
            <Card className="card-enhanced">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                      <AlertTriangle className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div>
                      <CardTitle className="font-poppins">
                        Maintenance Mode
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Control system availability for users
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={maintenanceMode}
                    onCheckedChange={setMaintenanceMode}
                  />
                </div>
              </CardHeader>
            </Card>

            {/* Timeout & Retry Settings */}
            <Card className="card-enhanced">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <RefreshCw className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <CardTitle className="font-poppins">
                      Timeout & Retry Settings
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Configure system timeouts and retry limits
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="auto-cancel">
                      Auto-cancel timeout (minutes)
                    </Label>
                    <Input
                      id="auto-cancel"
                      value={autoCancel}
                      onChange={(e) => setAutoCancel(e.target.value)}
                      className="bg-background/50 border-border/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="trade-retry">Trade retry limit</Label>
                    <Input
                      id="trade-retry"
                      value={tradeRetry}
                      onChange={(e) => setTradeRetry(e.target.value)}
                      className="bg-background/50 border-border/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="payout-timeout">
                      Payout timeout (minutes)
                    </Label>
                    <Input
                      id="payout-timeout"
                      value={payoutTimeout}
                      onChange={(e) => setPayoutTimeout(e.target.value)}
                      className="bg-background/50 border-border/50"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* API Configuration */}
            <Card className="card-enhanced">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <SettingsIcon className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <CardTitle className="font-poppins">
                      API Configuration
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Manage bot tokens and API credentials
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="telegram-token">Telegram Bot Token</Label>
                  <div className="flex gap-2">
                    <Input
                      id="telegram-token"
                      value={telegramToken}
                      onChange={(e) => setTelegramToken(e.target.value)}
                      className="bg-background/50 border-border/50 font-mono"
                      type="password"
                    />
                    <Button
                      variant="outline"
                      onClick={() => handleTestToken("telegram")}
                      className="bg-background/50 border-border/50"
                    >
                      Test
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp-token">
                    WhatsApp Business Token
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="whatsapp-token"
                      value={whatsappToken}
                      onChange={(e) => setWhatsappToken(e.target.value)}
                      className="bg-background/50 border-border/50 font-mono"
                      type="password"
                    />
                    <Button
                      variant="outline"
                      onClick={() => handleTestToken("whatsapp")}
                      className="bg-background/50 border-border/50"
                    >
                      Test
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Webhook Configuration */}
            <Card className="card-enhanced">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <Webhook className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <CardTitle className="font-poppins">
                      Webhook Configuration
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Configure webhook endpoints for external integrations
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="webhook-url">Webhook URL</Label>
                  <Input
                    id="webhook-url"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    className="bg-background/50 border-border/50 font-mono"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Notification Channels */}
            <Card className="card-enhanced">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                    <Bell className="h-5 w-5 text-orange-400" />
                  </div>
                  <div>
                    <CardTitle className="font-poppins">
                      Notification Channels
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Configure how you receive system alerts
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="email-notifications"
                      checked={emailNotifications}
                      onCheckedChange={handleEmailNotificationsChange}
                    />
                    <Label htmlFor="email-notifications">
                      Email Notifications
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="slack-notifications"
                      checked={slackNotifications}
                      onCheckedChange={handleSlackNotificationsChange}
                    />
                    <Label htmlFor="slack-notifications">
                      Slack Notifications
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="telegram-notifications"
                      checked={telegramNotifications}
                      onCheckedChange={handleTelegramNotificationsChange}
                    />
                    <Label htmlFor="telegram-notifications">
                      Telegram Notifications
                    </Label>
                  </div>
                </div>

                {emailNotifications && (
                  <div className="space-y-2">
                    <Label htmlFor="email-recipients">Email Recipients</Label>
                    <Input
                      id="email-recipients"
                      value={emailRecipients}
                      onChange={(e) => setEmailRecipients(e.target.value)}
                      className="bg-background/50 border-border/50"
                      placeholder="admin@swiftlify.com, support@swiftlify.com"
                    />
                  </div>
                )}

                {slackNotifications && (
                  <div className="space-y-2">
                    <Label htmlFor="slack-webhook">Slack Webhook URL</Label>
                    <Input
                      id="slack-webhook"
                      value={slackWebhook}
                      onChange={(e) => setSlackWebhook(e.target.value)}
                      className="bg-background/50 border-border/50 font-mono"
                      type="password"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button onClick={handleSave} className="min-w-32">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
