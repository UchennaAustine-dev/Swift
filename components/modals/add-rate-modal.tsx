"use client";

import type React from "react";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Plus, AlertCircle, TrendingUp, Activity } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ExchangeRate {
  id: string;
  asset: string;
  platform: string;
  source: string;
  sourceType?: string;
  currentRate: string;
  autoMargin: string;
  change24h: string;
  accuracy: string;
  lastSynced: string;
  changePositive: boolean;
}

interface AddRateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (rate: Omit<ExchangeRate, "id">) => void;
}

const assetOptions = [
  { value: "BTC", label: "Bitcoin (BTC)", symbol: "₿" },
  { value: "ETH", label: "Ethereum (ETH)", symbol: "Ξ" },
  { value: "USDT", label: "Tether (USDT)", symbol: "₮" },
  { value: "USDC", label: "USD Coin (USDC)", symbol: "$" },
  { value: "BNB", label: "Binance Coin (BNB)", symbol: "BNB" },
  { value: "Steam", label: "Steam Gift Card", symbol: "🎮" },
  { value: "iTunes", label: "iTunes Gift Card", symbol: "🍎" },
  { value: "Amazon", label: "Amazon Gift Card", symbol: "📦" },
];

const platformOptions = [
  {
    value: "Telegram",
    label: "Telegram",
    color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  },
  {
    value: "WhatsApp",
    label: "WhatsApp",
    color: "bg-green-500/20 text-green-400 border-green-500/30",
  },
  {
    value: "Discord",
    label: "Discord",
    color: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  },
];

const sourceOptions = [
  {
    value: "API",
    label: "API Integration",
    description: "Automated rate fetching",
  },
  { value: "Manual", label: "Manual Entry", description: "Manually set rates" },
];

