"use client";

import type React from "react";

import { useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, DollarSign } from "lucide-react";

interface AddRateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddRateModal({ open, onOpenChange }: AddRateModalProps) {
  const [assetType, setAssetType] = useState("");
  const [platform, setPlatform] = useState("");
  const [buyRate, setBuyRate] = useState("");
  const [sellRate, setSellRate] = useState("");
  const [margin, setMargin] = useState("");
  const [rateSource, setRateSource] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Adding new rate:", {
      assetType,
      platform,
      buyRate,
      sellRate,
      margin,
      rateSource,
    });
    onOpenChange(false);
    // Reset form
    setAssetType("");
    setPlatform("");
    setBuyRate("");
    setSellRate("");
    setMargin("");
    setRateSource("");
  };

  const calculatePreview = () => {
    if (!buyRate || !sellRate) return null;
    const buy = Number.parseFloat(buyRate);
    const sell = Number.parseFloat(sellRate);
    const spread = (((sell - buy) / buy) * 100).toFixed(2);
    return { buy, sell, spread };
  };

  const preview = calculatePreview();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New Rate
          </DialogTitle>
          <DialogDescription>
            Configure a new trading rate for your platform
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="asset-type">Asset Type</Label>
              <Select value={assetType} onValueChange={setAssetType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select asset type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bitcoin">Bitcoin (BTC)</SelectItem>
                  <SelectItem value="ethereum">Ethereum (ETH)</SelectItem>
                  <SelectItem value="usdt">Tether (USDT)</SelectItem>
                  <SelectItem value="amazon">Amazon Gift Card</SelectItem>
                  <SelectItem value="apple">Apple Gift Card</SelectItem>
                  <SelectItem value="google">Google Play Card</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="platform">Platform</Label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger>
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="telegram">Telegram</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="both">Both Platforms</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="buy-rate">Buy Rate (₦)</Label>
              <Input
                id="buy-rate"
                type="number"
                placeholder="0.00"
                value={buyRate}
                onChange={(e) => setBuyRate(e.target.value)}
                className="font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sell-rate">Sell Rate (₦)</Label>
              <Input
                id="sell-rate"
                type="number"
                placeholder="0.00"
                value={sellRate}
                onChange={(e) => setSellRate(e.target.value)}
                className="font-mono"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="margin">Margin (%)</Label>
              <Input
                id="margin"
                type="number"
                placeholder="0.00"
                value={margin}
                onChange={(e) => setMargin(e.target.value)}
                className="font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rate-source">Rate Source</Label>
              <Select value={rateSource} onValueChange={setRateSource}>
                <SelectTrigger>
                  <SelectValue placeholder="Select rate source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="binance">Binance</SelectItem>
                  <SelectItem value="coinbase">Coinbase</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                  <SelectItem value="api">External API</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Rate Preview */}
          {preview && (
            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Rate Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid gap-3 md:grid-cols-3">
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">
                      Buy Rate
                    </div>
                    <div className="text-lg font-bold text-green-600">
                      ₦{preview.buy.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">
                      Sell Rate
                    </div>
                    <div className="text-lg font-bold text-blue-600">
                      ₦{preview.sell.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Spread</div>
                    <Badge variant="outline" className="text-sm">
                      {preview.spread}%
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!assetType || !platform || !buyRate || !sellRate}
            >
              Add Rate
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
