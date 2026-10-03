import Link from 'next/link';
import { BookIcon, GlobeIcon, SparkIcon } from './icons';
import type { ChatMode, ChatSource } from './types';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  mode?: ChatMode;
  sources?: ChatSource[];
}

export function ChatMessage({ role, content, mode, sources }: ChatMessageProps) {
  const isUser = role === 'user';

  return (
    <div className={`chat-row chat-row--${isUser ? 'user' : 'assistant'}`}>
      <div className={`chat-bubble chat-bubble--${isUser ? 'user' : 'assistant'}`}>
        {mode === 'web' && (
          <span className="chat-bubble__label chat-bubble__label--web">
            <GlobeIcon />
            Answered from external web sources
          </span>
        )}
        {mode === 'general' && (
          <span className="chat-bubble__label chat-bubble__label--general">
            <SparkIcon />
            General knowledge — not from NISER sources
          </span>
        )}
        <p className="chat-bubble__text">{content}</p>
      </div>

      {sources && sources.length > 0 && (
        <div className={`chat-sources${mode === 'web' ? ' chat-sources--web' : ''}`}>
          <p className="chat-sources__title">
            {mode === 'web' ? 'External Sources' : 'Retrieved Citations'}
          </p>
          <ul className="chat-sources__list">
            {sources.map((source, idx) => (
              <li key={`${source.url}-${idx}`}>
                <Link
                  className="chat-sources__link"
                  href={source.url}
                  target={source.origin === 'web' ? '_blank' : undefined}
                  rel={source.origin === 'web' ? 'noopener noreferrer' : undefined}
                >
                  {source.origin === 'web' ? <GlobeIcon /> : <BookIcon />}
                  <span>{source.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
