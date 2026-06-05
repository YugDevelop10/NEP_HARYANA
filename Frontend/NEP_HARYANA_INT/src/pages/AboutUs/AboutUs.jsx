import React from "react";
import hshecLogo from "../../assets/hshec_logo.jpeg";
import styles from "./AboutUs.module.css";

function AboutUs() {
  return (
    <main className={styles.pageShell} id="main-content">
      {/* Hero Header */}
      <section className={styles.heroSection}>
        <div className={styles.container}>
          <div className={styles.accentLine} aria-hidden="true" />
          <h1 className={styles.pageTitle}>About the Council & Portal</h1>
          <p className={styles.pageSubtitle}>
            Driving academic excellence and policy implementation across Haryana.
          </p>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className={styles.contentSection}>
        <div className={styles.container}>
          <div className={styles.aboutGrid}>

            {/* Left Box — Logo & Basic Info */}
            <div className={styles.logoCard}>
              <div className={styles.logoFrame}>
                <img
                  src={hshecLogo}
                  alt="Haryana State Higher Education Council Logo"
                  className={styles.logoImage}
                />
              </div>
              <h2 className={styles.cardTitle}>HSHEC</h2>
              <p className={styles.cardSubtitle}>Government of Haryana</p>
              <div className={styles.divider} />
              <p className={styles.cardDetails}>
                <strong>Established:</strong> 2018 <br />
                <strong>Type:</strong> Statutory Body <br />
                <strong>Jurisdiction:</strong> State of Haryana
              </p>
            </div>

            {/* Right Box — Intros */}
            <div className={styles.textDetails}>

              {/* HSHEC Introduction */}
              <div className={styles.infoBlock}>
                <span className={styles.blockLabel}>THE APEX BODY</span>
                <h3 className={styles.blockHeading}>
                  Haryana State Higher Education Council
                </h3>
                <p className={styles.blockText}>
                  The Haryana State Higher Education Council (HSHEC) is the apex statutory body constituted by the Government of Haryana to ensure planned, coordinated, and quality-driven development of higher education in the State.
                </p>
                <p className={styles.blockText}>
                  The Council serves as a critical bridge between the State Government, academic institutions, and national regulatory bodies. Its primary objectives include implementing progressive educational policies, fostering academic research, updating curricula to meet global standards, and advising the government on strategic funding and development plans.
                </p>
              </div>

              <div className={styles.blockDivider} />

              {/* Portal Introduction */}
              <div className={styles.infoBlock}>
                <span className={styles.blockLabel}>DIGITAL INITIATIVE</span>
                <h3 className={styles.blockHeading}>
                  NEP Excellence Awards Portal
                </h3>
                <p className={styles.blockText}>
                  The NEP Excellence Awards Portal is a centralized digital initiative launched under the mandate of the National Education Policy (NEP) 2020. The platform is designed to evaluate, recognize, and award higher education institutions in Haryana for their outstanding contributions and execution excellence of NEP 2020 guidelines.
                </p>
                <p className={styles.blockText}>
                  By replacing manual, document-heavy submission procedures with this streamlined digital platform, the Council ensures transparency, accuracy, and data-driven evaluation across all colleges and universities in Haryana. The portal empowers institutional administrators to showcase their achievements, track development metrics, and collaborate towards a future-ready educational ecosystem.
                </p>
              </div>

            </div>

          </div>
        </div>
      </section>
    </main>
  );
}

export default AboutUs;
