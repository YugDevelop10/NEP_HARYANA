import { useEffect, useRef, useState, useCallback } from 'react';
import styles from './StatsAndNews.module.css';
import bgImage from '../../assets/graduation_students.png';

/* ============================================
   Intersection Observer Hook for Animations
   ============================================ */
function useScrollRevealMany(selector, staggerMs = 50) {
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

/* ============================================
   Animated Counter Component
   ============================================ */
function AnimatedCounter({ endValue, suffix = '', isFloat = false }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setCount(endValue);
      setHasAnimated(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let startTimestamp = null;
          const duration = 1500; // 1.5 seconds

          const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            // easeOutQuart
            const easeProgress = 1 - Math.pow(1 - progress, 4);
            setCount(easeProgress * endValue);
            if (progress < 1) {
              window.requestAnimationFrame(step);
            } else {
              setCount(endValue);
            }
          };
          window.requestAnimationFrame(step);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [endValue, hasAnimated]);

  // Format the number based on whether it's a float or > 1000
  const formattedCount = isFloat 
    ? count.toFixed(1) 
    : count >= 1000 
      ? Math.floor(count).toLocaleString('en-IN') 
      : Math.floor(count);

  return (
    <span ref={ref}>
      {formattedCount}{suffix}
    </span>
  );
}

/* ============================================
   Data
   ============================================ */
const stats = [
  { value: 184, suffix: '', label: 'AFFILIATED COLLEGES', isFloat: false },
  { value: 12, suffix: '', label: 'STATE UNIVERSITIES', isFloat: false },
  { value: 4.2, suffix: 'L+', label: 'ENROLLED STUDENTS', isFloat: true },
  { value: 8400, suffix: '', label: 'FACULTY MEMBERS', isFloat: false },
];

const notices = [
  { dateNum: '22', dateMon: 'APR', tag: 'AWARD', text: 'Submission window opens for NEP 2020 Implementation Excellence Award 2026' },
  { dateNum: '18', dateMon: 'APR', tag: 'NOTICE', text: 'Revised guidelines for Model Sanskriti College evaluation released' },
  { dateNum: '12', dateMon: 'APR', tag: 'EVENT', text: 'Workshop on Academic Bank of Credits — register before 30 April' },
  { dateNum: '05', dateMon: 'APR', tag: 'REPORT', text: 'Annual report 2024–25 published — view on Publications page' },
  { dateNum: '28', dateMon: 'MAR', tag: 'TENDER', text: 'Tender for digital evaluation platform — last date 15 May' },
];

const events = [
  { dateNum: '05', dateMon: 'MAY', name: 'NEP Stakeholder Consultation', location: 'Panchkula' },
  { dateNum: '18', dateMon: 'MAY', name: 'Workshop: Outcome-Based Education', location: 'Online' },
  { dateNum: '02', dateMon: 'JUN', name: 'Vice-Chancellors\' Conclave 2026', location: 'Gurugram' },
];


/* ============================================
   Main Component
   ============================================ */
function StatsAndNews() {
  const noticesRef = useScrollRevealMany('[data-reveal="notice"]', 50);
  const eventsRef = useScrollRevealMany('[data-reveal="event"]', 100);

  return (
    <>
      {/* SECTION 1 — Stats Banner */}
      <section className={styles.statsBanner} aria-label="Haryana Higher Education Statistics">
        <div 
          className={styles.statsBgImage} 
          style={{ backgroundImage: `url(${bgImage})` }}
          aria-hidden="true"
        />
        <div className={styles.statsOverlay} aria-hidden="true" />
        
        <div className={styles.statsContainer}>
          <span className={styles.statsLabel}>HIGHER EDUCATION AT A GLANCE</span>
          <h2 className={styles.statsHeading}>Haryana by the Numbers</h2>
          
          <div className={styles.statsRow}>
            {stats.map((stat, i) => (
              <div key={i} className={styles.statItem}>
                <div className={styles.statNumber}>
                  <AnimatedCounter 
                    endValue={stat.value} 
                    suffix={stat.suffix} 
                    isFloat={stat.isFloat} 
                  />
                </div>
                <p className={styles.statDesc}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2 — Notices & Upcoming Events */}
      <section className={styles.newsSection} id="news-events">
        <div className={styles.newsContainer}>
          
          {/* Left Column — Notices */}
          <div ref={noticesRef}>
            <span className={styles.sectionLabel}>LATEST UPDATES</span>
            <div className={styles.headerRow}>
              <h2 className={styles.sectionHeading}>Notices & Circulars</h2>
              <a href="#" className={styles.viewAll}>View All →</a>
            </div>
            
            <div className={styles.noticeList}>
              {notices.map((notice, i) => (
                <div key={i} className={styles.noticeRow} data-reveal="notice">
                  <div className={styles.dateBadge}>
                    <span className={styles.dateDay}>{notice.dateNum}</span>
                    <span className={styles.dateMonth}>{notice.dateMon}</span>
                  </div>
                  <div className={styles.noticeContent}>
                    <span className={styles.noticeTag}>{notice.tag}</span>
                    <p className={styles.noticeText}>{notice.text}</p>
                  </div>
                  <div className={styles.noticeChevron} aria-hidden="true">
                    ›
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column — Events */}
          <div ref={eventsRef}>
            <span className={styles.sectionLabel}>CALENDAR</span>
            <div className={styles.headerRow}>
              <h2 className={styles.sectionHeading}>Upcoming Events</h2>
            </div>
            
            <div className={styles.eventsList}>
              {events.map((event, i) => (
                <div key={i} className={styles.eventCard} data-reveal="event">
                  <div className={styles.eventBadge}>
                    <span className={styles.dateDay}>{event.dateNum}</span>
                    <span className={styles.dateMonth}>{event.dateMon}</span>
                  </div>
                  <div className={styles.eventContent}>
                    <h3 className={styles.eventName}>{event.name}</h3>
                    <div className={styles.eventLocation}>
                      <span aria-hidden="true">📍</span> {event.location}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>
    </>
  );
}

export default StatsAndNews;
