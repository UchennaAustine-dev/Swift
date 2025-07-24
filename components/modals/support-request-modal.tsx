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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertTriangle,
  Clock,
  CheckCircle,
  User,
  MessageSquare,
} from "lucide-react";
import type { SupportRequest } from "@/lib/types";
import { toast } from "sonner";

interface SupportRequestModalProps {
  request: SupportRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onResolve: (id: string, resolution: string) => void;
  onEscalate: (id: string, reason: string) => void;
  onAssign: (id: string, assignee: string) => void;
}

export function SupportRequestModal({
  request,
  isOpen,
  onClose,
  onResolve,
  onEscalate,
  onAssign,
}: SupportRequestModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [resolution, setResolution] = useState("");
  const [escalationReason, setEscalationReason] = useState("");
  const [selectedAssignee, setSelectedAssignee] = useState("");
  const [activeTab, setActiveTab] = useState<
    "details" | "resolve" | "escalate"
  >("details");

  if (!request) return null;

  const handleAction = async (action: () => void, successMessage: string) => {
    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      action();
      toast.success(successMessage);
      onClose();
    } catch (error) {
      toast.error("Failed to process action. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "high":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case "medium":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "low":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "high":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "low":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "in_progress":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "resolved":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "escalated":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const assignees = [
    "support_agent",
    "trade_manager",
    "super_admin",
    "technical_lead",
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Support Request Details
            <Badge
              variant="outline"
              className={getSeverityColor(request.severity)}
            >
              {getSeverityIcon(request.severity)}
              {request.severity.charAt(0).toUpperCase() +
                request.severity.slice(1)}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        {/* Tab Navigation */}
        <div className="flex border-b">
          <button
            className={`px-4 py-2 text-sm font-medium border-b-2 ${
              activeTab === "details"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setActiveTab("details")}
          >
            Details
          </button>
          {request.status !== "resolved" && (
            <>
              <button
                className={`px-4 py-2 text-sm font-medium border-b-2 ${
                  activeTab === "resolve"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setActiveTab("resolve")}
              >
                Resolve
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium border-b-2 ${
                  activeTab === "escalate"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setActiveTab("escalate")}
              >
                Escalate
              </button>
            </>
          )}
        </div>

        <div className="space-y-6">
          {activeTab === "details" && (
            <>
              {/* Request Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Request Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Request ID
                      </Label>
                      <div className="font-mono font-medium mt-1">
                        {request.id}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Issue Type
                      </Label>
                      <div className="mt-1">
                        <Badge variant="outline">{request.issueType}</Badge>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>
                        {request.user.startsWith("@")
                          ? request.user.slice(1, 3).toUpperCase()
                          : request.user.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-medium text-lg">{request.user}</div>
                      <div className="text-sm text-muted-foreground">User</div>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Status
                      </Label>
                      <div className="mt-1">
                        <Badge
                          variant="outline"
                          className={getStatusColor(request.status)}
                        >
                          {request.status === "in_progress"
                            ? "In Progress"
                            : request.status.charAt(0).toUpperCase() +
                              request.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Assigned To
                      </Label>
                      <div className="flex items-center gap-2 mt-1">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium capitalize">
                          {request.assignedTo === "Unassigned"
                            ? "Unassigned"
                            : request.assignedTo}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Created
                    </Label>
                    <div className="font-medium mt-1">{request.created}</div>
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Description
                    </Label>
                    <div className="mt-1 p-3 bg-muted/50 rounded-md">
                      <p className="text-sm">{request.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Assignment */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Assignment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Label htmlFor="assignee">Assign to</Label>
                      <Select
                        value={selectedAssignee}
                        onValueChange={setSelectedAssignee}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select assignee" />
                        </SelectTrigger>
                        <SelectContent>
                          {assignees.map((assignee) => (
                            <SelectItem key={assignee} value={assignee}>
                              {assignee
                                .replace("_", " ")
                                .charAt(0)
                                .toUpperCase() +
                                assignee.replace("_", " ").slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      onClick={() =>
                        handleAction(
                          () => onAssign(request.id, selectedAssignee),
                          "Request assigned successfully"
                        )
                      }
                      disabled={!selectedAssignee || isProcessing}
                    >
                      {isProcessing ? "Assigning..." : "Assign"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {activeTab === "resolve" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Resolve Request</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="resolution">Resolution Details</Label>
                  <Textarea
                    id="resolution"
                    placeholder="Describe how this issue was resolved..."
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                    rows={4}
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={() =>
                      handleAction(
                        () => onResolve(request.id, resolution),
                        "Request resolved successfully"
                      )
                    }
                    disabled={!resolution.trim() || isProcessing}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isProcessing ? "Resolving..." : "Mark as Resolved"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab("details")}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "escalate" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Escalate Request</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="escalation">Escalation Reason</Label>
                  <Textarea
                    id="escalation"
                    placeholder="Explain why this request needs to be escalated..."
                    value={escalationReason}
                    onChange={(e) => setEscalationReason(e.target.value)}
                    rows={4}
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="destructive"
                    onClick={() =>
                      handleAction(
                        () => onEscalate(request.id, escalationReason),
                        "Request escalated successfully"
                      )
                    }
                    disabled={!escalationReason.trim() || isProcessing}
                  >
                    {isProcessing ? "Escalating..." : "Escalate Request"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab("details")}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Close Button */}
          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
