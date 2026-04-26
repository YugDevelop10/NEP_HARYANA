import { useEffect, useRef, useCallback } from 'react';
import styles from './Schemes.module.css';

// SVG Icons
const IconLotus = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{color: 'var(--schemes-orange)'}} width="100%" height="100%">
    <path d="M12 22c-4-4-6-8-6-12a6 6 0 0 1 12 0c0 4-2 8-6 12z" />
    <path d="M12 10a4 4 0 0 0-4-4" />
    <path d="M12 10a4 4 0 0 1 4-4" />
    <path d="M12 2v2" />
  </svg>
);

const IconGraduation = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{color: 'var(--schemes-navy)'}} width="100%" height="100%">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c3 3 9 3 12 0v-5" />
  </svg>
);

const IconTrophy = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{color: 'var(--schemes-gold)'}} width="100%" height="100%">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 19.24 7 20v2" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 19.24 17 20v2" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
  </svg>
);

// Intersection Observer Hook for animations
function useScrollRevealMany(selector, staggerMs = 100) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const targets = container.querySelectorAll(selector);

    if (prefersReduced) {
      targets.forEach((el) => el.setAttribute('data-visible', ''));
      return;
    }

    let revealIndex = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = revealIndex * staggerMs;
            setTimeout(() => {
              entry.target.setAttribute('data-visible', '');
            }, delay);
            revealIndex++;
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [selector, staggerMs]);

  return containerRef;
}

function Schemes() {
  const containerRef = useScrollRevealMany('[data-reveal]');

  return (
    <section className={styles.section} id="schemes" ref={containerRef}>
      <div className={styles.container}>
        
        {/* Section Header */}
        <div className={styles.header}>
          <span className={styles.badge}>● ACTIVE SCHEMES</span>
          <h2 className={styles.title}>Schemes Driving Excellence in Higher Education</h2>
          <p className={styles.subtitle}>
            Haryana's colleges are evaluated and rewarded under structured government schemes aligned with NEP 2020 goals.
          </p>
        </div>

        {/* Cards Grid */}
        <div className={styles.grid}>
          
          {/* Card 1 — Model Sanskriti Scheme */}
          <div className={`${styles.card} ${styles.cardFeatured}`} data-reveal>
            <div className={styles.cardIcon}>
              <IconLotus />
            </div>
            <div className={styles.cardContent}>
              <span className={styles.cardBadge}>Government of Haryana</span>
              <h3 className={styles.cardTitle}>Model Sanskriti Scheme</h3>
              <p className={styles.cardDesc}>
                An initiative to recognize and promote colleges that demonstrate exceptional adherence to cultural values, academic discipline, and holistic institutional development.
              </p>
              <div className={styles.tags}>
                <span className={styles.tag}>Academic Excellence</span>
                <span className={styles.tag}>Institutional Culture</span>
                <span className={styles.tag}>Student Outcomes</span>
              </div>
              <div className={styles.cardFooter}>
                <a href="#" className={`${styles.ctaBtn} ${styles.ctaBtnOrange}`}>
                  Explore Scheme →
                </a>
                <span className={styles.statusPill}>
                  <span className={styles.statusDot}>🟢</span> Accepting Submissions
                </span>
              </div>
            </div>
          </div>

          {/* Card 2 — NEP 2020 Implementation Excellence Award */}
          <div className={`${styles.card} ${styles.cardRegularNavy}`} data-reveal>
            <div className={styles.cardIcon}>
              <IconGraduation />
            </div>
            <div className={styles.cardContent}>
              <span className={styles.cardBadge}>National Education Policy</span>
              <h3 className={styles.cardTitle}>NEP 2020 Implementation Excellence Award</h3>
              <p className={styles.cardDesc}>
                Colleges are assessed on NEP-related indicators including internships, research cells, innovation hubs, academic reforms, credit systems, and multidisciplinary programs.
              </p>
              <div className={styles.tags}>
                <span className={styles.tag}>Research & Innovation</span>
                <span className={styles.tag}>Internships</span>
                <span className={styles.tag}>Academic Reforms</span>
              </div>
              <div className={styles.cardFooter}>
                <a href="#" className={`${styles.ctaBtn} ${styles.ctaBtnNavy}`}>
                  Explore Scheme →
                </a>
                <span className={styles.statusPill}>
                  <span className={styles.statusDot}>🟢</span> Accepting Submissions
                </span>
              </div>
            </div>
          </div>

          {/* Card 3 — Institutional Performance Ranking */}
          <div className={`${styles.card} ${styles.cardRegularGold}`} data-reveal>
            <div className={styles.cardIcon}>
              <IconTrophy />
            </div>
            <div className={styles.cardContent}>
              <span className={styles.cardBadge}>HSHEC Evaluation</span>
              <h3 className={styles.cardTitle}>Institutional Performance Ranking</h3>
              <p className={styles.cardDesc}>
                Institutions are automatically ranked as Platinum, Gold, or Silver based on their total score across all submitted indicators — enabling transparent benchmarking.
              </p>
              <div className={styles.tags}>
                <span className={styles.tag}>Platinum</span>
                <span className={styles.tag}>Gold</span>
                <span className={styles.tag}>Silver</span>
              </div>
              <div className={styles.cardFooter}>
                <a href="#" className={`${styles.ctaBtn} ${styles.ctaBtnGold}`}>
                  View Criteria →
                </a>
                <span className={styles.statusPill}>
                  <span className={styles.statusDot}>🟡</span> Evaluation in Progress
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Evaluation Tier Visual */}
        <div className={styles.tiersContainer} data-reveal>
          <div className={styles.tier}>
            <span className={styles.tierIcon} title="Platinum">🥇</span>
            <h4 className={styles.tierTitle}>Platinum</h4>
            <p className={styles.tierDesc}>
              Highest Score Band<br/>
              Top institutional benchmark
            </p>
          </div>
          <div className={styles.tier}>
            <span className={styles.tierIcon} title="Gold">🥈</span>
            <h4 className={styles.tierTitle}>Gold</h4>
            <p className={styles.tierDesc}>
              Mid-Level Performance<br/>
              Consistent quality
            </p>
          </div>
          <div className={styles.tier}>
            <span className={styles.tierIcon} title="Silver">🥉</span>
            <h4 className={styles.tierTitle}>Silver</h4>
            <p className={styles.tierDesc}>
              Entry-Level Recognition<br/>
              Active participation
            </p>
          </div>
        </div>

        {/* Bottom CTA Strip */}
        <div className={styles.bottomCta}>
          <h3 className={styles.bottomCtaTitle}>Is your college ready to participate?</h3>
          <div className={styles.bottomCtaButtons}>
            <button className={styles.btnFilled}>Register as a College →</button>
            <button className={styles.btnOutlined}>View All Schemes</button>
          </div>
        </div>

      </div>
    </section>
  );
}

export default Schemes;
