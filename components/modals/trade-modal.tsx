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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  AlertTriangle,
  Clock,
  CheckCircle,
  Calculator,
  FileText,
  User,
} from "lucide-react";
import type { Trade } from "@/lib/types";

interface TradeModalProps {
  trade: Trade | null;
  isOpen: boolean;
  onClose: () => void;
  mode: "view" | "note" | "recalculate" | "cancel";
}

export function TradeModal({ trade, isOpen, onClose, mode }: TradeModalProps) {
  const [formData, setFormData] = useState({
    notes: "",
    cancelReason: "",
    newRate: trade?.rate || 0,
    newAmount: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!trade) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log(`${mode} trade:`, trade.id, formData);
    setIsSubmitting(false);
    onClose();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "awaiting_proof":
        return "bg-orange-500";
      case "cancelled":
        return "bg-red-500";
      case "started":
        return "bg-blue-500";
      case "rate_set":
        return "bg-purple-500";
      case "paid":
        return "bg-green-600";
      default:
        return "bg-gray-500";
    }
  };

  const timeline = [
    {
      status: "started",
      time: trade.createdAt,
      description: "Trade initiated by user",
    },
    {
      status: "rate_set",
      time: trade.updatedAt,
      description: "Rate calculated and set",
    },
    {
      status: "awaiting_proof",
      time: trade.updatedAt,
      description: "Waiting for payment proof",
    },
    {
      status: "completed",
      time: trade.updatedAt,
      description: "Trade completed successfully",
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <div className="font-semibold font-mono">{trade.id}</div>
              <div className="text-sm text-muted-foreground font-normal">
                {mode === "view" && "Trade Details"}
                {mode === "note" && "Add Note"}
                {mode === "recalculate" && "Recalculate Trade"}
                {mode === "cancel" && "Cancel Trade"}
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        {mode === "view" && (
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="calculations">Calculations</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Trade Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Trade ID:</span>
                      <span className="font-mono">{trade.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Asset Type:</span>
                      <Badge variant="outline">{trade.assetType}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Amount:</span>
                      <span className="font-mono font-semibold">
                        {trade.amount}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge
                        variant="outline"
                        className={`${getStatusColor(
                          trade.status
                        )} text-white border-0`}
                      >
                        {trade.status.replace("_", " ")}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">User Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {trade.user.username.slice(1, 3).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{trade.user.username}</div>
                        <Badge variant="outline" className="text-xs">
                          {trade.user.platform}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">User ID:</span>
                      <span className="font-mono">{trade.userId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Platform:</span>
                      <Badge
                        variant={
                          trade.user.platform === "telegram"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {trade.user.platform === "telegram"
                          ? "Telegram"
                          : "WhatsApp"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Financial Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold font-mono">
                        ₦{trade.rate?.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Exchange Rate
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold font-mono">
                        ₦{trade.payout?.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Payout Amount
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">2.5%</div>
                      <div className="text-xs text-muted-foreground">
                        Platform Fee
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">₦65,000</div>
                      <div className="text-xs text-muted-foreground">
                        Net Profit
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {trade.flags.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      Flags & Issues
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {trade.flags.map((flag, index) => (
                        <Badge
                          key={index}
                          variant="destructive"
                          className="mr-2"
                        >
                          {flag.replace("_", " ")}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="timeline" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Trade Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {timeline.map((event, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full ${
                            event.status === trade.status
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          {event.status === "completed" && (
                            <CheckCircle className="h-4 w-4" />
                          )}
                          {event.status === "awaiting_proof" && (
                            <Clock className="h-4 w-4" />
                          )}
                          {event.status === "started" && (
                            <User className="h-4 w-4" />
                          )}
                          {event.status === "rate_set" && (
                            <Calculator className="h-4 w-4" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium capitalize">
                            {event.status.replace("_", " ")}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {event.description}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(event.time).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="calculations" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">
                    Rate Calculation Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Base Rate (API):</span>
                    <span className="font-mono">₦65,000,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Auto Margin (2%):</span>
                    <span className="font-mono">₦1,300,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Platform Fee (0.5%):</span>
                    <span className="font-mono">₦325,000</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Final Rate:</span>
                    <span className="font-mono">
                      ₦{trade.rate?.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>User Payout:</span>
                    <span className="font-mono">
                      ₦{trade.payout?.toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notes" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Admin Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  {trade.adminNotes ? (
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-sm">{trade.adminNotes}</p>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No admin notes for this trade</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        {mode === "note" && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="notes">Admin Note</Label>
              <Textarea
                id="notes"
                placeholder="Add a note about this trade..."
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                required
                rows={4}
              />
            </div>
            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Note"}
              </Button>
            </DialogFooter>
          </form>
        )}

        {mode === "recalculate" && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-2">
                <Calculator className="h-4 w-4" />
                <span className="font-medium">Recalculate Trade</span>
              </div>
              <p className="text-sm text-blue-600 dark:text-blue-400">
                This will recalculate the trade with current rates or custom
                values.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="newRate">New Rate (₦)</Label>
                <Input
                  id="newRate"
                  type="number"
                  value={formData.newRate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      newRate: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newAmount">New Amount</Label>
                <Input
                  id="newAmount"
                  placeholder="e.g., 0.05 BTC"
                  value={formData.newAmount}
                  onChange={(e) =>
                    setFormData({ ...formData, newAmount: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Recalculation Reason</Label>
              <Textarea
                id="notes"
                placeholder="Reason for recalculation..."
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                required
              />
            </div>
            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Recalculating..." : "Recalculate"}
              </Button>
            </DialogFooter>
          </form>
        )}

        {mode === "cancel" && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400 mb-2">
                <AlertTriangle className="h-4 w-4" />
                <span className="font-medium">Cancel Trade</span>
              </div>
              <p className="text-sm text-red-600 dark:text-red-400">
                This action cannot be undone. The trade will be marked as
                cancelled.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cancelReason">Cancellation Reason</Label>
              <Textarea
                id="cancelReason"
                placeholder="Reason for cancelling this trade..."
                value={formData.cancelReason}
                onChange={(e) =>
                  setFormData({ ...formData, cancelReason: e.target.value })
                }
                required
              />
            </div>
            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Keep Trade
              </Button>
              <Button
                type="submit"
                variant="destructive"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Cancelling..." : "Cancel Trade"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
