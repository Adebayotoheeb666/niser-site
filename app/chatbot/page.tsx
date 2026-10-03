'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { trackMatomoEvent } from '@/lib/matomo';
import '@/components/chat/chat.css';
import { ChatStatusBadge } from '@/components/chat/ChatStatusBadge';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { ChatTypingIndicator } from '@/components/chat/ChatTypingIndicator';
import { ChatComposer } from '@/components/chat/ChatComposer';
import { BotIcon } from '@/components/chat/icons';
import type { ChatMode, ChatSource } from '@/components/chat/types';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  mode?: ChatMode;
  sources?: ChatSource[];
}

const WELCOME_MESSAGE =
  'Hello! I am the NISER Research Assistant. Ask me questions about NISER\'s publications, policy briefs, active researchers, and research divisions. I answer from the NISER repository, and for questions it does not cover I may draw on external web sources or general knowledge, which I will always label as such.';

function buildFingerprint(): string {
  if (typeof window === 'undefined') return '';
  const parts = [
    navigator.userAgent,
    navigator.language,
    navigator.platform ?? '',
    window.screen.width,
    window.screen.height,
    window.screen.colorDepth,
    Intl.DateTimeFormat().resolvedOptions().timeZone ?? '',
  ];
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  const input = parts.join('|');
  for (let i = 0; i < input.length; i += 1) {
    const ch = input.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (h2 >>> 0).toString(16).padStart(8, '0') + (h1 >>> 0).toString(16).padStart(8, '0');
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: WELCOME_MESSAGE,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [serviceReady, setServiceReady] = useState<boolean | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fingerprint = useMemo(() => buildFingerprint(), []);

  // Scroll to bottom on message update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    let active = true;
    fetch('/api/ai/status')
      .then((response) => response.ok ? response.json() : null)
      .then((status) => { if (active) setServiceReady(Boolean(status?.readyForChat)); })
      .catch(() => { if (active) setServiceReady(false); });
    return () => { active = false; abortRef.current?.abort(); };
  }, []);

  // Restore the server-side conversation for this session (session memory).
  useEffect(() => {
    let active = true;
    fetch('/api/chatbot/history')
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (!active) return;
        const stored = Array.isArray(data?.messages)
          ? (data.messages as Array<{ role: string; content: string }>).filter(
              (m) => m.role === 'user' || m.role === 'assistant',
            )
          : [];
        if (stored.length > 0) {
          setMessages((prev) => [
            ...prev.filter((m) => m.id === 'welcome'),
            ...stored.map((m, i) => ({
              id: `restored-${i}`,
              role: m.role as 'user' | 'assistant',
              content: m.content,
            })),
          ]);
        }
      })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    void trackMatomoEvent('chatbot', 'message_sent', text.slice(0, 80), 1);

    if (!textToSend) {
      setInput('');
    }

    const userMsgId = Date.now().toString();
    const userMessage: Message = {
      id: userMsgId,
      role: 'user',
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    const assistantMsgId = (Date.now() + 1).toString();
    const assistantMessage: Message = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
    };

    setMessages((prev) => [...prev, assistantMessage]);

    try {
      abortRef.current = new AbortController();
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: abortRef.current.signal,
        body: JSON.stringify({
          message: text,
          fingerprint,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error ?? `Chat request failed (${response.status})`);
      }
      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let accumulatedContent = '';
      let sourcesList: ChatSource[] = [];
      let responseMode: Message['mode'] | undefined;
      let buffer = '';

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          buffer += decoder.decode(value, { stream: true });

          // Process all complete SSE messages separated by double newlines
          let idx;
          while ((idx = buffer.indexOf('\n\n')) !== -1) {
            const raw = buffer.slice(0, idx);
            buffer = buffer.slice(idx + 2);

            if (!raw.startsWith('data: ')) continue;
            const payload = raw.substring(6).trim();
            if (!payload) continue;
            if (payload === '[DONE]') {
              done = true;
              break;
            }

            try {
              const data = JSON.parse(payload);
              if (data.token) {
                accumulatedContent += data.token;
                setMessages((prev) =>
                  prev.map((m) => (m.id === assistantMsgId ? { ...m, content: accumulatedContent } : m))
                );
              } else if (data.event === 'mode' && (data.mode === 'niser' || data.mode === 'web' || data.mode === 'general' || data.mode === 'none')) {
                responseMode = data.mode;
                setMessages((prev) => prev.map((m) => (m.id === assistantMsgId ? { ...m, mode: responseMode } : m)));
              } else if (data.event === 'sources' && data.sources) {
                sourcesList = data.sources;
                if (data.mode === 'niser' || data.mode === 'web' || data.mode === 'general' || data.mode === 'none') {
                  responseMode = data.mode;
                }
                setMessages((prev) => prev.map((m) => (m.id === assistantMsgId ? { ...m, sources: sourcesList, mode: responseMode } : m)));
              }
            } catch {
              // Partial JSON chunk or non-JSON payload — prepend back to buffer for next iteration
              buffer = raw + '\n\n' + buffer;
              break;
            }
          }
        }
      }

      // Process any leftover buffer after stream closes
      if (buffer.trim()) {
        const parts = buffer.split('\n\n');
        for (const part of parts) {
          if (!part.startsWith('data: ')) continue;
          const payload = part.substring(6).trim();
          try {
            const data = JSON.parse(payload);
            if (data.token) {
              accumulatedContent += data.token;
            } else if (data.event === 'mode' && (data.mode === 'niser' || data.mode === 'web' || data.mode === 'general' || data.mode === 'none')) {
              responseMode = data.mode;
            } else if (data.event === 'sources' && data.sources) {
              sourcesList = data.sources;
              if (data.mode === 'niser' || data.mode === 'web' || data.mode === 'general' || data.mode === 'none') {
                responseMode = data.mode;
              }
            }
          } catch {
            // ignore
          }
        }

        if (accumulatedContent) {
          setMessages((prev) => prev.map((m) => (m.id === assistantMsgId ? { ...m, content: accumulatedContent } : m)));
        }

        if (sourcesList.length > 0 || responseMode) {
          setMessages((prev) =>
            prev.map((m) => (m.id === assistantMsgId ? { ...m, sources: sourcesList, mode: responseMode } : m))
          );
        }
      }
    } catch (error) {
      console.error('Chatbot request failed:', error);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsgId
            ? {
                ...m,
                content:
                  error instanceof Error ? error.message : 'Sorry, I encountered an error communicating with the NISER AI engine. Please try again.',
              }
            : m
        )
      );
    } finally {
      abortRef.current = null;
      setLoading(false);
    }
  };

  const handleClear = async () => {
    if (loading) return;
    try {
      await fetch('/api/chatbot/clear', { method: 'POST' });
    } catch (error) {
      console.warn('Failed to clear chat memory:', error);
    }
    abortRef.current?.abort();
    setMessages([{ id: 'welcome', role: 'assistant', content: WELCOME_MESSAGE }]);
  };

  const suggestedPrompts = [
    'Who are you?',
    'What research does NISER do on poverty?',
    'Tell me about Dr. Abel Eze\'s profile.',
    'List recent policy insights regarding subsidies.',
  ];

  return (
    <main id="main-content" className="chat-page">
      <div className="chat-card">
        <header className="chat-card__header">
          <div className="chat-brand">
            <div className="chat-brand__emblem" aria-hidden="true">
              <BotIcon />
            </div>
            <div>
              <h1 className="chat-brand__title">NISER Assistant</h1>
              <p className="chat-brand__subtitle">Research help, publications, and policy insights</p>
              <p className="chat-brand__meta">Remembers your conversation and research interests</p>
            </div>
          </div>
          <ChatStatusBadge status={serviceReady} />
        </header>

        <section className="chat-thread" aria-label="Conversation">
          <div className="chat-thread__inner">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                role={message.role}
                content={message.content}
                mode={message.mode}
                sources={message.sources}
              />
            ))}

            {loading && messages[messages.length - 1]?.content === '' && <ChatTypingIndicator />}

            <div ref={messagesEndRef} />
          </div>
        </section>

        <ChatComposer
          input={input}
          loading={loading}
          showPrompts={messages.length === 1 && !loading}
          suggestedPrompts={suggestedPrompts}
          onInputChange={setInput}
          onPromptSelect={(prompt) => void handleSend(prompt)}
          onSend={() => handleSend()}
          onClear={handleClear}
          onStop={() => abortRef.current?.abort()}
        />
      </div>
    </main>
  );
}
