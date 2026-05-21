import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { confirmPasswordReset } from "../../api/auth";
import styles from "../AuthRecovery/AuthRecovery.module.css";

function ResetPassword() {
  const navigate = useNavigate();
  const { uid, token } = useParams();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      const response = await confirmPasswordReset({
        uid,
        token,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      setStatus({
        type: "success",
        message: response.message || "Password updated successfully.",
      });
      setFormData({ password: "", confirmPassword: "" });
      setTimeout(() => navigate("/login"), 2200);
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Could not update password.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className={styles.pageShell}>
      <div className={styles.pageGlow} aria-hidden="true" />
      <div className={styles.pageContainer}>
        <section className={styles.recoveryCard} aria-labelledby="reset-password-title">
          <span className={styles.badge}>Set new password</span>
          <h1 id="reset-password-title" className={styles.title}>
            Create a new password for your account
          </h1>
          <p className={styles.intro}>
            Choose a strong password you have not used before. Once saved, your previous session token will be cleared.
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
              <label htmlFor="password">New password</label>
              <div className={styles.inputWithIcon}>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter a new password"
                  autoComplete="new-password"
                  minLength={8}
                  required
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className={styles.iconBtn}
                  onClick={() => setShowPassword((current) => !current)}
                >
                  {showPassword ? (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden
                    >
                      <path
                        d="M3 3L21 21"
                        stroke="#0f172a"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M10.58 10.58a3 3 0 0 0 4.24 4.24"
                        stroke="#0f172a"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M17.94 17.94C16.08 19.28 13.66 20 12 20c-4 0-7-4-9-8 1.19-2.53 3.05-4.7 5.06-6.12"
                        stroke="#0f172a"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden
                    >
                      <path
                        d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"
                        stroke="#0f172a"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="3"
                        stroke="#0f172a"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword">Confirm new password</label>
              <div className={styles.inputWithIcon}>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter the new password"
                  autoComplete="new-password"
                  minLength={8}
                  required
                />
                <button
                  type="button"
                  aria-label={
                    showConfirmPassword ? "Hide confirm password" : "Show confirm password"
                  }
                  className={styles.iconBtn}
                  onClick={() => setShowConfirmPassword((current) => !current)}
                >
                  {showConfirmPassword ? (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden
                    >
                      <path
                        d="M3 3L21 21"
                        stroke="#0f172a"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M10.58 10.58a3 3 0 0 0 4.24 4.24"
                        stroke="#0f172a"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M17.94 17.94C16.08 19.28 13.66 20 12 20c-4 0-7-4-9-8 1.19-2.53 3.05-4.7 5.06-6.12"
                        stroke="#0f172a"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden
                    >
                      <path
                        d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"
                        stroke="#0f172a"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="3"
                        stroke="#0f172a"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className={styles.formActions}>
              <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                {isSubmitting ? "Updating password..." : "Update password"}
              </button>

              <div className={styles.helperLinks}>
                <Link to="/login" className={styles.backLink}>
                  Back to sign in
                </Link>
                <span className={styles.fieldNote}>
                  This link is tied to a single reset request.
                </span>
              </div>
            </div>
          </form>
        </section>

        <aside className={styles.infoCard} aria-label="Password rules">
          <span className={styles.infoLabel}>Password guidance</span>
          <h2>Use a long password with letters, numbers, and symbols.</h2>
          <div className={styles.infoList}>
            <div className={styles.infoItem}>
              <span className={styles.infoDot} aria-hidden="true" />
              <p>Keep it at least 8 characters long.</p>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoDot} aria-hidden="true" />
              <p>Do not reuse the password from the old account session.</p>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoDot} aria-hidden="true" />
              <p>Sign in again after the update to continue using the portal.</p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

export default ResetPassword;