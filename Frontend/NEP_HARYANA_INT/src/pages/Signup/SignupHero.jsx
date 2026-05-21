import styles from "./Signup.module.css";

const highlights = [
  "Official institution access",
  "Role-based onboarding",
  "Built for Haryana higher education",
];

function SignupHero() {
  return (
    <aside className={styles.heroPanel} aria-label="Signup overview">
      <span className={styles.heroBadge}>Haryana Higher Education Portal</span>
      <h2 className={styles.heroTitle}>
        A formal entry point for institutional leadership
      </h2>
      <p className={styles.heroText}>
        Register once with verified institutional details to access dashboards,
        submissions, and governance workflows designed for principals and
        administrators.
      </p>

      <div className={styles.heroHighlights}>
        {highlights.map((item) => (
          <div key={item} className={styles.heroHighlightItem}>
            <span className={styles.heroHighlightDot} aria-hidden="true" />
            <span>{item}</span>
          </div>
        ))}
      </div>

      <div className={styles.heroNote}>
        Use your official email and institution details to ensure an accurate
        account record.
      </div>
    </aside>
  );
}

export default SignupHero;
