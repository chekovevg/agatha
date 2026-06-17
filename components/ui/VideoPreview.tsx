"use client";

import {useState} from "react";
import Image from "next/image";

import {Button} from "@/components/ui/Button";

export function VideoPreview({
  title,
  thumbnail,
  videoUrl,
  playLabel = "Play video",
  className = "",
  unoptimizedThumbnail = false,
}: {
  title: string;
  thumbnail: string;
  videoUrl?: string;
  playLabel?: string;
  className?: string;
  unoptimizedThumbnail?: boolean;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={className}>
      <div className="relative aspect-video overflow-hidden rounded-[var(--radius-media)]">
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
            <Image
              src={thumbnail}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, 1440px"
              className="object-cover"
              quality={95}
              priority
              unoptimized={unoptimizedThumbnail}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Button
                type="button"
                className="min-w-[12em] bg-[var(--paper)] px-[3em] text-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--paper)]"
                onClick={() => setLoaded(true)}
              >
                {playLabel}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
