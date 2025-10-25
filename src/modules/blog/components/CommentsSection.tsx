// components/posts/CommentsSection.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Send } from "lucide-react";
import { toast } from "sonner";

interface Comment {
  id: number;
  author: string;
  avatar?: string;
  content: string;
  date: Date;
  replies?: Comment[];
}

export function CommentsSection() {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      author: "Sarah Johnson",
      content: "Great article! Very informative and well-written.",
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      id: 2,
      author: "Michael Chen",
      content:
        "Thanks for sharing these insights about Dubai real estate market.",
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error("Please write a comment");
      return;
    }

    // TODO: Implement actual comment submission
    const newComment: Comment = {
      id: comments.length + 1,
      author: "You",
      content: comment,
      date: new Date(),
    };

    setComments([newComment, ...comments]);
    setComment("");
    toast.success("Comment posted successfully!");
  };

  return (
    <section className="mt-16 pt-12 border-t">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="h-5 w-5" />
        <h2 className="text-2xl font-bold">Comments ({comments.length})</h2>
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <Textarea
          placeholder="Share your thoughts..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="min-h-[100px] mb-3"
        />
        <div className="flex justify-end">
          <Button type="submit" className="gap-2">
            <Send className="h-4 w-4" />
            Post Comment
          </Button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <div className="text-center py-12 bg-muted/30 rounded-lg">
            <MessageSquare className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
            <p className="text-muted-foreground">
              No comments yet. Be the first to share your thoughts!
            </p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={comment.avatar} />
                <AvatarFallback>
                  {comment.author
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{comment.author}</h4>
                    <time className="text-xs text-muted-foreground">
                      {formatDate(comment.date)}
                    </time>
                  </div>
                  <p className="text-sm">{comment.content}</p>
                </div>
                <div className="flex items-center gap-4 mt-2 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs h-auto py-1"
                  >
                    Reply
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs h-auto py-1"
                  >
                    Like
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

function formatDate(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}
