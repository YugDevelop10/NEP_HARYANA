import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerCollege, saveAuthSession } from '../../api/auth';
import styles from './Signup.module.css';

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    collegeName: '',
    address: '',
    city: '',
    pin: '',
    state: '',
    website: '',
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
      const response = await registerCollege(formData);
      saveAuthSession(response.token, response.user);
      setStatus({ type: 'success', message: response.message || 'Registration completed.' });
      navigate('/dashboard');
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Could not register college.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.signupCard}>
        <div className={styles.signupHeader}>
          <h2>College Registration</h2>
          <p>Join the Haryana State Higher Education Council portal</p>
        </div>

        {status.message && (
          <div className={`${styles.statusMessage} ${status.type === 'success' ? styles.statusSuccess : styles.statusError}`}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.formGrid}>
          {/* College Name */}
          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label htmlFor="collegeName">College Name</label>
            <input
              type="text"
              id="collegeName"
              name="collegeName"
              value={formData.collegeName}
              onChange={handleChange}
              required
              placeholder="Enter full college name"
            />
          </div>

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
              placeholder="Create a strong password"
            />
          </div>

          {/* Address */}
          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label htmlFor="address">College Address</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              placeholder="Street address, locality"
            />
          </div>

          {/* City */}
          <div className={styles.formGroup}>
            <label htmlFor="city">City</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              placeholder="e.g., Gurugram"
            />
          </div>

          {/* State */}
          <div className={styles.formGroup}>
            <label htmlFor="state">State</label>
            <input
              type="text"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
              placeholder="e.g., Haryana"
            />
          </div>

          {/* Pin */}
          <div className={styles.formGroup}>
            <label htmlFor="pin">Pin Code</label>
            <input
              type="text"
              id="pin"
              name="pin"
              value={formData.pin}
              onChange={handleChange}
              required
              placeholder="6-digit pin code"
            />
          </div>

          {/* Website (Optional) */}
          <div className={styles.formGroup}>
            <label htmlFor="website">
              Website <span className={styles.optionalTag}>(Optional)</span>
            </label>
            <input
              type="url"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://www.yourcollege.edu.in"
            />
          </div>

          <div className={`${styles.formActions} ${styles.fullWidth}`}>
            <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
              {isSubmitting ? 'Registering...' : 'Register College'}
            </button>
            <p className={styles.loginPrompt}>
              Already registered? <Link to="/signin" className={styles.loginLink}>Sign in here</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
