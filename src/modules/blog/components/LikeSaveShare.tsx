// components/posts/LikeSaveShare.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Bookmark } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function LikeSaveShare() {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
    toast.success(liked ? "Removed from likes" : "Added to likes");
  };

  const handleSave = () => {
    setSaved(!saved);
    toast.success(saved ? "Removed from saved" : "Saved for later");
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={liked ? "default" : "outline"}
        size="sm"
        onClick={handleLike}
        className={cn(
          "gap-2 transition-all",
          liked && "bg-red-500 hover:bg-red-600 border-red-500"
        )}
      >
        <Heart className={cn("h-4 w-4", liked && "fill-current")} />
        <span>{liked ? "Liked" : "Like"}</span>
        {likeCount > 0 && <span className="text-xs">({likeCount})</span>}
      </Button>
      <Button
        variant={saved ? "default" : "outline"}
        size="sm"
        onClick={handleSave}
        className="gap-2"
      >
        <Bookmark className={cn("h-4 w-4", saved && "fill-current")} />
        <span>{saved ? "Saved" : "Save"}</span>
      </Button>
    </div>
  );
}
