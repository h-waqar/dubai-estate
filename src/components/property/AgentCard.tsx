import React from "react";
import Image from "next/image";
import { User, Phone, Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface AgentCardProps {
  name: string | null;
  image: string | null;
  email: string;
  phone: string | null;
  propertyRef?: string | null;
  propertySlug?: string;
}

export const AgentCard = ({
  name,
  image,
  email,
  phone,
  propertyRef,
  propertySlug,
}: AgentCardProps) => {
  const displayName = name || "Estate Agent";

  // Construct WhatsApp URL if phone exists
  let whatsappUrl = null;
  if (phone) {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://dubai-estate.com";
    const propertyUrl = propertySlug ? `${baseUrl}/properties/${propertySlug}` : baseUrl;
    const refText = propertyRef ? ` (Ref: ${propertyRef})` : "";
    
    const message = `Hi, I am interested in this property${refText}.\nHere is the link: ${propertyUrl}`;
    const encodedMessage = encodeURIComponent(message);
    
    // Clean phone number for URL (remove spaces, +, etc if needed, but usually wa.me handles international format if it starts with country code)
    // Assuming phone comes in a usable format or just stripping non-digits/plus
    const cleanPhone = phone.replace(/[^\d+]/g, "");
    
    whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-muted overflow-hidden relative">
            {image ? (
              <Image
                src={image}
                alt={displayName}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">
                <User className="w-8 h-8" />
              </div>
            )}
          </div>
          <div>
            <h3 className="font-bold text-lg">{displayName}</h3>
            <p className="text-sm text-muted-foreground">Listing Agent</p>
          </div>
        </div>

        <div className="space-y-3">
          {phone && (
            <Button className="w-full" size="lg" asChild>
              <a href={`tel:${phone}`}>
                <Phone className="w-4 h-4 mr-2" />
                Call Agent
              </a>
            </Button>
          )}

          {whatsappUrl && (
            <Button
              className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white border-transparent"
              size="lg"
              asChild
            >
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-4 h-4 mr-2" />
                Call Agent WhatsApp
              </a>
            </Button>
          )}
          
          <Button variant="outline" className="w-full" size="lg" asChild>
            <a href={`mailto:${email}`}>
              <Mail className="w-4 h-4 mr-2" />
              Email Agent
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
