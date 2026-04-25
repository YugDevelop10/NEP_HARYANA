import styles from './Hero.module.css';
import heroBg from '../../assets/hero-bg.png';

function Hero() {
  return (
    <section className={styles.hero} id="hero-section">
      {/* Background image layer */}
      <div
        className={styles.bgImage}
        style={{ backgroundImage: `url(${heroBg})` }}
        aria-hidden="true"
      />
      {/* Gradient overlay */}
      <div className={styles.overlay} aria-hidden="true" />

      {/* Content */}
      <div className={styles.container}>
        <div className={styles.content}>
          {/* Badge */}
          <span className={styles.badge} id="nep-badge">
            <span className={styles.badgeDot}>●</span>
            NATIONAL EDUCATION POLICY 2020
          </span>

          {/* Headline */}
          <h2 className={styles.headline}>
            Building a Future{' '}
            <span className={styles.headlineBreak}>Ready</span>
            <br />
            Higher Education in
            <br />
            Haryana
          </h2>

          {/* Description */}
          <p className={styles.description}>
            The Haryana State Higher Education Council (HSHEC) is the apex statutory
            body steering policy, accreditation and academic excellence across all
            institutions of higher learning in the State.
          </p>

          {/* CTA Buttons */}
          <div className={styles.ctas}>
            <a href="#schemes" className={styles.ctaPrimary} id="btn-explore-schemes">
              Explore Schemes
              <svg
                className={styles.ctaArrow}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
            <a href="#college-login" className={styles.ctaSecondary} id="btn-college-login">
              College Login
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
