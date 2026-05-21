import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginCollege, saveAuthSession } from "../../api/auth";
import styles from "./Signin.module.css";

function Signin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      const response = await loginCollege(formData);
      saveAuthSession(response.token, response.user);
      setStatus({
        type: "success",
        message: response.message || "Signed in successfully.",
      });
      navigate("/dashboard");
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Could not sign in.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.signinCard}>
        <div className={styles.signinHeader}>
          <h2>Sign In</h2>
          <p>Access your institutional dashboard</p>
        </div>

        {status.message && (
          <div
            className={`${styles.statusMessage} ${status.type === "success" ? styles.statusSuccess : styles.statusError}`}
          >
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.formGrid}>
          {/* Email ID */}
          <div className={styles.formGroup}>
            <label htmlFor="email">Email ID</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="official@college.edu.in"
            />
          </div>

          {/* Password */}
          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <div className={styles.inputWithIcon}>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                className={styles.iconBtn}
                onClick={() => setShowPassword((s) => !s)}
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
                      stroke="#0d1b2a"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M10.58 10.58a3 3 0 0 0 4.24 4.24"
                      stroke="#0d1b2a"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M17.94 17.94C16.08 19.28 13.66 20 12 20c-4 0-7-4-9-8 1.19-2.53 3.05-4.7 5.06-6.12"
                      stroke="#0d1b2a"
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
                      stroke="#0d1b2a"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="3"
                      stroke="#0d1b2a"
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
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing In..." : "Sign In"}
            </button>
            <p className={styles.signupPrompt}>
              Don't have an account?{" "}
              <Link to="/signup" className={styles.signupLink}>
                Register here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signin;
