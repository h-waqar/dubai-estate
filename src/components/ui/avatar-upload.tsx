"use client";

import { useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Upload, Loader2, X } from "lucide-react";
import { uploadImageAction } from "@/modules/media/actions/upload.action";
import { toast } from "sonner";

interface AvatarUploadProps {
  currentImage?: string | null;
  name: string;
  onUpload: (url: string) => void;
}

export function AvatarUpload({ currentImage, name, onUpload }: AvatarUploadProps) {
  const [image, setImage] = useState(currentImage);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (e.g., 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const res = await uploadImageAction(formData);

    if (res.error) {
      toast.error(res.error);
    } else if (res.url) {
      setImage(res.url);
      onUpload(res.url);
      toast.success("Avatar uploaded successfully");
    }
    
    setUploading(false);
  };

  return (
    <div className="flex items-center gap-6">
      <Avatar className="h-20 w-20 border-2 border-muted">
        <AvatarImage src={image || ""} alt={name} />
        <AvatarFallback className="text-lg bg-primary/10">
          {name.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
          >
            {uploading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Upload className="mr-2 h-4 w-4" />
            )}
            Upload New
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Recommended: Square JPG, PNG. Max 5MB.
        </p>
      </div>
    </div>
  );
}