export function AddRateModal({ isOpen, onClose, onAdd }: AddRateModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    asset: "",
    platform: "",
    source: "",
    currentRate: "",
    autoMargin: "",
    accuracy: "99.0",
    isOverride: false,
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.asset) newErrors.asset = "Asset is required";
    if (!formData.platform) newErrors.platform = "Platform is required";
    if (!formData.source) newErrors.source = "Source is required";
    if (!formData.currentRate) {
      newErrors.currentRate = "Current rate is required";
    } else if (isNaN(Number(formData.currentRate.replace(/[₦,]/g, "")))) {
      newErrors.currentRate = "Please enter a valid number";
    }
    if (!formData.autoMargin && formData.source === "API") {
      newErrors.autoMargin = "Auto margin is required for API sources";
    } else if (
      formData.autoMargin &&
      isNaN(Number(formData.autoMargin.replace("%", "")))
    ) {
      newErrors.autoMargin = "Please enter a valid percentage";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/[₦,]/g, "");
    if (numericValue && !isNaN(Number(numericValue))) {
      return `₦${Number(numericValue).toLocaleString()}`;
    }
    return value;
  };

  const formatPercentage = (value: string) => {
    const numericValue = value.replace("%", "");
    if (numericValue && !isNaN(Number(numericValue))) {
      return `${numericValue}%`;
    }
    return value;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Validation Error", {
        description: "Please fix the errors in the form before submitting.",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const newRate: Omit<ExchangeRate, "id"> = {
        asset: formData.asset,
        platform: formData.platform,
        source: formData.source,
        sourceType: formData.isOverride ? "Override" : undefined,
        currentRate: formatCurrency(formData.currentRate),
        autoMargin:
          formData.source === "Manual"
            ? "N/A"
            : formatPercentage(formData.autoMargin),
        change24h: "+0.0%", // Default for new rates
        accuracy: `${formData.accuracy}%`,
        lastSynced: new Date().toISOString(),
        changePositive: true,
      };

      onAdd(newRate);
      handleClose();
    } catch (error) {
      toast.error("Failed to Add Rate", {
        description:
          "There was an error adding the exchange rate. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      asset: "",
      platform: "",
      source: "",
      currentRate: "",
      autoMargin: "",
      accuracy: "99.0",
      isOverride: false,
      notes: "",
    });
    setErrors({});
    onClose();
  };

  const selectedAsset = assetOptions.find(
    (asset) => asset.value === formData.asset
  );
  const selectedPlatform = platformOptions.find(
    (platform) => platform.value === formData.platform
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold font-poppins flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Plus className="h-4 w-4 text-blue-500" />
            </div>
            Add Exchange Rate
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Asset & Platform Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="asset" className="text-sm font-medium">
                Asset *
              </Label>
              <Select
                value={formData.asset}
                onValueChange={(value) => handleInputChange("asset", value)}
              >
                <SelectTrigger
                  className={cn("w-full", errors.asset && "border-red-500")}
                >
                  <SelectValue placeholder="Select asset" />
                </SelectTrigger>
                <SelectContent>
                  {assetOptions.map((asset) => (
                    <SelectItem key={asset.value} value={asset.value}>
                      <div className="flex items-center gap-2">
                        <span>{asset.symbol}</span>
                        <span>{asset.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.asset && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.asset}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="platform" className="text-sm font-medium">
                Platform *
              </Label>
              <Select
                value={formData.platform}
                onValueChange={(value) => handleInputChange("platform", value)}
              >
                <SelectTrigger
                  className={cn("w-full", errors.platform && "border-red-500")}
                >
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  {platformOptions.map((platform) => (
                    <SelectItem key={platform.value} value={platform.value}>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={cn("text-xs", platform.color)}
                        >
                          {platform.label}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.platform && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.platform}
                </p>
              )}
            </div>
          </div>

          {/* Source Configuration */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="source" className="text-sm font-medium">
                Rate Source *
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {sourceOptions.map((source) => (
                  <Card
                    key={source.value}
                    className={cn(
                      "cursor-pointer transition-all duration-200 hover:shadow-md",
                      formData.source === source.value
                        ? "ring-2 ring-primary bg-primary/5"
                        : "hover:bg-muted/50",
                      errors.source && "border-red-500"
                    )}
                    onClick={() => handleInputChange("source", source.value)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          <div
                            className={cn(
                              "h-4 w-4 rounded-full border-2 transition-colors",
                              formData.source === source.value
                                ? "border-primary bg-primary"
                                : "border-muted-foreground"
                            )}
                          >
                            {formData.source === source.value && (
                              <div className="h-full w-full rounded-full bg-white scale-50" />
                            )}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">
                            {source.label}
                          </h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            {source.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {errors.source && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.source}
                </p>
              )}
            </div>

            {/* Override Toggle for Manual Source */}
            {formData.source === "Manual" && (
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div className="space-y-1">
                  <Label htmlFor="override" className="text-sm font-medium">
                    Manual Override
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Mark this rate as a manual override of automated rates
                  </p>
                </div>
                <Switch
                  id="override"
                  checked={formData.isOverride}
                  onCheckedChange={(checked) =>
                    handleInputChange("isOverride", checked)
                  }
                />
              </div>
            )}
          </div>

          <Separator />

          {/* Rate Configuration */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium font-poppins flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Rate Configuration
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currentRate" className="text-sm font-medium">
                  Current Rate *
                </Label>
                <Input
                  id="currentRate"
                  placeholder="e.g., 98450000"
                  value={formData.currentRate}
                  onChange={(e) =>
                    handleInputChange("currentRate", e.target.value)
                  }
                  onBlur={(e) =>
                    handleInputChange(
                      "currentRate",
                      formatCurrency(e.target.value)
                    )
                  }
                  className={cn(errors.currentRate && "border-red-500")}
                />
                {errors.currentRate && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.currentRate}
                  </p>
                )}
                {selectedAsset && (
                  <p className="text-xs text-muted-foreground">
                    Enter the current rate for {selectedAsset.label} in Nigerian
                    Naira
                  </p>
                )}
              </div>

              {formData.source === "API" && (
                <div className="space-y-2">
                  <Label htmlFor="autoMargin" className="text-sm font-medium">
                    Auto Margin *
                  </Label>
                  <Input
                    id="autoMargin"
                    placeholder="e.g., 2.5"
                    value={formData.autoMargin}
                    onChange={(e) =>
                      handleInputChange("autoMargin", e.target.value)
                    }
                    onBlur={(e) =>
                      handleInputChange(
                        "autoMargin",
                        formatPercentage(e.target.value)
                      )
                    }
                    className={cn(errors.autoMargin && "border-red-500")}
                  />
                  {errors.autoMargin && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.autoMargin}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Automatic margin percentage for rate calculations
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="accuracy" className="text-sm font-medium">
                  Expected Accuracy
                </Label>
                <Select
                  value={formData.accuracy}
                  onValueChange={(value) =>
                    handleInputChange("accuracy", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="95.0">95.0%</SelectItem>
                    <SelectItem value="96.0">96.0%</SelectItem>
                    <SelectItem value="97.0">97.0%</SelectItem>
                    <SelectItem value="98.0">98.0%</SelectItem>
                    <SelectItem value="99.0">99.0%</SelectItem>
                    <SelectItem value="99.5">99.5%</SelectItem>
                    <SelectItem value="100.0">100.0%</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Expected accuracy for this rate source
                </p>
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium">
              Additional Notes
            </Label>
            <Textarea
              id="notes"
              placeholder="Add any additional notes or configuration details..."
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>

          {/* Preview Card */}
          {formData.asset && formData.platform && (
            <Card className="bg-muted/30">
              <CardContent className="p-4">
                <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Rate Preview
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Asset:</span>
                    <div className="font-medium">{selectedAsset?.label}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Platform:</span>
                    <div>
                      <Badge
                        variant="outline"
                        className={cn("text-xs", selectedPlatform?.color)}
                      >
                        {formData.platform}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Source:</span>
                    <div className="font-medium">{formData.source}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Rate:</span>
                    <div className="font-mono font-medium">
                      {formData.currentRate || "Not set"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent mr-2" />
                  Adding Rate...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Rate
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
