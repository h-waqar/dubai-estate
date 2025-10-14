// components/posts/PrintDownload.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Printer, Download } from "lucide-react";
import { toast } from "sonner";

export function PrintDownload() {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    toast.info("PDF download feature coming soon!");
    // TODO: Implement PDF generation
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <Button
        variant="outline"
        className="w-full justify-start gap-2"
        onClick={handlePrint}
      >
        <Printer className="h-4 w-4" />
        Print Article
      </Button>
      <Button
        variant="outline"
        className="w-full justify-start gap-2"
        onClick={handleDownload}
      >
        <Download className="h-4 w-4" />
        Download PDF
      </Button>
    </div>
  );
}
