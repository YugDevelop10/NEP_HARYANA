import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Award, BookOpen, FileText, CheckCircle2, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./Schemes.module.css";

const schemesData = [
  {
    id: "sanskriti",
    badge: "Government of Haryana",
    title: "NEP Scheme of Haryana",
    shortDesc: "Promotes exceptional adherence to cultural values, academic discipline, and holistic institutional development.",
    longDesc: "The NEP Scheme of Haryana is a flagship framework designed by the Department of Higher Education, Haryana. It recognizes colleges that actively foster an environment combining rigorous academic instruction with cultural heritage, community engagement, and character-building outcomes.",
    status: "Accepting Submissions",
    statusType: "active",
    indicators: [
      "Academic Discipline & Regularity",
      "Promotion of Regional Heritage & Arts",
      "Community Outreach & Extension Services",
      "Holistic Character-Building Outcomes"
    ],
    ctaText: "Apply Online",
    pdfLink: "#"
  },
  {
    id: "nep",
    badge: "National Education Policy",
    title: "NEP 2020 Implementation Excellence Award",
    shortDesc: "Evaluates credit systems, innovation hubs, internships, and multidisciplinary reforms.",
    longDesc: "This scheme measures progress against the key directives of NEP 2020. Institutions are evaluated on their operationalization of the Academic Bank of Credits (ABC), local industry internships, multi-disciplinary course options, and local research innovation hubs.",
    status: "Accepting Submissions",
    statusType: "active",
    indicators: [
      "Academic Bank of Credits (ABC) Adoption",
      "Research & Innovation Hub Setup",
      "Student Internship & Apprenticeship Schemes",
      "Multidisciplinary Curriculum Pathways"
    ],
    ctaText: "Apply Online",
    pdfLink: "#"
  },
  {
    id: "ranking",
    badge: "HSHEC Evaluation",
    title: "Institutional Performance Ranking",
    shortDesc: "Classifies colleges into Platinum, Gold, and Silver tiers based on aggregate scoring.",
    longDesc: "Under the Institutional Performance Ranking, all colleges in Haryana are evaluated across a unified grid of academic, infrastructure, and administrative metrics. The final score automatically assigns the institution to an excellence band.",
    status: "Evaluation in Progress",
    statusType: "pending",
    indicators: [
      "AISHE Verified Infrastructure Metrics",
      "Faculty Strength & Qualification Ratios",
      "Student Placement & Progress Rates",
      "Administrative Transparency & Audits"
    ],
    ctaText: "View Criteria",
    pdfLink: "#"
  }
];

