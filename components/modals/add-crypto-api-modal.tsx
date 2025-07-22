"use client";

import type React from "react";

import { useState } from "react";
import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddCryptoAPIModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const cryptoAssets = [
  { id: "bitcoin", label: "Bitcoin (BTC)" },
  { id: "ethereum", label: "Ethereum (ETH)" },
  { id: "usdt", label: "Tether (USDT)" },
  { id: "bnb", label: "BNB" },
  { id: "cardano", label: "Cardano (ADA)" },
  { id: "solana", label: "Solana (SOL)" },
  { id: "xrp", label: "XRP" },
  { id: "dogecoin", label: "Dogecoin (DOGE)" },
];

export function AddCryptoAPIModal({ isOpen, onClose }: AddCryptoAPIModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    apiKey: "",
    priority: "1",
    autoMargin: "2.0",
    supportedAssets: [] as string[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Creating crypto API:", formData);
    // Handle API creation logic here
    onClose();
    setFormData({
      name: "",
      apiKey: "",
      priority: "1",
      autoMargin: "2.0",
      supportedAssets: [],
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAssetChange = (assetId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      supportedAssets: checked
        ? [...prev.supportedAssets, assetId]
        : prev.supportedAssets.filter((id) => id !== assetId),
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-card border-border/50">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="font-poppins text-lg">
            Add Crypto API
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">API Name</Label>
            <Input
              id="name"
              placeholder="e.g., CoinGecko, Binance"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="bg-background/50 border-border/50"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="Enter API key"
              value={formData.apiKey}
              onChange={(e) => handleInputChange("apiKey", e.target.value)}
              className="bg-background/50 border-border/50 font-mono"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => handleInputChange("priority", value)}
              >
                <SelectTrigger className="bg-background/50 border-border/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 (Highest)</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5">5 (Lowest)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="autoMargin">Auto Margin (%)</Label>
              <Input
                id="autoMargin"
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={formData.autoMargin}
                onChange={(e) =>
                  handleInputChange("autoMargin", e.target.value)
                }
                className="bg-background/50 border-border/50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Supported Assets</Label>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border border-border/50 rounded-md p-3 bg-background/50">
              {cryptoAssets.map((asset) => (
                <div key={asset.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={asset.id}
                    checked={formData.supportedAssets.includes(asset.id)}
                    onCheckedChange={(checked) =>
                      handleAssetChange(asset.id, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={asset.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {asset.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="bg-background/50 border-border/50"
            >
              Cancel
            </Button>
            <Button type="submit">
              <Plus className="h-4 w-4 mr-2" />
              Test & Add
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
