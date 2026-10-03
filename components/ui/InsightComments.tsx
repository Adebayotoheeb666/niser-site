"use client";

import { useEffect, useState, type FormEvent } from "react";
import type { Insight } from "@/types/cms";

interface InsightCommentsProps {
  insight: Insight;
}

interface CommentEntry {
  id: string;
  text: string;
  createdAt: string;
}

export default function InsightComments({ insight }: InsightCommentsProps) {
  const [comments, setComments] = useState<CommentEntry[]>([]);
  const [draft, setDraft] = useState("");
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    const storageKey = `policy-brief-comments:${insight.slug || insight.id}`;

    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as CommentEntry[];
        setComments(Array.isArray(parsed) ? parsed : []);
      }
    } catch {
      // Ignore local storage issues.
    }
  }, [insight.id, insight.slug]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed) return;

    const entry: CommentEntry = {
      id: `${insight.id}-${Date.now()}`,
      text: trimmed,
      createdAt: new Date().toISOString(),
    };

    const nextComments = [entry, ...comments];
    setComments(nextComments);
    setDraft("");

    const storageKey = `policy-brief-comments:${insight.slug || insight.id}`;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(nextComments));
    } catch {
      // Ignore local storage issues.
    }
  };

  return (
    <section className="mt-8 rounded-lg border border-surface-gray bg-surface-container-lowest p-6">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-lg">comment</span>
        <h2 className="text-lg font-semibold text-nigeria-green-deep">
          Comments {isHydrated ? `(${comments.length})` : ""}
        </h2>
      </div>
      <p className="mt-2 text-sm text-on-surface-variant">
        Share your thoughts on this brief.
      </p>

      <form onSubmit={handleSubmit} className="mt-4">
        <label htmlFor={`insight-comment-${insight.slug || insight.id}`} className="sr-only">
          Add a comment for this brief
        </label>
        <textarea
          id={`insight-comment-${insight.slug || insight.id}`}
          rows={3}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Write a comment about this brief..."
          className="w-full rounded-md border border-outline px-3 py-2 text-sm text-on-surface bg-surface-container-lowest"
        />
        <button
          type="submit"
          className="mt-3 rounded-md bg-nigeria-green-vibrant px-4 py-2 text-sm font-semibold text-on-primary hover:bg-nigeria-green-deep"
        >
          Post comment
        </button>
      </form>

      {comments.length > 0 && (
        <ul className="mt-5 space-y-3">
          {comments.map((comment) => (
            <li key={comment.id} className="rounded-md border border-surface-gray bg-surface-container-lowest px-3 py-3">
              <p className="text-sm text-on-surface">{comment.text}</p>
              <p className="mt-1 text-xs text-on-surface-variant">
                {new Date(comment.createdAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
