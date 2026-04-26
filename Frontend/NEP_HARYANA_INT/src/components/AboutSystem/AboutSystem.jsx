import { useEffect, useRef, useCallback } from 'react';
import styles from './AboutSystem.module.css';

/* ============================================
   SVG Icon Components (outline-style, orange)
   ============================================ */

/** Clipboard / Structured Data icon */
const IconClipboard = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    <line x1="9" y1="12" x2="15" y2="12" />
    <line x1="9" y1="16" x2="13" y2="16" />
  </svg>
);

/** Trophy / Scoring icon */
const IconTrophy = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 010-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 000-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 19.24 7 20v2" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 19.24 17 20v2" />
    <path d="M18 2H6v7a6 6 0 0012 0V2z" />
  </svg>
);

/** Chart / Dashboard icon */
const IconChart = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M3 9h18" />
    <path d="M9 21V9" />
    <path d="M13 15l2-2 2 2" />
  </svg>
);

/** University Building icon */
const IconUniversity = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v12H2V10l10-7 10 7z" />
    <path d="M6 22V14h4v8" />
    <path d="M14 22V14h4v8" />
    <line x1="12" y1="7" x2="12" y2="3" />
  </svg>
);

/** Shield / Government icon */
const IconShield = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

/** Chevron-right mini icon for bullet points */
const IconChevronRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);


/* ============================================
   Data
   ============================================ */

const pillars = [
  {
    id: 'submission',
    icon: <IconClipboard />,
    title: 'Structured Data Submission',
    text: 'Colleges submit institutional, academic, faculty, and NEP indicator data through clean, standardized online forms — no PDFs, no scattered files.',
  },
  {
    id: 'scoring',
    icon: <IconTrophy />,
    title: 'Automated Scoring & Classification',
    text: 'Every submission is automatically scored against government-defined criteria, and institutions are ranked as Platinum, Gold, or Silver.',
  },
  {
    id: 'dashboards',
    icon: <IconChart />,
    title: 'Dashboards & Reporting',
    text: 'Administrators access real-time dashboards, filter by performance, compare institutions, and generate downloadable reports for informed decision-making.',
  },
];

const collegeBullets = [
  'Register & login securely with institutional credentials',
  'Fill structured forms across academic & NEP indicators',
  'Upload supporting documents with guided workflows',
  'Track submission status — Submitted · Under Review · Approved',
];

const adminBullets = [
  'View all college submissions in a unified dashboard',
  'Filter & compare institutions across 22 districts',
  'Auto-generated scores with Platinum · Gold · Silver tiers',
  'Export reports & drive data-backed policy decisions',
];

const stats = [
  { number: '16', label: 'Functional Requirements Covered', accent: false },
  { number: '3', label: 'Evaluation Tiers — Platinum · Gold · Silver', accent: true },
  { number: '10', label: 'NFR Quality Standards Met', accent: false },
  { number: '100%', label: 'Digital — Zero Manual Documents', accent: true },
];


/* ============================================
   Intersection Observer Hook
   ============================================ */

function useScrollReveal(options = {}) {
  const ref = useRef(null);

  const handleIntersect = useCallback((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.setAttribute('data-visible', '');
        observer.unobserve(entry.target);
      }
    });
  }, []);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    /* Respect reduced motion */
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      node.setAttribute('data-visible', '');
      return;
    }

    const observer = new IntersectionObserver(handleIntersect, {
      threshold: options.threshold ?? 0.15,
      rootMargin: options.rootMargin ?? '0px 0px -40px 0px',
    });

    observer.observe(node);

    return () => observer.disconnect();
  }, [handleIntersect, options.threshold, options.rootMargin]);

  return ref;
}

/**
 * useScrollRevealMany — observe multiple children inside a container.
 * Each child matching `selector` gets `.visible` when it intersects.
 */
function useScrollRevealMany(selector, staggerMs = 120) {
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
      { threshold: 0.12, rootMargin: '0px 0px -30px 0px' }
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [selector, staggerMs]);

  return containerRef;
}


/* ============================================
   Component
   ============================================ */