function Schemes() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(schemesData[0].id);

  const activeScheme = schemesData.find((s) => s.id === activeTab);

  return (
    <section className={styles.section} id="schemes">
      <div className={styles.container}>
        {/* ===== Section Header ===== */}
        <div className={styles.sectionHeader}>
          <span className={styles.sectionBadge}>
            <span className={styles.badgeDot}></span> EVALUATION SCHEMES
          </span>
          <h2 className={styles.sectionTitle}>
            Evaluation Frameworks Driving Quality & Innovation
          </h2>
          <p className={styles.sectionSubtitle}>
            Our structured schemes enable transparent benchmarking, resource allocation, and excellence recognition for higher education institutions in Haryana.
          </p>
        </div>

        {/* ===== Main Interactive Panel ===== */}
        <div className={styles.interactivePanel}>
          {/* Left Side: Scheme Selector List */}
          <div className={styles.schemeSelector}>
            {schemesData.map((scheme) => {
              const isSelected = scheme.id === activeTab;
              return (
                <button
                  key={scheme.id}
                  onClick={() => setActiveTab(scheme.id)}
                  className={`${styles.selectorButton} ${isSelected ? styles.selectorButtonActive : ""
                    }`}
                >
                  <div className={styles.selectorMeta}>
                    <span className={styles.selectorBadge}>{scheme.badge}</span>
                    <span
                      className={`${styles.statusLabel} ${scheme.statusType === "active"
                        ? styles.statusActive
                        : styles.statusPending
                        }`}
                    >
                      {scheme.status}
                    </span>
                  </div>
                  <h3 className={styles.selectorTitle}>{scheme.title}</h3>
                  <p className={styles.selectorDesc}>{scheme.shortDesc}</p>
                  <ChevronRight className={styles.selectorCaret} />
                </button>
              );
            })}
          </div>

          {/* Right Side: Featured Scheme Details */}
          <div className={styles.detailsPanel}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeScheme.id}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.3 }}
                className={styles.detailsContent}
              >
                <div className={styles.detailsHeader}>
                  <span className={styles.detailBadge}>{activeScheme.badge}</span>
                  <h3 className={styles.detailTitle}>{activeScheme.title}</h3>
                </div>

                <p className={styles.detailDesc}>{activeScheme.longDesc}</p>

                <div className={styles.indicatorsSection}>
                  <h4 className={styles.indicatorsHeading}>
                    Core Evaluation Indicators
                  </h4>
                  <div className={styles.indicatorsGrid}>
                    {activeScheme.indicators.map((ind, i) => (
                      <div key={i} className={styles.indicatorItem}>
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                        <span>{ind}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.detailsActions}>
                  <button className={styles.btnApply}>
                    {activeScheme.ctaText} →
                  </button>
                  <button className={styles.btnDownload}>
                    <FileText className="w-4 h-4" /> Download Guidelines (PDF)
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ===== Bottom Section: Excellence Tiers Visual ===== */}
        <div className={styles.tiersWrapper}>
          <div className={styles.tiersHeader}>
            <h3 className={styles.tiersHeading}>Accreditation Excellence Tiers</h3>
            <p className={styles.tiersSubtitle}>
              Colleges are classified into three levels based on verified scorecard audits
            </p>
          </div>

          <div className={styles.tiersGrid}>
            <div className={`${styles.tierCard} ${styles.tierPlatinum}`}>
              <div className={styles.tierIconBox}>
                <Award className="w-6 h-6" />
              </div>
              <h4 className={styles.tierName}>Platinum Tier</h4>
              <p className={styles.tierLimit}>Score Band: 85% and above</p>
              <p className={styles.tierDescription}>
                Exceptional quality governance, exemplary infrastructure, and optimal NEP indicator execution.
              </p>
            </div>

            <div className={`${styles.tierCard} ${styles.tierGold}`}>
              <div className={styles.tierIconBox}>
                <Award className="w-6 h-6" />
              </div>
              <h4 className={styles.tierName}>Gold Tier</h4>
              <p className={styles.tierLimit}>Score Band: 65% – 84%</p>
              <p className={styles.tierDescription}>
                Satisfactory compliance with academic guidelines and active implementation of digital processes.
              </p>
            </div>

            <div className={`${styles.tierCard} ${styles.tierSilver}`}>
              <div className={styles.tierIconBox}>
                <Award className="w-6 h-6" />
              </div>
              <h4 className={styles.tierName}>Silver Tier</h4>
              <p className={styles.tierLimit}>Score Band: 50% – 64%</p>
              <p className={styles.tierDescription}>
                Adherence to basic regulatory standards with roadmap setup for quality benchmarking.
              </p>
            </div>
          </div>
        </div>

        {/* ===== Bottom Call To Action ===== */}
        <div className={styles.ctaStrip}>
          <h3 className={styles.ctaTitle}>Ready to begin your institution's audit?</h3>
          <p className={styles.ctaText}>
            Ensure all records are compiled and self-assessment forms are completed before portal submissions.
          </p>
          <div className={styles.ctaButtons}>
            <button className={styles.ctaBtnFilled} onClick={() => navigate("/auth/login")}>Portal Login</button>
            <button className={styles.ctaBtnOutlined}>Help Desk Support</button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Schemes;
