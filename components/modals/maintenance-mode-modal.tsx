"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertTriangle, CheckCircle } from "lucide-react";

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
  const [message, setMessage] = useState("");
  const targetMode = !currentMode;

  const handleConfirm = () => {
    onConfirm(targetMode, message);
    onClose();
    setMessage("");
  };

  const handleCancel = () => {
    onClose();
    setMessage("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {targetMode ? (
              <div className="h-10 w-10 rounded-full bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
            ) : (
              <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            )}
            <div>
              <DialogTitle>
                {targetMode
                  ? "Enable Maintenance Mode"
                  : "Disable Maintenance Mode"}
              </DialogTitle>
              <DialogDescription>
                {targetMode
                  ? "This will prevent users from accessing the system."
                  : "This will restore normal system access for users."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="message">
              {targetMode
                ? "Maintenance Message (Optional)"
                : "Restoration Note (Optional)"}
            </Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={
                targetMode
                  ? "Enter a message to display to users during maintenance..."
                  : "Enter a note about the maintenance completion..."
              }
              className="min-h-[80px]"
            />
          </div>

          {targetMode && (
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Warning:</strong> Enabling maintenance mode will
                  immediately block all user access to the system. Only
                  administrators will be able to access the dashboard.
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            className={
              targetMode
                ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                : "bg-green-600 hover:bg-green-700 text-white"
            }
          >
            {targetMode ? "Enable Maintenance" : "Restore System"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
