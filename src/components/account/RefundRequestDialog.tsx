"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { requestRefundAction } from "@/modules/user/actions/subscription";
import { toast } from "sonner";
import { Loader2, RotateCcw } from "lucide-react";

export default function RefundRequestDialog({ subscriptionId }: { subscriptionId: string }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!reason.trim()) {
      toast.error("Please provide a reason");
      return;
    }
    setLoading(true);
    const result = await requestRefundAction(subscriptionId, reason);
    setLoading(false);

    if (result.success) {
      toast.success("Refund request submitted to support.");
      setOpen(false);
      setReason("");
    } else {
      toast.error(result.error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
          <RotateCcw className="mr-2 h-4 w-4" /> Request Refund
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request a Refund</DialogTitle>
          <DialogDescription>
            Submit a request to our support team. Refunds are processed within 3-5 business days upon approval.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Reason for refund</Label>
            <Textarea 
              placeholder="Please explain why you are requesting a refund..." 
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}