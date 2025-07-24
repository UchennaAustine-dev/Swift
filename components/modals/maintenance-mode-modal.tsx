"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, Clock } from "lucide-react";
import { toast } from "sonner";

interface MaintenanceModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMode: boolean;
  onConfirm: (enabled: boolean, message?: string) => void;
}

export function MaintenanceModeModal({
  isOpen,
  onClose,
  currentMode,
  onConfirm,
}: MaintenanceModeModalProps) {
  const [maintenanceEnabled, setMaintenanceEnabled] = useState(currentMode);
  const [maintenanceMessage, setMaintenanceMessage] = useState(
    "System is currently under maintenance. Please try again later."
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      onConfirm(maintenanceEnabled, maintenanceMessage);
      toast.success(
        maintenanceEnabled
          ? "Maintenance mode enabled"
          : "Maintenance mode disabled"
      );
      onClose();
    } catch (error) {
      toast.error("Failed to update maintenance mode");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Maintenance Mode
          </DialogTitle>
          <DialogDescription>
            {maintenanceEnabled
              ? "This will prevent users from accessing the system."
              : "This will restore normal system access for users."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                <Clock className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <Label className="text-sm font-medium">
                  Enable Maintenance Mode
                </Label>
                <p className="text-xs text-muted-foreground">
                  Block user access to the system
                </p>
              </div>
            </div>
            <Switch
              checked={maintenanceEnabled}
              onCheckedChange={setMaintenanceEnabled}
              className="data-[state=checked]:bg-yellow-500"
            />
          </div>

          {maintenanceEnabled && (
            <div className="space-y-2">
              <Label htmlFor="maintenance-message">Maintenance Message</Label>
              <Textarea
                id="maintenance-message"
                value={maintenanceMessage}
                onChange={(e) => setMaintenanceMessage(e.target.value)}
                placeholder="Enter message to display to users..."
                className="min-h-[80px]"
              />
            </div>
          )}

          {maintenanceEnabled && (
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                <div className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Warning:</strong> Enabling maintenance mode will
                  immediately block all user access to the system.
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading}
            variant={maintenanceEnabled ? "destructive" : "default"}
            className="bg-yellow-600 hover:bg-yellow-600 text-white cursor-pointer"
          >
            {isLoading ? "Updating..." : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
