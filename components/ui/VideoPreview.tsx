"use client";

import {useState} from "react";
import Image from "next/image";

import {Button} from "@/components/ui/Button";

export function VideoPreview({
  title,
  thumbnail,
  videoUrl,
}: {
  title: string;
  thumbnail: string;
  videoUrl?: string;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="overflow-hidden rounded-[var(--radius-media)] bg-[var(--card)] shadow-[var(--shadow-elevated)]">
      <div className="relative aspect-video">
        {loaded && videoUrl ? (
          <iframe
            className="h-full w-full"
            src={videoUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <>
            <Image src={thumbnail} alt={title} fill className="object-cover" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/10">
              <Button type="button" onClick={() => setLoaded(true)}>
                Play video
              </Button>
            </div>
          </>
        )}
      </div>
      <p className="font-display border-t border-[var(--line)] px-5 py-4 font-normal">{title}</p>
    </div>
  );
}
