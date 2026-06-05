import { useState } from "react";
import { Link } from "react-router-dom";
import { requestPasswordReset } from "../../api/auth";
import hshecLogo from "../../assets/hshec_logo.jpeg";
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
      <div className={`${styles.pageContainer} ${styles.centerFormWrapper}`}>
        <section className={styles.recoveryCard} aria-labelledby="forgot-password-title">
          <div className={styles.logoWrapper}>
            <img src={hshecLogo} alt="HSHEC Logo" className={styles.logoImage} />
          </div>
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
      </div>
    </main>
  );
}

export default ForgotPassword;