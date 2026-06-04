import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Award, GraduationCap, CheckCircle } from 'lucide-react';
import styles from './MobileHeroSection.module.css';

function MobileHeroSection() {
  return (
    <section className={styles.heroSection} id="mobile-hero-section">
      {/* Decorative background glows */}
      <div className={styles.glowLeft} aria-hidden="true" />
      <div className={styles.glowRight} aria-hidden="true" />

      <div className={styles.container}>
        <div className={styles.content}>
          {/* Pulsing Badge */}
          <div className={styles.badge}>
            <span className={styles.badgePulse} />
            <span className={styles.badgeText}>NEP 2020 Excellence Framework</span>
          </div>

          {/* Title */}
          <h1 className={styles.title}>
            Steering <span className={styles.gradientText}>Academic Quality</span> & Governance in Haryana
          </h1>

          {/* Description */}
          <p className={styles.description}>
            The Haryana State Higher Education Council (HSHEC) centralizes evaluation and benchmarking metrics to empower state institutions.
          </p>

          {/* Action CTAs */}
          <div className={styles.actionRow}>
            <a href="#schemes" className={styles.btnPrimary}>
              <span>Explore Schemes</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <Link to="/auth/login" className={styles.btnSecondary}>
              <span>Portal Login</span>
            </Link>
          </div>

          {/* Trust stats summary */}
          <div className={styles.trustStrip}>
            <div className={styles.trustItem}>
              <Shield className="w-4 h-4 text-blue-600" />
              <span>Statutory Authority</span>
            </div>
            <div className={styles.trustItem}>
              <Award className="w-4 h-4 text-amber-500" />
              <span>Digital Evaluation</span>
            </div>
          </div>

          {/* Dashboard Mockup Card for Mobile (Clean and stacked) */}
          <div className={styles.mockupWrapper}>
            <div className={styles.mockupCard}>
              {/* Mockup Header */}
              <div className={styles.mockupHeader}>
                <div className={styles.mockupWindowControls}>
                  <span className={styles.winDotRed} />
                  <span className={styles.winDotYellow} />
                  <span className={styles.winDotGreen} />
                </div>
                <span className={styles.mockupUrl}>hshec.gov.in/portal</span>
              </div>

              {/* Mockup Content Panel */}
              <div className={styles.mockupBody}>
                {/* Dashboard top stats */}
                <div className={styles.mockupTopRow}>
                  <div className={styles.mockupMiniCard}>
                    <span>TOTAL COLLEGES</span>
                    <h3>184</h3>
                  </div>
                  <div className={styles.mockupMiniCard}>
                    <span>EVALUATED</span>
                    <h3 className={styles.textBlue}>142</h3>
                  </div>
                </div>

                {/* Institution List simulation */}
                <div className={styles.mockupList}>
                  <div className={styles.mockupListItem}>
                    <div className={styles.mockupListLeft}>
                      <div className={styles.mockupListIconWrapper}>
                        <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                      </div>
                      <div className={styles.mockupListText}>
                        <h4>Govt College, Panchkula</h4>
                        <span>AISHE: C-12345</span>
                      </div>
                    </div>
                    <span className={`${styles.mockupBadge} ${styles.badgePlatinum}`}>Platinum</span>
                  </div>

                  <div className={styles.mockupListItem}>
                    <div className={styles.mockupListLeft}>
                      <div className={styles.mockupListIconWrapper}>
                        <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                      </div>
                      <div className={styles.mockupListText}>
                        <h4>GCW, Sec 14, Gurugram</h4>
                        <span>AISHE: C-98765</span>
                      </div>
                    </div>
                    <span className={`${styles.mockupBadge} ${styles.badgeGold}`}>Gold</span>
                  </div>
                </div>

                {/* Submission status snippet */}
                <div className={styles.mockupStatusFooter}>
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Real-time score audit active (V2)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MobileHeroSection;
