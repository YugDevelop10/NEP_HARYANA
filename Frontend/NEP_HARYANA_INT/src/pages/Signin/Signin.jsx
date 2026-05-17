import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginCollege, saveAuthSession } from '../../api/auth';
import styles from './Signin.module.css';

function Signin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await loginCollege(formData);
      saveAuthSession(response.token, response.user);
      setStatus({ type: 'success', message: response.message || 'Signed in successfully.' });
      navigate('/dashboard');
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Could not sign in.' });
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
          <div className={`${styles.statusMessage} ${status.type === 'success' ? styles.statusSuccess : styles.statusError}`}>
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
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>

          <div className={styles.formActions}>
            <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </button>
            <p className={styles.signupPrompt}>
              Don't have an account? <Link to="/signup" className={styles.signupLink}>Register here</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signin;
