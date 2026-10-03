"use client";

import { useState } from "react";
import Image from "next/image";

interface InsightImageViewerProps {
  imageUrl: string;
  alt: string;
}

export default function InsightImageViewer({ imageUrl, alt }: InsightImageViewerProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!imageUrl) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="relative mt-6 block h-64 w-full overflow-hidden rounded-xl border border-surface-gray bg-surface-container-lowest text-left"
        aria-label={`View ${alt}`}
      >
        <Image
          src={imageUrl}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 800px"
          className="object-cover transition duration-200 hover:scale-[1.02]"
        />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Image preview"
          onClick={() => setIsOpen(false)}
        >
          <div className="relative max-h-full max-w-5xl rounded-xl bg-white p-2 shadow-2xl">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute right-3 top-3 rounded-full bg-black/70 px-3 py-1 text-sm font-semibold text-white"
              aria-label="Close image preview"
            >
              Close
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element -- lightbox needs natural image dimensions */}
            <img
              src={imageUrl}
              alt={alt}
              className="max-h-[85vh] max-w-full rounded-lg object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}
