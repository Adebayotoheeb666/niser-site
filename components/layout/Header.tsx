'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import MobileNav from './MobileNav';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/publications', label: 'Research' },
  { href: '/people', label: 'People' },
  { href: '/insights', label: 'Insights' },
  { href: '/services', label: 'Services' },
  { href: '/training', label: 'Training' },
  { href: '/data', label: 'Data' },
  { href: '/news', label: 'News' },
  { href: '/policy-briefs', label: 'Policy Briefs' },
  { href: '/about', label: 'About' },
  { href: '/careers', label: 'Careers' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Close mobile nav on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={`niser-header ${scrolled ? 'niser-header--scrolled' : ''}`}
        role="banner"
      >
        {/* Green top accent bar */}
        <div className="niser-header__accent" aria-hidden="true" />

        <div className="container niser-header__inner">
          {/* Logo */}
          <Link href="/" className="niser-logo" aria-label="NISER — Go to homepage">
            <svg className="niser-logo__mark" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <defs>
                <linearGradient id="nigerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{stopColor:'#006B3F', stopOpacity:'1'}} />
                  <stop offset="100%" style={{stopColor:'#004d2d', stopOpacity:'1'}} />
                </linearGradient>
              </defs>
              <circle cx="50" cy="50" r="45" fill="none" stroke="url(#nigerGrad)" strokeWidth="8" opacity="0.8"/>
              <circle cx="50" cy="50" r="30" fill="none" stroke="#FFB81C" strokeWidth="5" opacity="0.9"/>
              <circle cx="50" cy="30" r="3.5" fill="#FFB81C"/>
              <circle cx="65" cy="50" r="3.5" fill="#FFB81C"/>
              <circle cx="50" cy="70" r="3.5" fill="#FFB81C"/>
              <circle cx="35" cy="50" r="3.5" fill="#FFB81C"/>
              <circle cx="50" cy="50" r="2" fill="#006B3F"/>
            </svg>
          </Link>

          {/* Desktop navigation */}
          <nav className="niser-nav" aria-label="Primary navigation">
            <ul className="niser-nav__list" role="list">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`niser-nav__link ${
                      (link.href === '/' ? pathname === '/' : pathname.startsWith(link.href))
                        ? 'niser-nav__link--active'
                        : ''
                    }`}
                    aria-current={pathname === link.href ? 'page' : undefined}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right actions */}
          <div className="niser-header__actions">
            <Link href="/search" className="btn btn--ghost btn--sm niser-search-btn" aria-label="Search">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                aria-hidden="true">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <span className="sr-only">Search</span>
            </Link>

            {/* Mobile hamburger */}
            <button
              className="niser-hamburger"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                aria-hidden="true">
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <MobileNav
        id="mobile-nav"
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        links={navLinks}
        pathname={pathname}
      />

      <style jsx>{`
        .niser-header {
          position: sticky;
          top: 0;
          z-index: 100;
          background: #fff;
          border-bottom: 1px solid transparent;
          transition: border-color 200ms ease, box-shadow 200ms ease;
        }
        .niser-header--scrolled {
          border-color: var(--color-border);
          box-shadow: var(--shadow-sm);
        }
        .niser-header__accent {
          height: 4px;
          background: linear-gradient(90deg, var(--niser-green) 0%, var(--niser-gold) 100%);
        }
        .niser-header__inner {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          height: 68px;
        }
        /* Logo */
        .niser-logo {
          display: flex;
          align-items: center;
          gap: 0;
          text-decoration: none;
          flex-shrink: 0;
          transition: transform var(--transition-base);
        }
        .niser-logo:hover {
          transform: scale(1.05);
        }
        .niser-logo__mark {
          width: 48px;
          height: 48px;
          flex-shrink: 0;
          filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.08));
          transition: filter var(--transition-base);
        }
        .niser-logo:hover .niser-logo__mark {
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.12));
        }
        /* Desktop nav */
        .niser-nav {
          flex: 1;
          display: none;
        }
        @media (min-width: 1024px) {
          .niser-nav { display: block; }
        }
        .niser-nav__list {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .niser-nav__link {
          display: inline-block;
          padding: 0.5rem 0.875rem;
          border-radius: var(--radius-md);
          font-size: 0.9375rem;
          font-weight: 500;
          color: var(--gray-700);
          transition: color var(--transition-base), background var(--transition-base);
          text-decoration: none;
          position: relative;
        }
        .niser-nav__link:hover {
          color: var(--niser-green);
          background: var(--niser-green-pale);
        }
        .niser-nav__link--active {
          color: var(--niser-green);
          font-weight: 600;
        }
        .niser-nav__link--active::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0.875rem;
          right: 0.875rem;
          height: 2px;
          background: var(--niser-green);
          border-radius: 1px;
        }
        /* Right actions */
        .niser-header__actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-left: auto;
        }
        .niser-search-btn {
          color: var(--gray-600);
        }
        .niser-hamburger {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: var(--radius-md);
          color: var(--gray-700);
          transition: background var(--transition-base), color var(--transition-base);
        }
        .niser-hamburger:hover {
          background: var(--gray-100);
        }
        @media (min-width: 1024px) {
          .niser-hamburger { display: none; }
        }
        /* Utilities */
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
        }
      `}</style>
    </>
  );
}
