import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { getDashboardPathForUser } from '../../api/auth';
import hshecLogo from '../../assets/hshec_logo.jpeg';
import { Search, LogIn, Menu, X, ArrowRight, Sun, Moon, Type, ChevronDown } from 'lucide-react';
import styles from './NavbarV2.module.css';

function NavbarV2() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user: savedUser } = useAuth();
  const [activeNav, setActiveNav] = useState("HOME");
  const [fontSize, setFontSize] = useState(16);
  const [highContrast, setHighContrast] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    "HOME",
    "ABOUT",
    "SCHEMES",
    "COLLEGES",
    "NOTICES",
    "DASHBOARD",
    "CONTACT",
  ];

  const handleFontSize = (action) => {
    let newSize = fontSize;
    if (action === "increase" && fontSize < 22) newSize = fontSize + 1;
    if (action === "decrease" && fontSize > 12) newSize = fontSize - 1;
    if (action === "reset") newSize = 16;
    setFontSize(newSize);
    document.documentElement.style.fontSize = `${newSize}px`;
  };

  const toggleContrast = () => {
    setHighContrast(!highContrast);
    document.body.classList.toggle("high-contrast");
  };

  const handleDashboardClick = (e) => {
    e.preventDefault();
    if (savedUser) {
      navigate(getDashboardPathForUser(savedUser));
    } else {
      navigate("/auth/login");
    }
  };

  const handleSignInClick = () => {
    if (savedUser) {
      navigate(getDashboardPathForUser(savedUser));
      return;
    }
    navigate("/auth/login");
  };

  const handleNavClick = (e, item) => {
    setActiveNav(item);
    setIsMenuOpen(false);

    if (item === "HOME") {
      e.preventDefault();
      navigate("/");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (item === "DASHBOARD") {
      handleDashboardClick(e);
    } else {
      e.preventDefault();
      const targetId = item.toLowerCase();
      let elementId = targetId;
      if (targetId === "about") elementId = "leadership-section";
      if (targetId === "schemes") elementId = "schemes";
      if (targetId === "colleges") elementId = "about-stats";
      if (targetId === "notices") elementId = "news-events";
      if (targetId === "contact") elementId = "contact";

      const element = document.getElementById(elementId);
      if (element) {
        const offset = 100;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      } else {
        navigate(`/#${elementId}`);
        setTimeout(() => {
          const el = document.getElementById(elementId);
          if (el) {
            const offset = 100;
            const elementPosition = el.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;
            window.scrollTo({
              top: offsetPosition,
              behavior: "smooth",
            });
          }
        }, 150);
      }
    }
  };

  return (
    <header className={`${styles.header} ${highContrast ? styles.highContrast : ''}`}>
      {/* TIER 1: Utility Bar */}
      <div className={styles.utilityBar}>
        <div className={styles.utilityContainer}>
          <div className={styles.utilityLeft}>
            <span className={styles.indiaFlag} />
            <span className={styles.govtText}>Government of Haryana</span>
          </div>

          <div className={styles.utilityRight}>
            {/* Font Size controls */}
            <div className={styles.utilityControl}>
              <Type className="w-3.5 h-3.5 text-slate-400" />
              <button onClick={() => handleFontSize("decrease")} className={styles.textBtn}>A-</button>
              <button onClick={() => handleFontSize("reset")} className={styles.textBtn}>A</button>
              <button onClick={() => handleFontSize("increase")} className={styles.textBtn}>A+</button>
            </div>

            <span className={styles.divider}>|</span>

            {/* High Contrast Toggle */}
            <button onClick={toggleContrast} className={styles.contrastToggle}>
              {highContrast ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              <span>{highContrast ? "Standard Contrast" : "High Contrast"}</span>
            </button>

            <span className={styles.divider}>|</span>

            {/* Language Switcher */}
            <div className={styles.langSelector}>
              <button className={`${styles.langBtn} ${styles.activeLang}`}>EN</button>
              <button className={styles.langBtn}>HI</button>
            </div>
          </div>
        </div>
      </div>

      {/* TIER 2: Primary Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.navContainer}>
          {/* Brand/Logo Section */}
          <div className={styles.brand} onClick={() => navigate("/")}>
            <div className={styles.logoWrapper}>
              <img src={hshecLogo} alt="HSHEC Logo" className={styles.logoImg} />
            </div>
            <div className={styles.brandInfo}>
              <h1 className={styles.brandTitle}>HSHEC</h1>
              <span className={styles.brandSubtitle}>State Higher Education Council</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <ul className={styles.navLinks}>
            {navItems.map((item) => {
              const displayLabel = item === "HOME" ? "Home" : item === "ABOUT" ? "About" : item === "SCHEMES" ? "Schemes" : item === "COLLEGES" ? "Colleges" : item === "NOTICES" ? "Notices" : item === "DASHBOARD" ? "Dashboard" : "Contact";
              return (
                <li key={item}>
                  <a
                    href="#"
                    className={`${styles.navLink} ${activeNav === item ? styles.activeLink : ''}`}
                    onClick={(e) => handleNavClick(e, item)}
                  >
                    {displayLabel}
                  </a>
                </li>
              );
            })}
          </ul>

          {/* Action Area (Search & Call to Action Button) */}
          <div className={styles.actions}>
            {/* Search Bar */}
            <div className={styles.searchWrapper}>
              <Search className={styles.searchIcon} />
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Search portal..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Sign In Button */}
            <button className={styles.ctaBtn} onClick={handleSignInClick}>
              <span>{savedUser ? "Dashboard" : "Sign In"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Mobile Hamburger Toggle */}
            <button className={styles.hamburger} onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMenuOpen && (
          <div className={styles.mobileDrawer}>
            <ul className={styles.mobileNavLinks}>
              {navItems.map((item) => {
                const displayLabel = item === "HOME" ? "Home" : item === "ABOUT" ? "About" : item === "SCHEMES" ? "Schemes" : item === "COLLEGES" ? "Colleges" : item === "NOTICES" ? "Notices" : item === "DASHBOARD" ? "Dashboard" : "Contact";
                return (
                  <li key={item} className={styles.mobileNavItem}>
                    <a
                      href="#"
                      className={`${styles.mobileNavLink} ${activeNav === item ? styles.mobileActiveLink : ''}`}
                      onClick={(e) => handleNavClick(e, item)}
                    >
                      {displayLabel}
                    </a>
                  </li>
                );
              })}
            </ul>
            <div className={styles.mobileDrawerActions}>
              <button className={styles.mobileCtaBtn} onClick={handleSignInClick}>
                <span>{savedUser ? "Dashboard" : "Portal Sign In"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

export default NavbarV2;