function AboutSystem() {
  const pillarsRef = useScrollRevealMany('[data-reveal="pillar"]', 150);
  const rolesRef = useScrollReveal({ threshold: 0.1 });
  const statsRef = useScrollRevealMany('[data-reveal="stat"]', 100);

  return (
    <>
      {/* ——————————————— PART 1 — Mission Statement ——————————————— */}
      <section
        className={styles.missionSection}
        id="about-mission"
        aria-labelledby="mission-heading"
      >
        <div className={styles.container}>
          <div className={styles.missionInner}>
            <div className={styles.missionAccent} aria-hidden="true" />
            <h2 className={styles.missionHeading} id="mission-heading">
              Transforming Academic Evaluation{' '}
              <span className={styles.missionHeadingHighlight}>
                for Haryana's Colleges
              </span>
            </h2>
            <p className={styles.missionBody}>
              The Haryana State Higher Education Council, under the mandate of
              NEP&nbsp;2020, is replacing manual, document-heavy evaluation
              processes with a centralized digital platform. ShikshaSetu brings
              efficiency, accuracy, and transparency to institutional assessment
              — empowering colleges with streamlined submissions and providing
              government administrators with real-time, data-driven oversight
              across all 22 districts of the state.
            </p>
          </div>
        </div>
      </section>

      {/* ——————————————— PART 2 — Three Pillar Cards ——————————————— */}
      <section
        className={styles.pillarsSection}
        id="about-pillars"
        aria-labelledby="pillars-heading"
      >
        <div className={styles.container}>
          {/* Reuse section header style */}
          <div className={styles.rolesSectionHeader}>
            <div className={styles.rolesSectionAccent} aria-hidden="true" />
            <h2 className={styles.rolesSectionTitle} id="pillars-heading">
              Core Pillars of the System
            </h2>
            <p className={styles.rolesSectionSubtitle}>
              Built for precision, transparency, and governance at scale
            </p>
          </div>

          <div className={styles.pillarsGrid} ref={pillarsRef}>
            {pillars.map((pillar) => (
              <div
                key={pillar.id}
                className={styles.pillarCard}
                data-reveal="pillar"
                id={`pillar-${pillar.id}`}
              >
                <div className={styles.pillarIcon} aria-hidden="true">
                  {pillar.icon}
                </div>
                <h3 className={styles.pillarTitle}>{pillar.title}</h3>
                <p className={styles.pillarText}>{pillar.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ——————————————— PART 3 — Role-Based Access Strip ——————————————— */}
      <section
        className={styles.rolesSection}
        id="about-roles"
        aria-labelledby="roles-heading"
      >
        <div className={styles.container}>
          <div className={styles.rolesSectionHeader}>
            <div className={styles.rolesSectionAccent} aria-hidden="true" />
            <h2 className={styles.rolesSectionTitle} id="roles-heading">
              Who Is This Platform For?
            </h2>
            <p className={styles.rolesSectionSubtitle}>
              Tailored portals for every stakeholder in Haryana's higher
              education ecosystem
            </p>
          </div>

          <div
            className={styles.rolesGrid}
            ref={rolesRef}
            id="roles-grid"
          >
            {/* ---- College Portal ---- */}
            <div
              className={`${styles.rolePanel} ${styles.rolePanelCollege}`}
              id="role-college"
            >
              <div className={styles.rolePanelHeader}>
                <div className={styles.roleIconWrap} aria-hidden="true">
                  <IconUniversity />
                </div>
                <div>
                  <h3 className={styles.rolePanelTitle}>For Colleges</h3>
                  <p className={styles.rolePanelSubtitle}>
                    Institutional Portal
                  </p>
                </div>
              </div>
              <ul className={styles.roleBullets}>
                {collegeBullets.map((bullet, i) => (
                  <li key={i} className={styles.roleBulletItem}>
                    <span className={styles.bulletIcon} aria-hidden="true">
                      <IconChevronRight />
                    </span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* ---- Admin Portal ---- */}
            <div
              className={`${styles.rolePanel} ${styles.rolePanelAdmin}`}
              id="role-admin"
            >
              <div className={styles.rolePanelHeader}>
                <div className={styles.roleIconWrap} aria-hidden="true">
                  <IconShield />
                </div>
                <div>
                  <h3 className={styles.rolePanelTitle}>For Administrators</h3>
                  <p className={styles.rolePanelSubtitle}>
                    Government Dashboard
                  </p>
                </div>
              </div>
              <ul className={styles.roleBullets}>
                {adminBullets.map((bullet, i) => (
                  <li key={i} className={styles.roleBulletItem}>
                    <span className={styles.bulletIcon} aria-hidden="true">
                      <IconChevronRight />
                    </span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ——————————————— PART 4 — Stats Bar ——————————————— */}
      <section
        className={styles.statsSection}
        id="about-stats"
        aria-label="Platform statistics"
      >
        <div className={styles.statsGrid} ref={statsRef}>
          {stats.map((stat, i) => (
            <div
              key={i}
              className={styles.statItem}
              data-reveal="stat"
              id={`stat-${i}`}
            >
              <p
                className={`${styles.statNumber} ${
                  stat.accent ? styles.statNumberAccent : ''
                }`}
              >
                {stat.number}
              </p>
              <p className={styles.statLabel}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default AboutSystem;
