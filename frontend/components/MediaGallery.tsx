"use client";

import { useState } from "react";
import Image from "next/image";
import { Media } from "@/lib/api";

interface MediaGalleryProps {
  media: Media[];
}

export function MediaGallery({ media }: MediaGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const images = media.filter((m) => m.type === "IMAGE");

  if (images.length === 0) return null;

  const selectedImage = images[selectedIndex];

  return (
    <div className="mb-8">
      <div className="relative w-full h-96 bg-gray-200 rounded-lg overflow-hidden mb-4">
        {selectedImage && (
          <Image
            src={selectedImage.url}
            alt={selectedImage.altText || "Pet image"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 800px"
            priority
          />
        )}
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => setSelectedIndex(idx)}
              className={`relative h-24 rounded-lg overflow-hidden border-2 transition-all ${
                idx === selectedIndex
                  ? "border-primary-600 ring-2 ring-primary-200"
                  : "border-transparent hover:border-gray-300"
              }`}
            >
              <Image
                src={img.url}
                alt={img.altText || `Image ${idx + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 25vw, 200px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
