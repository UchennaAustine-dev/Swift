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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { format } from "date-fns";
import type { Trade } from "@/lib/types";

interface TradeModalProps {
  trade: Trade | null;
  isOpen: boolean;
  onClose: () => void;
  mode: "view" | "note" | "recalculate" | "cancel";
  onTradeUpdate?: (trade: Trade) => void;
  onTradeCancel?: (tradeId: string) => void;
}

export function TradeModal({
  trade,
  isOpen,
  onClose,
  mode,
  onTradeUpdate,
  onTradeCancel,
}: TradeModalProps) {
  const [formData, setFormData] = useState<Partial<Trade>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [note, setNote] = useState("");
  const [newRate, setNewRate] = useState("");

  useEffect(() => {
    if (trade) {
      setFormData(trade);
      setNote(trade.notes || "");
      setNewRate(trade.rate?.toString() || "");
    }
  }, [trade]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trade) return;

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      switch (mode) {
        case "note":
          const updatedTradeWithNote = {
            ...trade,
            notes: note,
            updatedAt: new Date().toISOString(),
          };
          onTradeUpdate?.(updatedTradeWithNote);
          toast.success("Note Added", {
            description: "Trade note has been added successfully.",
          });
          break;

        case "recalculate":
          const rate = Number.parseFloat(newRate);
          if (isNaN(rate) || rate <= 0) {
            toast.error("Invalid Rate", {
              description: "Please enter a valid rate.",
            });
            return;
          }

          // Calculate new payout based on amount and new rate
          let newPayout = 0;
          if (
            trade.assetType.includes("BTC") ||
            trade.assetType.includes("ETH")
          ) {
            const amount = Number.parseFloat(trade.amount.split(" ")[0]);
            newPayout = amount * rate;
          } else {
            // For gift cards, rate is per dollar
            const amount = Number.parseFloat(trade.amount.replace("$", ""));
            newPayout = amount * rate;
          }

          const recalculatedTrade = {
            ...trade,
            rate,
            payout: newPayout,
            updatedAt: new Date().toISOString(),
          };
          onTradeUpdate?.(recalculatedTrade);
          toast.success("Trade Recalculated", {
            description: "Trade rate and payout have been updated.",
          });
          break;

        case "cancel":
          onTradeCancel?.(trade.id);
          break;

        default:
          break;
      }

      onClose();
    } catch (error) {
      toast.error("Error", {
        description: "Failed to perform action. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!trade) return null;

  const getModalTitle = () => {
    switch (mode) {
      case "view":
        return "Trade Details";
      case "note":
        return "Add Note";
      case "recalculate":
        return "Recalculate Trade";
      case "cancel":
        return "Cancel Trade";
      default:
        return "Trade";
    }
  };

  const getModalDescription = () => {
    switch (mode) {
      case "view":
        return "View detailed trade information and history.";
      case "note":
        return "Add a note to this trade for future reference.";
      case "recalculate":
        return "Update the trade rate and recalculate the payout.";
      case "cancel":
        return "Are you sure you want to cancel this trade? This action cannot be undone.";
      default:
        return "";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getModalTitle()}</DialogTitle>
          <DialogDescription>{getModalDescription()}</DialogDescription>
        </DialogHeader>

        {mode === "view" ? (
          <div className="space-y-6">
            {/* Trade Header */}
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <div className="font-mono font-bold text-lg">{trade.id}</div>
                <div className="text-sm text-muted-foreground">
                  Created {format(new Date(trade.createdAt), "PPpp")}
                </div>
              </div>
              <Badge
                variant={
                  trade.status === "completed"
                    ? "default"
                    : trade.status === "awaiting_proof"
                    ? "secondary"
                    : trade.status === "cancelled"
                    ? "destructive"
                    : "outline"
                }
                className={
                  trade.status === "completed"
                    ? "bg-green-500"
                    : trade.status === "awaiting_proof"
                    ? "bg-orange-500"
                    : ""
                }
              >
                {trade.status.replace("_", " ")}
              </Badge>
            </div>

            {/* User Information */}
            <div className="space-y-3">
              <h3 className="font-semibold">User Information</h3>
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>
                    {trade.user.username.slice(1, 3).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-medium">{trade.user.username}</div>
                  <Badge
                    variant="outline"
                    className={`text-xs w-fit ${
                      trade.user.platform === "telegram"
                        ? "border-blue-500 text-blue-600"
                        : "border-green-500 text-green-600"
                    }`}
                  >
                    {trade.user.platform}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Trade Details */}
            <div className="space-y-3">
              <h3 className="font-semibold">Trade Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Asset Type</Label>
                  <Badge
                    variant="outline"
                    className={
                      trade.assetType.includes("Bitcoin")
                        ? "border-orange-500 text-orange-600"
                        : trade.assetType.includes("Ethereum")
                        ? "border-blue-500 text-blue-600"
                        : "border-purple-500 text-purple-600"
                    }
                  >
                    {trade.assetType}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <Label>Amount</Label>
                  <div className="font-mono font-medium">{trade.amount}</div>
                </div>
                <div className="space-y-2">
                  <Label>Rate</Label>
                  <div className="font-mono font-medium">
                    ₦{trade.rate?.toLocaleString()}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Payout</Label>
                  <div className="font-mono font-medium text-green-600">
                    ₦{trade.payout?.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Flags */}
            {trade.flags.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold">Flags</h3>
                <div className="flex flex-wrap gap-2">
                  {trade.flags.map((flag, index) => (
                    <Badge
                      key={index}
                      variant="destructive"
                      className="text-xs"
                    >
                      {flag.replace("_", " ")}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {trade.notes && (
              <div className="space-y-3">
                <h3 className="font-semibold">Notes</h3>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm">{trade.notes}</p>
                </div>
              </div>
            )}

            {/* Timeline */}
            <div className="space-y-3">
              <h3 className="font-semibold">Timeline</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created:</span>
                  <span>{format(new Date(trade.createdAt), "PPpp")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Updated:</span>
                  <span>{format(new Date(trade.updatedAt), "PPpp")}</span>
                </div>
              </div>
            </div>
          </div>
        ) : mode === "note" ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="note">Note</Label>
              <Textarea
                id="note"
                placeholder="Add a note about this trade..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={4}
                required
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Adding..." : "Add Note"}
              </Button>
            </DialogFooter>
          </form>
        ) : mode === "recalculate" ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Current Rate:</span>
                  <div className="font-mono font-medium">
                    ₦{trade.rate?.toLocaleString()}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Current Payout:</span>
                  <div className="font-mono font-medium">
                    ₦{trade.payout?.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newRate">New Rate (₦)</Label>
              <Input
                id="newRate"
                type="number"
                placeholder="Enter new rate"
                value={newRate}
                onChange={(e) => setNewRate(e.target.value)}
                required
                min="0"
                step="0.01"
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Recalculating..." : "Recalculate"}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>
                    {trade.user.username.slice(1, 3).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-medium">{trade.user.username}</div>
                  <div className="text-sm text-muted-foreground">
                    {trade.assetType} • {trade.amount}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold">{trade.id}</div>
                  <div className="text-sm text-muted-foreground">
                    ₦{trade.payout?.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Keep Trade
              </Button>
              <Button
                variant="destructive"
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? "Cancelling..." : "Cancel Trade"}
              </Button>
            </DialogFooter>
          </div>
        )}

        {mode === "view" && (
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
