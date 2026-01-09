"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { updateProfile } from "@/modules/user/actions/update-profile.action";
import { User, Profile } from "@/generated/prisma";
import { AvatarUpload } from "@/components/ui/avatar-upload";
import { useAuth } from "@/modules/user/hooks/useAuth";

interface AccountFormProps {
  user: User & { profile?: Profile | null };
}

export default function AccountForm({ user }: AccountFormProps) {
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(user.image);
  const { update } = useAuth();

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    
    // Append avatar URL if it changed
    if (avatarUrl && avatarUrl !== user.image) {
        formData.set("image", avatarUrl);
    }

    try {
        const res = await updateProfile(formData);

        if (res.error) {
            toast.error(res.error);
        } else {
            // Trigger session update to refresh header avatar
            await update({
                user: {
                    ...user,
                    name: `${formData.get("firstName")} ${formData.get("lastName")}`,
                    image: avatarUrl || user.image
                }
            });
            toast.success("Profile updated successfully");
        }
    } catch (err) {
        toast.error("Something went wrong");
    } finally {
        setLoading(false);
    }
  };

  return (
    <form action={handleSubmit} className="space-y-6 max-w-xl">
      
      <div className="space-y-2">
        <Label>Profile Picture</Label>
        <AvatarUpload 
            name={user.name || "User"} 
            currentImage={user.image} 
            onUpload={setAvatarUrl} 
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input id="firstName" name="firstName" defaultValue={user.firstName || ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input id="lastName" name="lastName" defaultValue={user.lastName || ""} />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input id="username" name="username" defaultValue={user.username || ""} />
        <p className="text-xs text-muted-foreground">This is your public display name.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input id="phone" name="phoneNumber" defaultValue={user.phoneNumber || ""} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea 
          id="bio" 
          name="bio" 
          placeholder="Tell us a little about yourself" 
          defaultValue={user.profile?.bio || ""}
          className="resize-none"
          rows={4}
        />
        <p className="text-xs text-muted-foreground">Brief description for your profile.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" value={user.email} disabled className="bg-muted" />
        <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
