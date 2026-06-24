'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';

interface MobileNavProps {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  links: { href: string; label: string }[];
  pathname: string;
}

export default function MobileNav({ id, isOpen, onClose, links, pathname }: MobileNavProps) {
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  // Focus first link when opened
  useEffect(() => {
    if (isOpen) firstLinkRef.current?.focus();
  }, [isOpen]);

  // Trap Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div
        className={`mob-backdrop ${isOpen ? 'mob-backdrop--visible' : ''}`}
        aria-hidden="true"
        onClick={onClose}
        onKeyDown={(e) => { if (e.key === 'Enter') onClose(); }}
      />

      {/* Drawer */}
      <nav
        id={id}
        className={`mob-nav ${isOpen ? 'mob-nav--open' : ''}`}
        aria-label="Mobile navigation"
        aria-hidden={!isOpen}
      >
        <div className="mob-nav__header">
          <div className="mob-nav__logo">
            <div className="mob-logo-emblem" aria-hidden="true">N</div>
            <span className="mob-logo-name">NISER</span>
          </div>
          <button
            className="mob-close-btn"
            onClick={onClose}
            aria-label="Close navigation menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <ul className="mob-nav__list" role="list">
          {links.map((link, i) => (
            <li key={link.href}>
              <Link
                href={link.href}
                ref={i === 0 ? firstLinkRef : undefined}
                className={`mob-nav__link ${
                  (link.href === '/' ? pathname === '/' : pathname.startsWith(link.href))
                    ? 'mob-nav__link--active'
                    : ''
                }`}
                tabIndex={isOpen ? 0 : -1}
                aria-current={pathname === link.href ? 'page' : undefined}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mob-nav__footer">
          <Link href="/search" className="btn btn--outline" tabIndex={isOpen ? 0 : -1}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              aria-hidden="true">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
            </svg>
            Search Publications
          </Link>
        </div>
      </nav>

      <style jsx>{`
        .mob-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          z-index: 200;
          opacity: 0;
          pointer-events: none;
          transition: opacity 300ms ease;
          backdrop-filter: blur(2px);
        }
        .mob-backdrop--visible {
          opacity: 1;
          pointer-events: auto;
        }
        .mob-nav {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: min(360px, 90vw);
          background: #fff;
          z-index: 201;
          display: flex;
          flex-direction: column;
          transform: translateX(100%);
          transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: -4px 0 24px rgba(0,0,0,0.12);
          overflow-y: auto;
        }
        .mob-nav--open {
          transform: translateX(0);
        }
        .mob-nav__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid var(--color-border);
          background: var(--niser-green);
        }
        .mob-nav__logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .mob-logo-emblem {
          width: 36px;
          height: 36px;
          background: rgba(255,255,255,0.2);
          color: #fff;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-serif);
          font-size: 1.125rem;
          font-weight: 700;
        }
        .mob-logo-name {
          font-family: var(--font-serif);
          font-size: 1.25rem;
          font-weight: 700;
          color: #fff;
          letter-spacing: 0.05em;
        }
        .mob-close-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: var(--radius-md);
          color: rgba(255,255,255,0.85);
          transition: background var(--transition-base);
        }
        .mob-close-btn:hover {
          background: rgba(255,255,255,0.15);
          color: #fff;
        }
        .mob-nav__list {
          list-style: none;
          margin: 0;
          padding: 1rem 0;
          flex: 1;
        }
        .mob-nav__link {
          display: flex;
          align-items: center;
          padding: 0.875rem 1.75rem;
          font-size: 1.0625rem;
          font-weight: 500;
          color: var(--gray-700);
          text-decoration: none;
          transition: color var(--transition-base), background var(--transition-base);
          border-left: 3px solid transparent;
        }
        .mob-nav__link:hover {
          color: var(--niser-green);
          background: var(--niser-green-pale);
          border-left-color: var(--niser-green-light);
        }
        .mob-nav__link--active {
          color: var(--niser-green);
          font-weight: 600;
          border-left-color: var(--niser-green);
          background: var(--niser-green-pale);
        }
        .mob-nav__footer {
          padding: 1.5rem;
          border-top: 1px solid var(--color-border);
        }
        .mob-nav__footer .btn {
          width: 100%;
          justify-content: center;
        }
      `}</style>
    </>
  );
}
