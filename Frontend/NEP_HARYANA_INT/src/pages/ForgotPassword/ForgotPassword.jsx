import { useState } from "react";
import { Link } from "react-router-dom";
import { requestPasswordReset } from "../../api/auth";
import styles from "../AuthRecovery/AuthRecovery.module.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      const response = await requestPasswordReset({ email });
      setStatus({
        type: "success",
        message:
          response.message ||
          "If an account exists for that email address, a reset link has been sent.",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Could not send reset email.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className={styles.pageShell}>
      <div className={styles.pageGlow} aria-hidden="true" />
      <div className={styles.pageContainer}>
        <section className={styles.recoveryCard} aria-labelledby="forgot-password-title">
          <span className={styles.badge}>Password recovery</span>
          <h1 id="forgot-password-title" className={styles.title}>
            Send a secure reset link to your email
          </h1>
          <p className={styles.intro}>
            Enter the official email address linked to your institutional account.
            We will send a one-time reset URL with a secure token.
          </p>

          {status.message && (
            <div
              className={`${styles.statusMessage} ${status.type === "success" ? styles.statusSuccess : styles.statusError}`}
            >
              {status.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email ID</label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="official@college.edu.in"
                autoComplete="email"
                required
              />
              <p className={styles.fieldNote}>
                Use the email address you registered with the portal.
              </p>
            </div>

            <div className={styles.formActions}>
              <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                {isSubmitting ? "Sending link..." : "Send reset link"}
              </button>

              <div className={styles.helperLinks}>
                <Link to="/auth/login" className={styles.backLink}>
                  Back to sign in
                </Link>
                <span className={styles.fieldNote}>
                  The link is time-bound and works once.
                </span>
              </div>
            </div>
          </form>
        </section>

        <aside className={styles.infoCard} aria-label="Password reset guidance">
          <span className={styles.infoLabel}>What happens next</span>
          <h2>We send a direct link to a reset page, not a plain password.</h2>
          <div className={styles.infoList}>
            <div className={styles.infoItem}>
              <span className={styles.infoDot} aria-hidden="true" />
              <p>The email contains a secure frontend URL with a one-time token.</p>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoDot} aria-hidden="true" />
              <p>After verification, you can set a new password from the browser.</p>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoDot} aria-hidden="true" />
              <p>Once the password changes, the old login token is invalidated.
              </p>
            </div>
          </div>
          <div className={styles.infoFoot}>
            <p>
              If you do not receive the email, check spam or verify that the address matches your registered account.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}

export default ForgotPassword;