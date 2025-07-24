"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, Clock, Copy, ExternalLink } from "lucide-react";
import type { Payout } from "@/lib/types";
import { toast } from "sonner";

interface PayoutDetailsModalProps {
  payout: Payout | null;
  isOpen: boolean;
  onClose: () => void;
  onRetry: (id: string) => void;
  onMarkPaid: (id: string) => void;
  onCancel: (id: string) => void;
}

export function PayoutDetailsModal({
  payout,
  isOpen,
  onClose,
  onRetry,
  onMarkPaid,
  onCancel,
}: PayoutDetailsModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [notes, setNotes] = useState("");

  if (!payout) return null;

  const handleAction = async (action: () => void) => {
    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      action();
      toast.success("Payout has been updated successfully");
      onClose();
    } catch (error) {
      toast.error("Failed to process action. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Text copied to clipboard");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "failed":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Payout Details
            <Badge
              variant={
                payout.status === "paid"
                  ? "default"
                  : payout.status === "pending"
                  ? "secondary"
                  : "destructive"
              }
              className={
                payout.status === "paid"
                  ? "bg-green-500"
                  : payout.status === "pending"
                  ? "bg-yellow-500"
                  : ""
              }
            >
              {getStatusIcon(payout.status)}
              {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Transaction Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Payout ID
                  </Label>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-mono font-medium">
                      {payout.payoutId}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => copyToClipboard(payout.payoutId)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Trade ID
                  </Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Button
                      variant="link"
                      className="p-0 h-auto font-mono text-blue-600"
                      onClick={() => copyToClipboard(payout.tradeId)}
                    >
                      {payout.tradeId}
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback>
                    {payout.user.username.slice(1, 3).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-medium text-lg">
                    {payout.user.username}
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-xs w-fit ${
                      payout.user.platform === "telegram"
                        ? "border-blue-500 text-blue-600"
                        : "border-green-500 text-green-600"
                    }`}
                  >
                    {payout.user.platform}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Amount
                  </Label>
                  <div className="text-2xl font-mono font-bold mt-1">
                    {payout.currency}
                    {payout.amount.toLocaleString()}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Payment Method
                  </Label>
                  <div className="mt-1">
                    <Badge variant="outline">
                      {payout.method === "bank" ? "Bank Transfer" : "Wallet"}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Processed By
                  </Label>
                  <div className="font-medium mt-1 capitalize">
                    {payout.processedBy === "auto"
                      ? "Automatic System"
                      : payout.processedBy}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Created At
                  </Label>
                  <div className="font-medium mt-1">
                    {new Date(payout.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>

              {payout.failureReason && (
                <>
                  <Separator />
                  <div>
                    <Label className="text-sm font-medium text-red-600">
                      Failure Reason
                    </Label>
                    <div className="mt-1 p-3 bg-red-50 dark:bg-red-900/20 rounded-md">
                      <span className="text-sm text-red-600 dark:text-red-400">
                        {payout.failureReason}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Admin Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Admin Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="notes">Add notes about this payout</Label>
                <Textarea
                  id="notes"
                  placeholder="Enter any notes or comments about this payout..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            {payout.status === "failed" && (
              <Button
                onClick={() => handleAction(() => onRetry(payout.id))}
                disabled={isProcessing}
                className="flex-1"
              >
                {isProcessing ? "Processing..." : "Retry Payment"}
              </Button>
            )}

            {payout.status === "pending" && (
              <Button
                onClick={() => handleAction(() => onMarkPaid(payout.id))}
                disabled={isProcessing}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {isProcessing ? "Processing..." : "Mark as Paid"}
              </Button>
            )}

            {payout.status !== "paid" && (
              <Button
                variant="destructive"
                onClick={() => handleAction(() => onCancel(payout.id))}
                disabled={isProcessing}
                className="flex-1"
              >
                {isProcessing ? "Processing..." : "Cancel Payout"}
              </Button>
            )}

            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-transparent"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
