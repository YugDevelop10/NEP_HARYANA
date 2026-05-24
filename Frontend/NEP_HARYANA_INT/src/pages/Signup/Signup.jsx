import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getDashboardPathForUser,
  fetchColleges,
  registerCollege,
  saveAuthSession,
} from "../../api/auth";
import SignupHero from "./SignupHero";
import styles from "./Signup.module.css";

const initialFormState = {
  fullName: "",
  email: "",
  collegeId: "",
  aisheCode: "",
  role: "principal",
  password: "",
  confirmPassword: "",
};

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormState);
  const [colleges, setColleges] = useState([]);
  const [collegeError, setCollegeError] = useState("");
  const [collegeLoading, setCollegeLoading] = useState(true);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    let active = true;

    const loadColleges = async () => {
      try {
        const items = await fetchColleges();

        if (!active) {
          return;
        }

        setColleges(items);

        if (items.length > 0) {
          setFormData((current) => {
            const selectedId = current.collegeId || String(items[0].id);
            const selectedCollege =
              items.find(
                (college) => String(college.id) === String(selectedId),
              ) || items[0];

            return {
              ...current,
              collegeId: String(selectedCollege.id),
              aisheCode: selectedCollege.aishe_code,
            };
          });
        }
      } catch (error) {
        if (active) {
          setCollegeError(error.message || "Could not load institutions.");
        }
      } finally {
        if (active) {
          setCollegeLoading(false);
        }
      }
    };

    loadColleges();

    return () => {
      active = false;
    };
  }, []);

  const selectedCollege = useMemo(
    () =>
      colleges.find(
        (college) => String(college.id) === String(formData.collegeId),
      ),
    [colleges, formData.collegeId],
  );

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "collegeId") {
      const selected = colleges.find(
        (college) => String(college.id) === String(value),
      );
      setFormData((current) => ({
        ...current,
        collegeId: value,
        aisheCode: selected ? selected.aishe_code : "",
      }));
      return;
    }

    setFormData((current) => ({
      ...current,
      [name]: name === "aisheCode" ? value.toUpperCase() : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: "", message: "" });

    if (formData.password !== formData.confirmPassword) {
      setStatus({ type: "error", message: "Passwords do not match." });
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        collegeId: Number(formData.collegeId),
        role: formData.role,
        password: formData.password,
      };

      const response = await registerCollege(payload);
      saveAuthSession(response.token, response.user);
      setStatus({
        type: "success",
        message: response.message || "Account created successfully.",
      });
      navigate(getDashboardPathForUser(response.user));
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Could not create account.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className={styles.pageShell}>
      <div className={styles.pageGlow} aria-hidden="true" />
      <div className={styles.pageContainer}>
        <SignupHero />

        <section className={styles.formPanel} aria-labelledby="signup-title">
          <div className={styles.formHeader}>
            <span className={styles.formBadge}>Create account</span>
            <h1 id="signup-title" className={styles.formTitle}>
              Register your institution access
            </h1>
            <p className={styles.formIntro}>
              Enter your official details to create a secure account for the
              higher education portal.
            </p>
          </div>

          {collegeError && (
            <div className={`${styles.statusMessage} ${styles.statusError}`}>
              {collegeError}
            </div>
          )}

          {status.message && (
            <div
              className={`${styles.statusMessage} ${status.type === "success" ? styles.statusSuccess : styles.statusError}`}
            >
              {status.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
                autoComplete="name"
              />
            </div>

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
                autoComplete="email"
              />
            </div>

            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label htmlFor="collegeId">Institution Name</label>
              <select
                id="collegeId"
                name="collegeId"
                value={formData.collegeId}
                onChange={handleChange}
                required
                disabled={collegeLoading || colleges.length === 0}
              >
                <option value="" disabled>
                  {collegeLoading
                    ? "Loading institutions..."
                    : "Select an institution"}
                </option>
                {colleges.map((college) => (
                  <option key={college.id} value={college.id}>
                    {college.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="aisheCode">AISHE Code</label>
              <input
                type="text"
                id="aisheCode"
                name="aisheCode"
                value={formData.aisheCode}
                onChange={handleChange}
                required
                placeholder="AISHE code"
                autoComplete="off"
                readOnly
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="role">Role</label>
              <select
                id="role"
                name="role"
                disabled={isSubmitting}
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="principal">College Principal</option>
                <option value="admin">DHE Admin</option>
              </select>
            </div>

            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              {selectedCollege && (
                <p className={styles.selectedInstitution}>
                  Selected institution: {selectedCollege.name}
                </p>
              )}
            </div>

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
                  placeholder="Create a secure password"
                  autoComplete="new-password"
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
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className={styles.inputWithIcon}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                  className={styles.iconBtn}
                  onClick={() => setShowConfirmPassword((s) => !s)}
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

            <div className={`${styles.formActions} ${styles.fullWidth}`}>
              <button
                type="submit"
                className={styles.submitBtn}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating account..." : "Create Account"}
              </button>

              <p className={styles.loginPrompt}>
                Already registered?{" "}
                <Link to="/auth/login" className={styles.loginLink}>
                  Sign in here
                </Link>
              </p>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}

export default Signup;
