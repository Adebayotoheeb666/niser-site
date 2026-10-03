"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Insight } from "@/types/cms";

interface PolicyBriefCardProps {
  insight: Insight;
  summary: string;
  author: string;
  date: string;
}

export default function PolicyBriefCard({
  insight,
  summary,
  author,
  date,
}: PolicyBriefCardProps) {
  const [commentCount, setCommentCount] = useState(0);

  useEffect(() => {
    try {
      const storageKey = `policy-brief-comments:${insight.slug || insight.id}`;
      const saved = window.localStorage.getItem(storageKey);
      if (!saved) {
        return;
      }

      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        setCommentCount(parsed.length);
      }
    } catch {
      setCommentCount(0);
    }
  }, [insight.id, insight.slug]);

  const excerpt = useMemo(() => {
    const raw = summary || insight.socialSummary || insight.excerpt || insight.bodyPlaintext || insight.body || "";
    const text = typeof raw === "string"
      ? raw.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
      : "";

    return text;
  }, [summary, insight.socialSummary, insight.excerpt, insight.bodyPlaintext, insight.body]);

  return (
    <article className="bg-surface-container-lowest border border-surface-gray p-6 rounded-lg hover:shadow-lg transition-shadow">
      <span className="inline-block px-3 py-1 bg-accent-mint/20 text-accent-mint rounded-full font-label-sm text-label-sm mb-4">
        Policy Brief
      </span>
      <h3 className="font-headline-md text-headline-md text-nigeria-green-deep mb-3 line-clamp-2">
        {insight.title}
      </h3>
      {excerpt && (
        <p className="font-body-md text-body-md text-on-surface-variant mb-4 line-clamp-3">
          {excerpt}
        </p>
      )}
      <div className="mb-4 text-label-sm text-on-surface-variant">
        {commentCount > 0
          ? `${commentCount} comment${commentCount === 1 ? "" : "s"}`
          : "No comments yet"}
      </div>
      {insight.tags && insight.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {insight.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="inline-block px-2 py-0.5 bg-surface-container-high text-on-surface-variant rounded font-label-sm text-label-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      <div className="flex justify-between items-center gap-3">
        <div>
          <span className="text-label-sm text-outline block">{date}</span>
          {author && (
            <span className="text-label-sm text-on-surface-variant">{author}</span>
          )}
        </div>
        <Link
          href={`/insights/${insight.slug}`}
          aria-label={`Read ${insight.title}`}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-nigeria-green-vibrant text-nigeria-green-vibrant transition hover:bg-nigeria-green-vibrant hover:text-white"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
            <path d="M13.17 12 8.83 7.76a1 1 0 1 1 1.34-1.48l5.14 4.66a1.2 1.2 0 0 1 0 1.8l-5.14 4.66A1 1 0 0 1 8.83 16.24L13.17 12Z" />
          </svg>
        </Link>
      </div>
    </article>
  );
}
