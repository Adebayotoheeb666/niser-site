import React from 'react';

interface HeroSectionProps {
  title: string;
  description?: string;
  subtitle?: string;
}

export default function HeroSection({ title, description, subtitle }: HeroSectionProps) {
  return (
    <section className="hero-section-page">
      <div className="hero-section-page__bg" />
      <div className="hero-section-page__content">
        <h1 className="hero-section-page__title">{title}</h1>
        {description && <p className="hero-section-page__description">{description}</p>}
        {subtitle && <p className="hero-section-page__subtitle">{subtitle}</p>}
      </div>
    </section>
  );
}
