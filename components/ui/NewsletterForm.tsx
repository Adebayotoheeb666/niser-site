"use client";

import { useState } from 'react';

interface NewsletterFormProps {
  className?: string;
  placeholder?: string;
  id?: string;
}

export default function NewsletterForm({
  className,
  placeholder = 'you@example.com',
  id = 'newsletter-email',
}: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessage(data.error ?? 'Subscription failed. Please try again later.');
        setStatus('error');
        return;
      }
      setStatus('success');
      setEmail('');
    } catch {
      setMessage('Unable to subscribe right now. Please try again later.');
      setStatus('error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
      <form className={className} onSubmit={handleSubmit} aria-label="Email newsletter subscription">
        <label htmlFor={id} className="sr-only">Email address</label>
        <input
          id={id}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          autoComplete="email"
          className="input"
          required
          disabled={status === 'loading'}
        />
        <button type="submit" className="btn btn--primary" disabled={status === 'loading'}>
          {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
        </button>
      </form>
      {status === 'success' && (
        <p className="newsletter-success-msg" role="status" style={{ fontSize: '0.8125rem', color: 'var(--niser-gold, #ffb81c)', fontWeight: 500 }}>
          ✓ Thank you for subscribing! Please check your inbox for a confirmation email.
        </p>
      )}
      {status === 'error' && (
        <p role="alert" style={{ fontSize: '0.8125rem', color: '#c0392b', fontWeight: 500 }}>
          {message || 'Something went wrong. Please try again.'}
        </p>
      )}
    </div>
  );
}
