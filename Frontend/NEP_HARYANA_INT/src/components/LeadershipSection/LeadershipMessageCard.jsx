import styles from "./LeadershipSection.module.css";

function LeadershipMessageCard({ leader, index }) {
  return (
    <article className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.cardIndex}>
          {String(index + 1).padStart(2, "0")}
        </span>

        <div className={styles.portraitFrame}>
          <img
            src={leader.photo}
            alt={`Official portrait of ${leader.name}`}
            className={styles.portraitImg}
            loading="lazy"
          />
        </div>

        <div className={styles.identityBlock}>
          <p className={styles.cardEyebrow}>{leader.messageTitle}</p>
          <h3 className={styles.leaderName}>{leader.name}</h3>
          <p className={styles.leaderTitle}>{leader.title}</p>
          <p className={styles.leaderDesignation}>{leader.designation}</p>
        </div>
      </div>

      <div className={styles.messageBlock}>
        <span className={styles.quoteMark} aria-hidden="true">
          “
        </span>

        <div className={styles.messageBody}>
          {leader.messageParagraphs.map((paragraph) => (
            <p key={paragraph} className={styles.messageText}>
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      <footer className={styles.cardFooter}>
        <div>
          <span className={styles.closingLabel}>Closing note</span>
          <p className={styles.closingText}>{leader.closing}</p>
        </div>
        <div className={styles.signatureBlock}>
          <span className={styles.signatureLine} />
          <span className={styles.signatureName}>{leader.name}</span>
        </div>
      </footer>
    </article>
  );
}

export default LeadershipMessageCard;
