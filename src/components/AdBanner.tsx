import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface AdBannerProps {
  position: "header" | "sidebar" | "content" | "footer";
  className?: string;
}

interface Advertisement {
  id: string;
  title: string;
  image_url: string;
  link_url?: string;
  position: string;
  active: boolean;
  clicks: number;
  impressions: number;
}

export const AdBanner = ({ position, className = "" }: AdBannerProps) => {
  const [ad, setAd] = useState<Advertisement | null>(null);

  useEffect(() => {
    const fetchAd = async () => {
      const { data } = await supabase
        .from("advertisements")
        .select("*")
        .eq("position", position)
        .eq("active", true)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (data) {
        setAd(data);
        // Track impression
        await supabase
          .from("advertisements")
          .update({ impressions: data.impressions + 1 })
          .eq("id", data.id);
      }
    };

    fetchAd();
  }, [position]);

  if (!ad) return null;

  const handleClick = async () => {
    // Track click
    await supabase
      .from("advertisements")
      .update({ clicks: ad.clicks + 1 })
      .eq("id", ad.id);

    if (ad.link_url) {
      window.open(ad.link_url, "_blank");
    }
  };

  return (
    <div className={`bg-muted/50 rounded-lg overflow-hidden ${className}`}>
      <div className="text-xs text-muted-foreground text-center p-1 bg-muted">
        PUBLICIDADE
      </div>
      <div 
        className="cursor-pointer hover:opacity-90 transition-opacity"
        onClick={handleClick}
      >
        <img
          src={ad.image_url}
          alt={ad.title}
          className="w-full h-auto object-cover"
        />
      </div>
    </div>
  );
};