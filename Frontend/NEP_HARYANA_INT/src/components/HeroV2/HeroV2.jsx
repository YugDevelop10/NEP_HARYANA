import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Megaphone } from "lucide-react";
import hshecLogo from "../../assets/hshec_logo.jpeg";
import styles from "./HeroV2.module.css";

function HeroV2() {
  const navigate = useNavigate();

  const handleDashboardRedirect = () => {
    navigate("/auth/login");
  };

  const handleGuidelinesRedirect = () => {
    const schemesSection = document.getElementById("schemes");
    if (schemesSection) {
      schemesSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className={styles.heroWrapper} id="hero-v2">
      {/* ===== Notice Bar ===== */}
      <div className={styles.noticeBar}>
        <div className={styles.noticeContainer}>
          <div className={styles.noticeLeft}>
            <div className={styles.iconBadge}>
              <Megaphone className="w-4 h-4 text-white" />
            </div>
            <span className={styles.newBadge}>NEW ANNOUNCEMENT</span>
            <div className={styles.tickerWrapper}>
              <span className={styles.noticeText}>
                Public notice: Submission of Annual Quality Assurance Reports (AQAR) for affiliated colleges — deadline extended to 31 March.
              </span>
            </div>
          </div>
          <a href="#news-events" className={styles.noticeLink}>
            View notice →
          </a>
        </div>
      </div>

      {/* ===== Hero Main Section ===== */}
      <section className={styles.heroSection}>
        <div className={styles.container}>
          <div className={styles.grid}>
            {/* Left Column: Heading and description */}
            <motion.div
              className={styles.contentColumn}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className={styles.pretitle}>
                <span className={styles.statutoryIcon}>🏛️</span> STATUTORY BODY · GOVERNMENT OF HARYANA
              </div>
              <h1 className={styles.title}>
                NEP Excellence Awards Portal
              </h1>
              <p className={styles.description}>
                NEP Excellence Awards Haryana is a centralized digital platform that enables colleges and higher education institutions to submit academic, administrative, and performance data through structured online workflows. An initiative of the Haryana State Higher Education Council (HSHEC), this platform enables colleges and universities to digitally submit institutional data, supporting documents, and evaluation records through a centralized system. It streamlines assessment, verification, and reporting processes while enhancing transparency, accuracy, and governance across Haryana's higher education ecosystem.
              </p>
              <div className={styles.actions}>
                <button
                  onClick={handleDashboardRedirect}
                  className={styles.btnPrimary}
                >
                  Access Dashboard <span className={styles.arrow}>→</span>
                </button>
                <button
                  onClick={handleGuidelinesRedirect}
                  className={styles.btnSecondary}
                >
                  View Guidelines
                </button>
              </div>
            </motion.div>

            {/* Right Column: Logo/Motto card and 2x2 stats */}
            <motion.div
              className={styles.visualColumn}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className={styles.emblemCard}>
                <div className={styles.emblemTop}>
                  <img
                    src={hshecLogo}
                    alt="Haryana State Higher Education Council Emblem"
                    className={styles.emblemLogo}
                  />
                  <h3 className={styles.mottoHindi}>ज्योतिर्गमय तमसो विज्ञानम्</h3>
                  <p className={styles.mottoEnglish}>
                    LEAD US FROM DARKNESS TO THE LIGHT OF KNOWLEDGE
                  </p>
                </div>

                <div className={styles.statsGrid}>
                  <div className={styles.statItem}>
                    <h4 className={styles.statVal}>180+</h4>
                    <p className={styles.statLabel}>Affiliated Institutions</p>
                  </div>
                  <div className={styles.statItem}>
                    <h4 className={styles.statVal}>5.2L+</h4>
                    <p className={styles.statLabel}>Enrolled Students</p>
                  </div>
                  <div className={styles.statItem}>
                    <h4 className={styles.statVal}>47</h4>
                    <p className={styles.statLabel}>Universities Supported</p>
                  </div>
                  <div className={styles.statItem}>
                    <h4 className={styles.statVal}>2015</h4>
                    <p className={styles.statLabel}>Established</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HeroV2;
