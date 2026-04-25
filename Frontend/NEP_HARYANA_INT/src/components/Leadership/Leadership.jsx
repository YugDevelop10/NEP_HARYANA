import { useState, useEffect, useRef, useCallback } from 'react';
import styles from './Leadership.module.css';
import governorImg from '../../assets/governor.png';
import cmImg from '../../assets/chief-minister.png';

const leaders = [
  {
    id: 'governor',
    name: 'Shri Bandaru Dattatreya',
    title: 'Governor, State of Haryana',
    designation: 'Patron, Haryana State Higher Education Council',
    photo: governorImg,
    messageTitle: 'Message from the Governor',
    message: `It gives me immense pride to witness the transformative journey of higher education in Haryana under the visionary framework of the National Education Policy 2020. Quality education is the cornerstone of a progressive society, and digital platforms such as ShikshaSetu represent a paradigm shift in how we govern, evaluate, and elevate our academic institutions. By bringing transparency, accountability, and data-driven governance to every college across the state, we are building an ecosystem where excellence is not an aspiration but a standard. I earnestly encourage all institutions of higher learning in Haryana to actively embrace this platform for the collective betterment of our students and the academic ecosystem of our great state.`,
    closing: 'With best wishes,',
  },
  {
    id: 'chief-minister',
    name: 'Shri Nayab Singh Saini',
    title: 'Chief Minister, Government of Haryana',
    designation: 'Chairperson, Haryana State Higher Education Council',
    photo: cmImg,
    messageTitle: 'Message from the Hon\'ble Chief Minister',
    message: `Our government is firmly committed to modernizing higher education infrastructure and empowering every institution across all 22 districts of Haryana with the tools they need to thrive in the 21st century. ShikshaSetu is not merely a portal — it is a flagship digital initiative under NEP 2020 that ensures equitable access to schemes, streamlines accreditation processes, and enables data-driven evaluation at an unprecedented scale. Through this platform, we are bridging the gap between policy and implementation, ensuring that every college — whether in Gurugram or Nuh — has equal opportunity to excel. I personally endorse ShikshaSetu as a transformative step towards building a future-ready Haryana.`,
    closing: 'Jai Hind, Jai Haryana,',
  },
];

const AUTO_SCROLL_INTERVAL = 35000; // 35 seconds
const TRANSITION_DURATION = 900; // 900ms

function Leadership() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);
  const sectionRef = useRef(null);

  const goToSlide = useCallback((index) => {
    if (isTransitioning || index === activeIndex) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveIndex(index);
      setTimeout(() => setIsTransitioning(false), TRANSITION_DURATION);
    }, 50);
  }, [activeIndex, isTransitioning]);

  const goNext = useCallback(() => {
    goToSlide((activeIndex + 1) % leaders.length);
  }, [activeIndex, goToSlide]);

  const goPrev = useCallback(() => {
    goToSlide((activeIndex - 1 + leaders.length) % leaders.length);
  }, [activeIndex, goToSlide]);

  // Auto-scroll timer
  useEffect(() => {
    if (isPaused) return;

    timerRef.current = setInterval(() => {
      goToSlide((activeIndex + 1) % leaders.length);
    }, AUTO_SCROLL_INTERVAL);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeIndex, isPaused, goToSlide]);

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);
  const handleTouchStart = () => setIsPaused(true);
  const handleTouchEnd = () => {
    // Small delay before resuming to let user finish reading
    setTimeout(() => setIsPaused(false), 2000);
  };

  const handleDotClick = (index) => {
    goToSlide(index);
    // Reset timer by toggling pause
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 100);
  };

  return (
    <section
      className={styles.section}
      id="leadership-section"
      ref={sectionRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Section Header */}
      <div className={styles.sectionHeader}>
        <div className={styles.accentLine} aria-hidden="true" />
        <h2 className={styles.sectionTitle}>Messages from Leadership</h2>
        <p className={styles.sectionSubtitle}>
          Guiding Haryana's Higher Education Transformation
        </p>
      </div>

      {/* Carousel Wrapper */}
      <div className={styles.carouselWrapper}>
        {/* Left Chevron */}
        <button
          className={`${styles.chevron} ${styles.chevronLeft}`}
          onClick={goPrev}
          aria-label="Previous message"
          id="leadership-prev"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* Cards Container */}
        <div className={styles.cardsContainer}>
          {leaders.map((leader, index) => (
            <div
              key={leader.id}
              className={`${styles.card} ${index === activeIndex ? styles.cardActive : styles.cardHidden}`}
              id={`leadership-card-${leader.id}`}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${leaders.length}: ${leader.messageTitle}`}
            >
              {/* Left Column — Portrait */}
              <div className={styles.cardLeft}>
                <div className={styles.portraitFrame}>
                  <img
                    src={leader.photo}
                    alt={`Official portrait of ${leader.name}`}
                    className={styles.portraitImg}
                    loading="lazy"
                  />
                </div>
                <div className={styles.identityBlock}>
                  <span className={styles.leaderName}>{leader.name}</span>
                  <span className={styles.leaderTitle}>{leader.title}</span>
                  <span className={styles.leaderDesignation}>{leader.designation}</span>
                </div>
              </div>

              {/* Right Column — Message */}
              <div className={styles.cardRight}>
                <span className={styles.quoteDecor} aria-hidden="true">"</span>
                <h3 className={styles.messageHeading}>{leader.messageTitle}</h3>
                <p className={styles.messageText}>{leader.message}</p>
                <div className={styles.messageClosing}>
                  <span className={styles.closingText}>{leader.closing}</span>
                  <span className={styles.closingName}>{leader.name}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Chevron */}
        <button
          className={`${styles.chevron} ${styles.chevronRight}`}
          onClick={goNext}
          aria-label="Next message"
          id="leadership-next"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* Dot Navigation */}
      <div className={styles.dotsRow} role="tablist" aria-label="Leadership message navigation">
        {leaders.map((leader, index) => (
          <button
            key={leader.id}
            className={`${styles.dot} ${index === activeIndex ? styles.dotActive : ''}`}
            onClick={() => handleDotClick(index)}
            role="tab"
            aria-selected={index === activeIndex}
            aria-label={`Go to ${leader.name}'s message`}
            id={`dot-${leader.id}`}
          />
        ))}
      </div>

      {/* Bottom Divider */}
      <div className={styles.bottomDivider} aria-hidden="true" />
    </section>
  );
}

export default Leadership;
