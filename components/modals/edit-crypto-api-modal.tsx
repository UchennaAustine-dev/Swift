"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { toast } from "sonner";
import type { APIConfig } from "@/lib/types";

interface EditCryptoAPIModalProps {
  api: APIConfig | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (api: APIConfig) => void;
}

const CRYPTO_ASSETS = [
  "Bitcoin",
  "Ethereum",
  "USDT",
  "BNB",
  "XRP",
  "Cardano",
  "Solana",
  "Dogecoin",
  "Polygon",
  "Litecoin",
  "Avalanche",
  "Chainlink",
];

export function EditCryptoAPIModal({
  api,
  isOpen,
  onClose,
  onUpdate,
}: EditCryptoAPIModalProps) {
  const [formData, setFormData] = useState<Partial<APIConfig>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (api) {
      setFormData(api);
    }
  }, [api]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = "API name is required";
    }

    if (!formData.apiKey?.trim()) {
      newErrors.apiKey = "API key is required";
    }

    if (!formData.rateLimit?.trim()) {
      newErrors.rateLimit = "Rate limit is required";
    }

    if (!formData.supportedAssets?.length) {
      newErrors.supportedAssets = "At least one supported asset is required";
    }

    if (!formData.priority || formData.priority < 1 || formData.priority > 10) {
      newErrors.priority = "Priority must be between 1 and 10";
    }

    if (
      formData.autoMargin === undefined ||
      formData.autoMargin < 0 ||
      formData.autoMargin > 10
    ) {
      newErrors.autoMargin = "Auto margin must be between 0 and 10";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !api) {
      toast.error("Validation Error", {
        description: "Please fix the errors in the form.",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const updatedAPI: APIConfig = {
        ...api,
        ...formData,
        lastSync: new Date().toISOString(),
      } as APIConfig;

      onUpdate(updatedAPI);
      handleClose();
    } catch (error) {
      toast.error("Error", {
        description: "Failed to update crypto API. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({});
    setErrors({});
    onClose();
  };

  const addSupportedAsset = (asset: string) => {
    if (!formData.supportedAssets?.includes(asset)) {
      setFormData((prev) => ({
        ...prev,
        supportedAssets: [...(prev.supportedAssets || []), asset],
      }));
    }
  };

  const removeSupportedAsset = (asset: string) => {
    setFormData((prev) => ({
      ...prev,
      supportedAssets: prev.supportedAssets?.filter((a) => a !== asset) || [],
    }));
  };

  if (!api) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Crypto API</DialogTitle>
          <DialogDescription>
            Update the configuration for {api.name}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">API Name *</Label>
              <Input
                id="name"
                placeholder="e.g., CoinGecko"
                value={formData.name || ""}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority (1-10)</Label>
              <Input
                id="priority"
                type="number"
                min="1"
                max="10"
                value={formData.priority || 1}
                onChange={(e) =>
                  setFormData({ ...formData, priority: Number(e.target.value) })
                }
                className={errors.priority ? "border-red-500" : ""}
              />
              {errors.priority && (
                <p className="text-sm text-red-500">{errors.priority}</p>
              )}
              <p className="text-sm text-muted-foreground">
                Lower numbers have higher priority
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key *</Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="Enter API key"
                value={formData.apiKey || ""}
                onChange={(e) =>
                  setFormData({ ...formData, apiKey: e.target.value })
                }
                className={errors.apiKey ? "border-red-500" : ""}
              />
              {errors.apiKey && (
                <p className="text-sm text-red-500">{errors.apiKey}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="rateLimit">Rate Limit *</Label>
              <Input
                id="rateLimit"
                placeholder="e.g., 50/minute"
                value={formData.rateLimit || ""}
                onChange={(e) =>
                  setFormData({ ...formData, rateLimit: e.target.value })
                }
                className={errors.rateLimit ? "border-red-500" : ""}
              />
              {errors.rateLimit && (
                <p className="text-sm text-red-500">{errors.rateLimit}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="autoMargin">Auto Margin (%) *</Label>
            <Input
              id="autoMargin"
              type="number"
              min="0"
              max="10"
              step="0.1"
              value={formData.autoMargin || 0}
              onChange={(e) =>
                setFormData({ ...formData, autoMargin: Number(e.target.value) })
              }
              className={errors.autoMargin ? "border-red-500" : ""}
            />
            {errors.autoMargin && (
              <p className="text-sm text-red-500">{errors.autoMargin}</p>
            )}
            <p className="text-sm text-muted-foreground">
              Automatic margin added to prices
            </p>
          </div>

          <div className="space-y-2">
            <Label>Supported Assets *</Label>
            <Select onValueChange={addSupportedAsset}>
              <SelectTrigger>
                <SelectValue placeholder="Select assets to add" />
              </SelectTrigger>
              <SelectContent>
                {CRYPTO_ASSETS.filter(
                  (asset) => !formData.supportedAssets?.includes(asset)
                ).map((asset) => (
                  <SelectItem key={asset} value={asset}>
                    {asset}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {formData.supportedAssets &&
              formData.supportedAssets.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.supportedAssets.map((asset) => (
                    <Badge
                      key={asset}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {asset}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-transparent"
                        onClick={() => removeSupportedAsset(asset)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            {errors.supportedAssets && (
              <p className="text-sm text-red-500">{errors.supportedAssets}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Additional notes about this API source..."
              value={formData.notes || ""}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Crypto API"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
