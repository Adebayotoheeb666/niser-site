"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useCart } from "@/components/cart/CartProvider";
import "./mobilenav.css";

interface NavChild {
  href: string;
  label: string;
}
interface NavSection {
  label: string;
  href: string;
  children?: NavChild[];
}

const sections: NavSection[] = [
  { label: "Home", href: "/" },
  {
    label: "Research",
    href: "/publications",
    children: [
      { href: "/publications", label: "Publications" },
      { href: "/policy-briefs", label: "Policy Briefs" },
      { href: "/insights", label: "Insights" },
      { href: "/people", label: "People" },
    ],
  },
  { label: "Data", href: "/data" },
  { label: "News", href: "/news" },
  { label: "Shop", href: "/shop" },
  {
    label: "Services",
    href: "/services",
    children: [
      { href: "/services", label: "Our Services" },
      { href: "/training", label: "Training" },
    ],
  },
  {
    label: "About",
    href: "/about",
    children: [
      { href: "/about", label: "About NISER" },
      { href: "/governance", label: "Governance" },
      { href: "/careers", label: "Careers" },
      { href: "/contact", label: "Contact" },
    ],
  },
];

const socialLinks = [
  {
    label: "Facebook",
    href: "http://www.facebook.com/niserofficial1950",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: "Twitter",
    href: "https://www.twitter.com/NISEROfficial",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.713 5.957zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/NISEROfficial",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://youtube.com/channel/UCVYyH7_oX1TR_hRMhFD2S3Q",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
        <polygon
          fill="#f9fafb"
          points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"
        />
      </svg>
    ),
  },
];

interface MobileNavProps {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  links: { href: string; label: string }[];
  pathname: string;
}

export default function MobileNav({
  id,
  isOpen,
  onClose,
  pathname,
}: MobileNavProps) {
  const searchRef = useRef<HTMLInputElement>(null);
  const { count } = useCart();

  useEffect(() => {
    if (isOpen) setTimeout(() => searchRef.current?.focus(), 350);
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div
        className={`mob-backdrop${isOpen ? " mob-backdrop--visible" : ""}`}
        aria-hidden="true"
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === "Enter") onClose();
        }}
      />

      {/* Drawer */}
      <nav
        id={id}
        className={`mob-nav${isOpen ? " mob-nav--open" : ""}`}
        aria-label="Mobile navigation"
        aria-hidden={!isOpen}
      >
        {/* ── Header ──────────────────────────────────────── */}
        <div className="mob-nav__header">
          <div className="mob-nav__brand">
            <Image
              src="/niser-logo.png"
              alt="NISER"
              width={130}
              height={40}
              className="mob-nav__logo-img"
            />
            <span className="mob-nav__brand-label">Menu</span>
          </div>

          <div className="mob-nav__header-actions">
            <Link href="/cart" className="mob-nav__cart-link" tabIndex={isOpen ? 0 : -1}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              <span>Cart</span>
              {count > 0 ? <span className="mob-nav__cart-count">{count}</span> : null}
            </Link>
            <button
              className="mob-close-btn"
              onClick={onClose}
              aria-label="Close navigation menu"
              tabIndex={isOpen ? 0 : -1}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* ── Search ──────────────────────────────────────── */}
        <form action="/search" className="mob-nav__search" role="search">
          <div className="mob-search-wrap">
            <svg
              className="mob-search-icon"
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              ref={searchRef}
              type="search"
              name="q"
              placeholder="Search publications..."
              className="mob-search-input"
              tabIndex={isOpen ? 0 : -1}
              aria-label="Search publications"
            />
          </div>
        </form>

        {/* ── Links ───────────────────────────────────────── */}
        <div className="mob-nav__body">
          {sections.map((section, si) => {
            const isTopActive = section.children
              ? section.children.some((c) => pathname.startsWith(c.href))
              : section.href === "/"
                ? pathname === "/"
                : pathname.startsWith(section.href);

            return (
              <div key={section.href}>
                {si > 0 && <div className="mob-nav__divider" />}

                {section.children ? (
                  <>
                    {/* Section label (not clickable, just a heading) */}
                    <span className="mob-nav__section-label">
                      {section.label}
                    </span>
                    {/* Children */}
                    {section.children.map((child) => {
                      const childActive = pathname.startsWith(child.href);
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={`mob-nav__child${childActive ? " mob-nav__child--active" : ""}`}
                          tabIndex={isOpen ? 0 : -1}
                          aria-current={childActive ? "page" : undefined}
                          onClick={onClose}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <path d="m9 18 6-6-6-6" />
                          </svg>
                          {child.label}
                        </Link>
                      );
                    })}
                  </>
                ) : (
                  <Link
                    href={section.href}
                    className={`mob-nav__link${isTopActive ? " mob-nav__link--active" : ""}`}
                    tabIndex={isOpen ? 0 : -1}
                    aria-current={isTopActive ? "page" : undefined}
                    onClick={onClose}
                  >
                    {section.label}
                  </Link>
                )}
              </div>
            );
          })}
        </div>

        {/* ── Footer (contact + social) ────────────────────── */}
        <div className="mob-nav__footer">
          <div className="mob-nav__contact">
            <a
              href="mailto:info@niser.gov.ng"
              className="mob-nav__contact-item"
              tabIndex={isOpen ? 0 : -1}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              info@niser.gov.ng
            </a>
            <a
              href="mailto:dg@niser.gov.ng"
              className="mob-nav__contact-item"
              tabIndex={isOpen ? 0 : -1}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              dg@niser.gov.ng
            </a>
            <a
              href="tel:+2347033545404"
              className="mob-nav__contact-item"
              tabIndex={isOpen ? 0 : -1}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.69h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 17.22Z" />
              </svg>
              +234 703 354 5404
            </a>
            <a
              href="tel:+23422912230"
              className="mob-nav__contact-item"
              tabIndex={isOpen ? 0 : -1}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.69h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 17.22Z" />
              </svg>
              +234 229 12230
            </a>
          </div>

          <div className="mob-nav__social">
            {socialLinks.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`NISER on ${s.label}`}
                className="mob-nav__social-link"
                tabIndex={isOpen ? 0 : -1}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
}
