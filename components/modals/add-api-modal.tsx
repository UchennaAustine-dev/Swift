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
import { X } from "lucide-react";

interface AddAPIModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "crypto" | "giftcard";
}

export function AddAPIModal({ isOpen, onClose, type }: AddAPIModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    sourceUrl: "",
    apiKey: "",
    autoMargin: "2.5",
    priority: "1",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Adding API:", formData);
    onClose();
    // Reset form
    setFormData({
      name: "",
      sourceUrl: "",
      apiKey: "",
      autoMargin: "2.5",
      priority: "1",
    });
  };

  const handleTest = () => {
    console.log("Testing API connection...");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>
              Add New {type === "crypto" ? "Crypto" : "API Source"}{" "}
              {type === "crypto" ? "API" : ""}
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">API Name</Label>
            <Input
              id="name"
              placeholder="Enter API name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sourceUrl">Source URL</Label>
            <Input
              id="sourceUrl"
              placeholder="https://api.example.com/v1"
              value={formData.sourceUrl}
              onChange={(e) =>
                setFormData({ ...formData, sourceUrl: e.target.value })
              }
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
              onChange={(e) =>
                setFormData({ ...formData, apiKey: e.target.value })
              }
              required
            />
          </div>

          {type === "crypto" && (
            <div className="space-y-2">
              <Label htmlFor="autoMargin">Auto Margin (%)</Label>
              <Input
                id="autoMargin"
                placeholder="2.5"
                value={formData.autoMargin}
                onChange={(e) =>
                  setFormData({ ...formData, autoMargin: e.target.value })
                }
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select
              value={formData.priority}
              onValueChange={(value) =>
                setFormData({ ...formData, priority: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
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

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="button" variant="outline" onClick={handleTest}>
              Test & Add API
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
