"use client";

import { useState, useCallback } from "react";
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
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  SettingsIcon,
  RefreshCw,
  Webhook,
  Bell,
  AlertTriangle,
  Save,
  RotateCcw,
  HelpCircle,
  Loader2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { MaintenanceModeModal } from "@/components/modals/maintenance-mode-modal";
import { validateSettings, type ValidationError } from "@/lib/validation";
import { toast } from "sonner";

export default function SettingsPage() {
  // State management
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
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

  // Loading and validation states
  const [isSaving, setIsSaving] = useState(false);
  const [testingTokens, setTestingTokens] = useState<{
    telegram: boolean;
    whatsapp: boolean;
  }>({
    telegram: false,
    whatsapp: false,
  });
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
    []
  );
  const [tokenStatus, setTokenStatus] = useState<{
    telegram: "idle" | "success" | "error";
    whatsapp: "idle" | "success" | "error";
  }>({
    telegram: "idle",
    whatsapp: "idle",
  });

  // Validation helper
  const getFieldError = (fieldName: string) => {
    return validationErrors.find((error) => error.field === fieldName)?.message;
  };

  // Token testing functionality
  const handleTestToken = useCallback(async (type: "telegram" | "whatsapp") => {
    setTestingTokens((prev) => ({ ...prev, [type]: true }));
    setTokenStatus((prev) => ({ ...prev, [type]: "idle" }));

    try {
      // Simulate API call to test token
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate random success/failure for demo
          Math.random() > 0.3
            ? resolve(true)
            : reject(new Error("Invalid token"));
        }, 2000);
      });

      setTokenStatus((prev) => ({ ...prev, [type]: "success" }));
      toast.success(
        `${type === "telegram" ? "Telegram" : "WhatsApp"} token is valid`
      );
    } catch (error) {
      setTokenStatus((prev) => ({ ...prev, [type]: "error" }));
      toast.error(
        `${type === "telegram" ? "Telegram" : "WhatsApp"} token is invalid`
      );
    } finally {
      setTestingTokens((prev) => ({ ...prev, [type]: false }));
    }
  }, []);

  // Save settings functionality
  const handleSave = useCallback(async () => {
    const settings = {
      autoCancel,
      tradeRetry,
      payoutTimeout,
      telegramToken,
      whatsappToken,
      webhookUrl,
      emailRecipients,
      slackWebhook,
    };

    // Validate settings
    const errors = validateSettings(settings);
    setValidationErrors(errors);

    if (errors.length > 0) {
      toast.error("Please fix validation errors before saving");
      return;
    }

    setIsSaving(true);

    try {
      // Simulate API call to save settings
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Here you would make the actual API call
      // await fetch('/api/settings', { method: 'POST', body: JSON.stringify(settings) });

      toast.success("Settings saved successfully");
      setValidationErrors([]);
    } catch (error) {
      toast.error("Failed to save settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }, [
    autoCancel,
    tradeRetry,
    payoutTimeout,
    telegramToken,
    whatsappToken,
    webhookUrl,
    emailRecipients,
    slackWebhook,
  ]);

  // Reset to defaults
  const handleResetDefaults = useCallback(() => {
    setAutoCancel("30");
    setTradeRetry("3");
    setPayoutTimeout("60");
    setWebhookUrl("https://api.swiftlify.com/webhook");
    setEmailNotifications(true);
    setSlackNotifications(false);
    setTelegramNotifications(false);
    setEmailRecipients("admin@swiftlify.com");
    setSlackWebhook("");
    setValidationErrors([]);
    toast.success("Settings reset to defaults");
  }, []);

  // Maintenance mode handler
  const handleMaintenanceModeChange = (checked: boolean) => {
    if (checked !== maintenanceMode) {
      setShowMaintenanceModal(true);
    }
  };

  const handleMaintenanceModeConfirm = (enabled: boolean, message?: string) => {
    setMaintenanceMode(enabled);
    // Here you would save the maintenance mode state to your backend
    console.log("Maintenance mode:", enabled, "Message:", message);
  };

  // Notification handlers
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
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Header />
          <div className="flex flex-1 flex-col gap-6 container-padding pt-0 mt-5">
            {/* Breadcrumb Navigation */}
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Settings</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="heading-responsive font-bold tracking-tight">
                    Settings
                  </h1>
                  <p className="text-responsive text-muted-foreground">
                    Configure system settings and integrations
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={handleResetDefaults}
                  className="flex items-center gap-2 hover:text-white hover:border-none bg-green-600 hover:bg-green-700 text-white cursor-pointer"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset to Defaults
                </Button>
              </div>

              {/* Maintenance Mode */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg bg-yellow-500/20 flex items-center justify-center border border-yellow-200 dark:border-yellow-800">
                        <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <div>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          Maintenance Mode
                          <Tooltip>
                            <TooltipTrigger>
                              <HelpCircle className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                When enabled, users will be unable to access the
                                system
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Control system availability for users
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div
                          className={`text-sm font-medium ${
                            maintenanceMode
                              ? "text-yellow-600 dark:text-yellow-400"
                              : "text-green-600 dark:text-green-400"
                          }`}
                        >
                          {maintenanceMode ? "MAINTENANCE" : "ACTIVE"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {maintenanceMode ? "System offline" : "System online"}
                        </div>
                      </div>
                      <Switch
                        checked={maintenanceMode}
                        onCheckedChange={handleMaintenanceModeChange}
                        className={`
                          maintenance-switch
                          data-[state=checked]:bg-yellow-500 
                          data-[state=checked]:border-yellow-600
                          data-[state=checked]:shadow-lg 
                          data-[state=checked]:shadow-yellow-500/25
                          data-[state=unchecked]:bg-gray-200 
                          data-[state=unchecked]:border-gray-300
                          dark:data-[state=unchecked]:bg-gray-700 
                          dark:data-[state=unchecked]:border-gray-600
                          scale-125 
                          transition-all 
                          duration-200
                          border-2
                        `}
                      />
                    </div>
                  </div>
                </CardHeader>
                {maintenanceMode && (
                  <CardContent>
                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
                        <div>
                          <div className="font-medium text-yellow-800 dark:text-yellow-200">
                            System is currently in maintenance mode
                          </div>
                          <div className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                            All user access is temporarily disabled. Only
                            administrators can access the system.
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* Timeout & Retry Settings */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <RefreshCw className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <CardTitle>Timeout & Retry Settings</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Configure system timeouts and retry limits
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label
                        htmlFor="auto-cancel"
                        className="flex items-center gap-2"
                      >
                        Auto-cancel timeout (minutes)
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-3 w-3 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              Time before inactive trades are automatically
                              cancelled
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </Label>
                      <Input
                        id="auto-cancel"
                        value={autoCancel}
                        onChange={(e) => setAutoCancel(e.target.value)}
                        className={
                          getFieldError("autoCancel") ? "border-red-500" : ""
                        }
                        type="number"
                        min="1"
                      />
                      {getFieldError("autoCancel") && (
                        <p className="text-sm text-red-500">
                          {getFieldError("autoCancel")}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="trade-retry"
                        className="flex items-center gap-2"
                      >
                        Trade retry limit
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-3 w-3 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              Maximum number of retry attempts for failed trades
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </Label>
                      <Input
                        id="trade-retry"
                        value={tradeRetry}
                        onChange={(e) => setTradeRetry(e.target.value)}
                        className={
                          getFieldError("tradeRetry") ? "border-red-500" : ""
                        }
                        type="number"
                        min="1"
                      />
                      {getFieldError("tradeRetry") && (
                        <p className="text-sm text-red-500">
                          {getFieldError("tradeRetry")}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="payout-timeout"
                        className="flex items-center gap-2"
                      >
                        Payout timeout (minutes)
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-3 w-3 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Maximum time to wait for payout completion</p>
                          </TooltipContent>
                        </Tooltip>
                      </Label>
                      <Input
                        id="payout-timeout"
                        value={payoutTimeout}
                        onChange={(e) => setPayoutTimeout(e.target.value)}
                        className={
                          getFieldError("payoutTimeout") ? "border-red-500" : ""
                        }
                        type="number"
                        min="1"
                      />
                      {getFieldError("payoutTimeout") && (
                        <p className="text-sm text-red-500">
                          {getFieldError("payoutTimeout")}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* API Configuration */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                      <SettingsIcon className="h-5 w-5 text-green-400" />
                    </div>
                    <div>
                      <CardTitle>API Configuration</CardTitle>
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
                      <div className="flex-1 relative">
                        <Input
                          id="telegram-token"
                          value={telegramToken}
                          onChange={(e) => setTelegramToken(e.target.value)}
                          className={`font-mono pr-8 ${
                            getFieldError("telegramToken")
                              ? "border-red-500"
                              : ""
                          }`}
                          type="password"
                        />
                        {tokenStatus.telegram === "success" && (
                          <CheckCircle className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                        )}
                        {tokenStatus.telegram === "error" && (
                          <XCircle className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />
                        )}
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => handleTestToken("telegram")}
                        disabled={testingTokens.telegram}
                        className="hover:text-white hover:border-none bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                      >
                        {testingTokens.telegram ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Test"
                        )}
                      </Button>
                    </div>
                    {getFieldError("telegramToken") && (
                      <p className="text-sm text-red-500">
                        {getFieldError("telegramToken")}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp-token">
                      WhatsApp Business Token
                    </Label>
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <Input
                          id="whatsapp-token"
                          value={whatsappToken}
                          onChange={(e) => setWhatsappToken(e.target.value)}
                          className={`font-mono pr-8 ${
                            getFieldError("whatsappToken")
                              ? "border-red-500"
                              : ""
                          }`}
                          type="password"
                        />
                        {tokenStatus.whatsapp === "success" && (
                          <CheckCircle className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                        )}
                        {tokenStatus.whatsapp === "error" && (
                          <XCircle className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />
                        )}
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => handleTestToken("whatsapp")}
                        disabled={testingTokens.whatsapp}
                        className="hover:text-white hover:border-none bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                      >
                        {testingTokens.whatsapp ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Test"
                        )}
                      </Button>
                    </div>
                    {getFieldError("whatsappToken") && (
                      <p className="text-sm text-red-500">
                        {getFieldError("whatsappToken")}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Webhook Configuration */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                      <Webhook className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <CardTitle>Webhook Configuration</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Configure webhook endpoints for external integrations
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="webhook-url"
                      className="flex items-center gap-2"
                    >
                      Webhook URL
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-3 w-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>URL where webhook notifications will be sent</p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <Input
                      id="webhook-url"
                      value={webhookUrl}
                      onChange={(e) => setWebhookUrl(e.target.value)}
                      className={`font-mono ${
                        getFieldError("webhookUrl") ? "border-red-500" : ""
                      }`}
                      placeholder="https://your-domain.com/webhook"
                    />
                    {getFieldError("webhookUrl") && (
                      <p className="text-sm text-red-500">
                        {getFieldError("webhookUrl")}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Notification Channels */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                      <Bell className="h-5 w-5 text-orange-400" />
                    </div>
                    <div>
                      <CardTitle>Notification Channels</CardTitle>
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
                        className={
                          getFieldError("emailRecipients")
                            ? "border-red-500"
                            : ""
                        }
                        placeholder="admin@swiftlify.com, support@swiftlify.com"
                      />
                      {getFieldError("emailRecipients") && (
                        <p className="text-sm text-red-500">
                          {getFieldError("emailRecipients")}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Separate multiple email addresses with commas
                      </p>
                    </div>
                  )}

                  {slackNotifications && (
                    <div className="space-y-2">
                      <Label htmlFor="slack-webhook">Slack Webhook URL</Label>
                      <Input
                        id="slack-webhook"
                        value={slackWebhook}
                        onChange={(e) => setSlackWebhook(e.target.value)}
                        className={`font-mono ${
                          getFieldError("slackWebhook") ? "border-red-500" : ""
                        }`}
                        type="password"
                        placeholder="https://hooks.slack.com/services/..."
                      />
                      {getFieldError("slackWebhook") && (
                        <p className="text-sm text-red-500">
                          {getFieldError("slackWebhook")}
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Save Button */}
              <div className="flex justify-end">
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="min-w-32 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer hover:text-white hover:border-none"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </SidebarInset>

        {/* Maintenance Mode Modal */}
        <MaintenanceModeModal
          isOpen={showMaintenanceModal}
          onClose={() => setShowMaintenanceModal(false)}
          currentMode={maintenanceMode}
          onConfirm={handleMaintenanceModeConfirm}
        />
      </SidebarProvider>
    </TooltipProvider>
  );
}
