'use client';

import { useState, useRef, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: { title: string; url: string; excerpt: string }[];
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Hello! I am the NISER Research Assistant. Ask me questions about NISER\'s publications, policy briefs, active researchers, and research divisions. I will find relevant sources and answer your queries.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on message update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

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
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let accumulatedContent = '';
      let sourcesList: { title: string; url: string; excerpt: string }[] = [];

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunkStr = decoder.decode(value);
          const lines = chunkStr.split('\n\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.substring(6));
                if (data.token) {
                  accumulatedContent += data.token;
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === assistantMsgId
                        ? { ...m, content: accumulatedContent }
                        : m
                    )
                  );
                } else if (data.event === 'sources' && data.sources) {
                  sourcesList = data.sources;
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === assistantMsgId ? { ...m, sources: sourcesList } : m
                    )
                  );
                }
              } catch {
                // Ignore json parsing errors on partial chunks
              }
            }
          }
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
                  'Sorry, I encountered an error communicating with the NISER AI engine. Please try again.',
              }
            : m
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const suggestedPrompts = [
    'Who are you?',
    'What research does NISER do on poverty?',
    'Tell me about Dr. Abel Eze\'s profile.',
    'List recent policy insights regarding subsidies.',
  ];

  return (
    <>
      <Header />
      <main id="main-content" style={{ minHeight: '80vh', backgroundColor: 'var(--gray-50)', display: 'flex', flexDirection: 'column' }}>
        {/* Chat Header Banner */}
        <div style={{ backgroundColor: '#fff', borderBottom: '1px solid var(--color-border)', padding: '1.5rem 0' }}>
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontSize: '1.75rem', color: 'var(--niser-green)', margin: 0, fontFamily: 'var(--font-sans)', fontWeight: 700 }}>
                Ask NISER Research Assistant
              </h1>
              <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>
                AI-powered research discoveries, citations, and publications lookup
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--niser-green)', background: 'var(--niser-green-pale)', padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-sm)' }}>
                ● Online
              </span>
            </div>
          </div>
        </div>

        {/* Chat Grid Container */}
        <div className="container" style={{ flex: 1, padding: '2rem 0', display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem', minHeight: '500px' }}>
          
          {/* Main Chat Thread area */}
          <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#fff', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
            
            {/* Scrollable messages container */}
            <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem', maxHeight: '550px' }}>
              {messages.map((m) => (
                <div
                  key={m.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: m.role === 'user' ? 'flex-end' : 'flex-start',
                    width: '100%',
                  }}
                >
                  <div
                    style={{
                      maxWidth: '75%',
                      padding: '0.875rem 1.125rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: m.role === 'user' ? 'var(--niser-green)' : 'var(--gray-100)',
                      color: m.role === 'user' ? '#fff' : 'var(--gray-800)',
                      fontSize: '0.9375rem',
                      lineHeight: '1.5',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                  >
                    {m.content}
                  </div>

                  {/* Render RAG Sources if present */}
                  {m.sources && m.sources.length > 0 && (
                    <div style={{ alignSelf: 'flex-start', marginTop: '0.5rem', paddingLeft: '0.25rem', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                      <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--niser-green)', margin: 0, textTransform: 'uppercase' }}>
                        Retrieved Citations:
                      </p>
                      {m.sources.map((s, idx) => (
                        <Link
                          key={idx}
                          href={s.url}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            fontSize: '0.8125rem',
                            color: 'var(--niser-green-dark)',
                            textDecoration: 'underline',
                            fontWeight: 500,
                          }}
                        >
                          📖 {s.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {loading && messages[messages.length - 1]?.content === '' && (
                <div style={{ alignSelf: 'flex-start', display: 'flex', gap: '0.25rem', padding: '0.875rem 1.125rem', backgroundColor: 'var(--gray-100)', borderRadius: 'var(--radius-md)' }}>
                  <span style={{ width: '8px', height: '8px', backgroundColor: 'var(--gray-400)', borderRadius: '50%', animation: 'blink 1s infinite 0.1s' }}></span>
                  <span style={{ width: '8px', height: '8px', backgroundColor: 'var(--gray-400)', borderRadius: '50%', animation: 'blink 1s infinite 0.2s' }}></span>
                  <span style={{ width: '8px', height: '8px', backgroundColor: 'var(--gray-400)', borderRadius: '50%', animation: 'blink 1s infinite 0.3s' }}></span>
                  <style jsx global>{`
                    @keyframes blink {
                      0%, 100% { opacity: 0.3; }
                      50% { opacity: 1; }
                    }
                  `}</style>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              style={{ padding: '1.25rem', borderTop: '1px solid var(--color-border)', backgroundColor: 'var(--gray-50)', display: 'flex', gap: '0.75rem' }}
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask NISER Assistant..."
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '0.75rem 1rem',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  outline: 'none',
                  fontSize: '0.9375rem',
                  fontFamily: 'var(--font-sans)',
                  background: '#fff',
                }}
                aria-label="Chat query input"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="btn btn--primary"
                style={{ padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-md)' }}
              >
                Send
              </button>
            </form>
          </div>

          {/* Sidebar Area: Rules & Suggestions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ backgroundColor: '#fff', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: 'var(--niser-green-dark)' }}>
                System Guidelines
              </h2>
              <p style={{ fontSize: '0.8125rem', color: 'var(--gray-600)', margin: 0, lineHeight: '1.5' }}>
                1. Answers are grounded exclusively in NISER publication context.<br />
                2. Explicit citations to source documents are provided when matches exist.<br />
                3. The bot adheres to objective, non-political research briefs.
              </p>
            </div>

            <div style={{ backgroundColor: '#fff', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: 'var(--niser-green-dark)' }}>
                Suggested Prompts
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {suggestedPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(prompt)}
                    disabled={loading}
                    style={{
                      textAlign: 'left',
                      padding: '0.5rem 0.75rem',
                      fontSize: '0.8125rem',
                      color: 'var(--gray-700)',
                      backgroundColor: 'var(--gray-100)',
                      borderRadius: 'var(--radius-sm)',
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'background var(--transition-base)',
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'var(--niser-green-pale)')}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'var(--gray-100)')}
                  >
                    💡 {prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
