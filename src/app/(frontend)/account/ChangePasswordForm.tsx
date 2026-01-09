"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { changePasswordAction } from "@/modules/user/actions/change-password.action";

export default function ChangePasswordForm() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    try {
      const res = await changePasswordAction(formData);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(res.message);
        // Optional: Reset form
        const form = document.getElementById("change-password-form") as HTMLFormElement;
        form?.reset();
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form id="change-password-form" action={handleSubmit} className="space-y-4 max-w-xl">
      <div className="space-y-2">
        <Label htmlFor="currentPassword">Current Password</Label>
        <Input id="currentPassword" name="currentPassword" type="password" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="newPassword">New Password</Label>
        <Input id="newPassword" name="newPassword" type="password" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input id="confirmPassword" name="confirmPassword" type="password" required />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Updating..." : "Update Password"}
      </Button>
    </form>
  );
}
