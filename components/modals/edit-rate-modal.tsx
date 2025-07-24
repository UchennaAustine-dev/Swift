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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

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

interface EditRateModalProps {
  rate: ExchangeRate | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (rate: ExchangeRate) => void;
}

export function EditRateModal({
  rate,
  isOpen,
  onClose,
  onUpdate,
}: EditRateModalProps) {
  const [formData, setFormData] = useState<Partial<ExchangeRate>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (rate) {
      setFormData(rate);
    }
  }, [rate]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.currentRate?.trim()) {
      newErrors.currentRate = "Current rate is required";
    }

    if (formData.source === "API" && !formData.autoMargin?.trim()) {
      newErrors.autoMargin = "Auto margin is required for API sources";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !rate) {
      toast.error("Validation Error", {
        description: "Please fix the errors in the form.",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const updatedRate: ExchangeRate = {
        ...rate,
        ...formData,
        lastSynced: new Date().toISOString(),
      } as ExchangeRate;

      onUpdate(updatedRate);
      handleClose();
    } catch (error) {
      toast.error("Error", {
        description: "Failed to update exchange rate. Please try again.",
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

  if (!rate) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Exchange Rate</DialogTitle>
          <DialogDescription>
            Update the exchange rate configuration for {rate.asset}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Asset</Label>
              <div className="p-2 bg-muted rounded-md">
                <Badge variant="outline" className="font-medium">
                  {rate.asset}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Platform</Label>
              <div className="p-2 bg-muted rounded-md">
                <Badge
                  variant="outline"
                  className={
                    rate.platform === "Telegram"
                      ? "border-blue-500 text-blue-600"
                      : "border-green-500 text-green-600"
                  }
                >
                  {rate.platform}
                </Badge>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="currentRate">Current Rate *</Label>
            <Input
              id="currentRate"
              placeholder="e.g., ₦98,450,000"
              value={formData.currentRate || ""}
              onChange={(e) =>
                setFormData({ ...formData, currentRate: e.target.value })
              }
              className={errors.currentRate ? "border-red-500" : ""}
            />
            {errors.currentRate && (
              <p className="text-sm text-red-500">{errors.currentRate}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="source">Source</Label>
            <Select
              value={formData.source}
              onValueChange={(value) =>
                setFormData({ ...formData, source: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="API">API</SelectItem>
                <SelectItem value="Manual">Manual</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.source === "API" && (
            <div className="space-y-2">
              <Label htmlFor="autoMargin">Auto Margin *</Label>
              <Input
                id="autoMargin"
                placeholder="e.g., 2.5%"
                value={formData.autoMargin || ""}
                onChange={(e) =>
                  setFormData({ ...formData, autoMargin: e.target.value })
                }
                className={errors.autoMargin ? "border-red-500" : ""}
              />
              {errors.autoMargin && (
                <p className="text-sm text-red-500">{errors.autoMargin}</p>
              )}
              <p className="text-sm text-muted-foreground">
                Automatic margin added to the base rate
              </p>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Rate"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
