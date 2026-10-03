import React from 'react';

interface HeroSectionProps {
  title: string;
  description?: string;
  subtitle?: string;
  backgroundImage?: string;
}

export default function HeroSection({ title, description, subtitle, backgroundImage }: HeroSectionProps) {
  const backgroundStyle = backgroundImage
    ? {
        backgroundImage: `linear-gradient(135deg, rgba(0, 28, 20, 0.78) 0%, rgba(0, 65, 47, 0.64) 45%, rgba(0, 107, 63, 0.34) 100%), radial-gradient(circle at 20% 50%, rgba(15, 166, 155, 0.24) 0%, transparent 48%), radial-gradient(circle at 80% 80%, rgba(255, 184, 28, 0.18) 0%, transparent 52%), url('${backgroundImage}')`,
        backgroundSize: 'cover, cover, cover, cover',
        backgroundPosition: 'center, center, center, center',
        backgroundRepeat: 'no-repeat, no-repeat, no-repeat, no-repeat',
      }
    : undefined;

  return (
    <section className={`hero-section-page ${backgroundImage ? 'hero-section-page--with-bg' : ''}`}>
      <div className="hero-section-page__bg" style={backgroundStyle} />
      <div className="hero-section-page__content">
        <h1 className="hero-section-page__title">{title}</h1>
        {description && <p className="hero-section-page__description">{description}</p>}
        {subtitle && <p className="hero-section-page__subtitle">{subtitle}</p>}
      </div>
    </section>
  );
}
