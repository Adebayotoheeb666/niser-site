"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import MobileNav from "./MobileNav";
import CartButton from "@/components/cart/CartButton";
import "./header.css";

// ── Nav structure — nested items become dropdowns ─────────────────────────────
type NavChild = { href: string; label: string };
type NavItem =
  | { href: string; label: string; children?: undefined }
  | { href: string; label: string; children: NavChild[] };

const navLinks: NavItem[] = [
  { href: "/", label: "Home" },
  {
    href: "/about",
    label: "ABOUT",
    children: [
      { href: "/about/history", label: "History" },
      { href: "/about/office-of-director-general", label: "Office of the Director General" },
      { href: "/about/governance-structure", label: "Governance Structure" },
      { href: "/about/federal-ministry-budget", label: "Federal Ministry of Budget and Economic Planning" },
      { href: "/about/governing-council", label: "Governing Council" },
      { href: "/about/management-team", label: "Management Team" },
      { href: "/about/departments", label: "Departments" },
      { href: "/about/staff-directory", label: "Staff Directory" },
      { href: "/about/actu-niser", label: "ACTU in NISER" },
      { href: "/about/servicom", label: "Servicom" },
    ],
  },
  {
    href: "/training",
    label: "TRAINING",
    children: [
      { href: "/training/research-methodology", label: "Research Methodology Training" },
    ],
  },
  {
    href: "/resources",
    label: "RESOURCES",
    children: [
      { href: "/publications", label: "Publications" },
      { href: "/resources/calendar", label: "NISER Calendar of Activities for the Year" },
      { href: "/policy-briefs", label: "Briefs" },
    ],
  },
  {
    href: "/gallery",
    label: "GALLERY",
    children: [
      { href: "/gallery/images", label: "Images" },
      { href: "/gallery/videos", label: "Videos" },
    ],
  },
  {
    href: "/bckc-center",
    label: "BCKC CENTER",
    children: [
      { href: "/bckc-center/about-research-grant", label: "About Research Grant" },
      { href: "/bckc-center/niser-abc-series", label: "NISER ABC Series" },
      { href: "/bckc-center", label: "Behavioural Change Knowledge Center" },
    ],
  },
  {
    href: "/research",
    label: "RESEARCH",
    children: [
      { href: "/research/mastercard-project", label: "Mastercard Project" },
      { href: "/research/seminar-series", label: "NISER Research Seminar Series" },
      { href: "/research/fg-funded-projects", label: "FG Funded Projects" },
      { href: "/research/externally-funded-projects", label: "Externally Funded Projects" },
      { href: "/research/team-projects", label: "Team Research Projects" },
      { href: "/research/individual-projects", label: "Individual Research Projects" },
    ],
  },
];

// Flat list kept for MobileNav (which expects the original flat shape)
const flatNavLinks = [
  { href: "/", label: "Home" },
  { href: "/about/history", label: "History" },
  { href: "/about/office-of-director-general", label: "Office of the Director General" },
  { href: "/about/governance-structure", label: "Governance Structure" },
  { href: "/about/federal-ministry-budget", label: "Federal Ministry of Budget and Economic Planning" },
  { href: "/about/governing-council", label: "Governing Council" },
  { href: "/about/management-team", label: "Management Team" },
  { href: "/about/departments", label: "Departments" },
  { href: "/about/staff-directory", label: "Staff Directory" },
  { href: "/about/actu-niser", label: "ACTU in NISER" },
  { href: "/about/servicom", label: "Servicom" },
  { href: "/training/research-methodology", label: "Research Methodology Training" },
  { href: "/publications", label: "Publications" },
  { href: "/resources/calendar", label: "NISER Calendar of Activities for the Year" },
  { href: "/policy-briefs", label: "Briefs" },
  { href: "/gallery/images", label: "Images" },
  { href: "/gallery/videos", label: "Videos" },
  { href: "/bckc-center/about-research-grant", label: "About Research Grant" },
  { href: "/bckc-center/niser-abc-series", label: "NISER ABC Series" },
  { href: "/bckc-center", label: "Behavioural Change Knowledge Center" },
  { href: "/research/mastercard-project", label: "Mastercard Project" },
  { href: "/research/seminar-series", label: "NISER Research Seminar Series" },
  { href: "/research/fg-funded-projects", label: "FG Funded Projects" },
  { href: "/research/externally-funded-projects", label: "Externally Funded Projects" },
  { href: "/research/team-projects", label: "Team Research Projects" },
  { href: "/research/individual-projects", label: "Individual Research Projects" },
];

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={`niser-header ${scrolled ? "niser-header--scrolled" : ""}`}
        role="banner"
      >
        <div className="niser-header__topbar" aria-label="NISER contact information">
          <a href="mailto:dg@niser.gov.ng">dg@niser.gov.ng</a>
          <span aria-hidden="true">•</span>
          <a href="tel:+2347033545404">+234 703 354 5404</a>
          <span aria-hidden="true">•</span>
          <a href="tel:+23422912230">+234 229 12230</a>
        </div>

        <div className="niser-header__inner">
          {/* Logo */}
          <Link
            href="/"
            className="niser-logo"
            aria-label="NISER — Go to homepage"
          >
            <Image
              src="/niser-logo.png"
              alt="Nigerian Institute of Social and Economic Research"
              width={160}
              height={48}
              priority
              className="niser-logo__img"
            />
          </Link>

          {/* Desktop navigation */}
          <nav className="niser-nav" aria-label="Primary navigation">
            <ul className="niser-nav__list" role="list">
              {navLinks.map((link) => {
                // Is this top-level item active?
                const isActive = link.children
                  ? link.children.some((c) => pathname.startsWith(c.href))
                  : link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);

                if (link.children) {
                  // ── Dropdown item ──────────────────────────────────────────
                  return (
                    <li key={link.href} className="niser-nav__item">
                      {/* Trigger — acts as a link to the section root */}
                      <Link
                        href={link.href}
                        className={`niser-nav__trigger${isActive ? " niser-nav__trigger--active" : ""}`}
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        {link.label}
                        {/* Chevron */}
                        <svg
                          className="niser-nav__chevron"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      </Link>

                      {/* Dropdown panel */}
                      <div className="niser-dropdown" role="menu">
                        {link.children.map((child) => {
                          const childActive = pathname.startsWith(child.href);
                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={`niser-dropdown__item${childActive ? " niser-dropdown__item--active" : ""}`}
                              role="menuitem"
                            >
                              {child.label}
                            </Link>
                          );
                        })}
                      </div>
                    </li>
                  );
                }

                // ── Plain link ─────────────────────────────────────────────
                return (
                  <li key={link.href} className="niser-nav__item">
                    <Link
                      href={link.href}
                      className={`niser-nav__link${isActive ? " niser-nav__link--active" : ""}`}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Search + hamburger */}
          <div className="niser-header__actions">
            <CartButton />
            <form action="/search" className="niser-search-form" role="search">
              <div className="niser-search-wrap">
                <svg
                  className="niser-search-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
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
                  type="search"
                  name="q"
                  placeholder="Search publications..."
                  className="niser-search-input"
                  aria-label="Search publications"
                />
              </div>
              <button type="submit" className="niser-search-btn">
                Search
              </button>
            </form>

            <button
              className="niser-hamburger"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
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
        links={flatNavLinks}
        pathname={pathname}
      />
    </>
  );
}
