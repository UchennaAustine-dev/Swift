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
import { Badge } from "@/components/ui/badge";
import { Calculator, TrendingUp, TrendingDown } from "lucide-react";

interface EditRateModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: {
    symbol: string;
    name: string;
    platform: string;
    currentRate: number;
    source: string;
    autoMargin: number;
  } | null;
}

export function EditRateModal({ isOpen, onClose, asset }: EditRateModalProps) {
  const [formData, setFormData] = useState({
    rateSource: asset?.source || "auto",
    currentRate: asset?.currentRate || 0,
    autoMargin: asset?.autoMargin || 2.5,
    manualRate: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!asset) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log("Updating rate:", asset.symbol, formData);
    setIsSubmitting(false);
    onClose();
  };

  const calculateNewRate = () => {
    if (formData.rateSource === "manual" && formData.manualRate) {
      return Number(formData.manualRate);
    }
    return formData.currentRate * (1 + formData.autoMargin / 100);
  };

  const rateDifference = calculateNewRate() - formData.currentRate;
  const rateChangePercent = (rateDifference / formData.currentRate) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-poppins flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Edit Rate - {asset.symbol}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Current Rate Display */}
          <div className="p-4 bg-muted/20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                Current Rate
              </span>
              <Badge variant="outline">{asset.platform}</Badge>
            </div>
            <div className="text-2xl font-bold font-mono">
              ₦{asset.currentRate.toLocaleString()}
            </div>
          </div>

          {/* Rate Source */}
          <div className="space-y-2">
            <Label htmlFor="rateSource">Rate Source</Label>
            <Select
              value={formData.rateSource}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, rateSource: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Auto (API)</SelectItem>
                <SelectItem value="manual">Manual Override</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Auto Margin or Manual Rate */}
          {formData.rateSource === "auto" ? (
            <div className="space-y-2">
              <Label htmlFor="autoMargin">Auto Margin (%)</Label>
              <Input
                id="autoMargin"
                type="number"
                step="0.1"
                value={formData.autoMargin}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    autoMargin: Number(e.target.value),
                  }))
                }
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="manualRate">Manual Rate (₦)</Label>
              <Input
                id="manualRate"
                type="number"
                placeholder="Enter manual rate"
                value={formData.manualRate}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    manualRate: e.target.value,
                  }))
                }
                required={formData.rateSource === "manual"}
              />
            </div>
          )}

          {/* Rate Preview */}
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">New Rate Preview</span>
              <div
                className={`flex items-center gap-1 text-sm ${
                  rateDifference > 0
                    ? "text-green-500"
                    : rateDifference < 0
                    ? "text-red-500"
                    : "text-muted-foreground"
                }`}
              >
                {rateDifference > 0 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : rateDifference < 0 ? (
                  <TrendingDown className="h-3 w-3" />
                ) : null}
                <span>
                  {rateDifference > 0 ? "+" : ""}
                  {rateChangePercent.toFixed(2)}%
                </span>
              </div>
            </div>
            <div className="text-xl font-bold font-mono">
              ₦{calculateNewRate().toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Difference: ₦{Math.abs(rateDifference).toLocaleString()}
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Rate"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
