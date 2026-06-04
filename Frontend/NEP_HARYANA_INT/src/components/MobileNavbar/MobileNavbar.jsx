import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import hshecLogo from "../../assets/hshec_logo.jpeg";
import { getDashboardPathForUser } from "../../api/auth";
import { useAuth } from "../../context/AuthContext.jsx";
import { Search, LogIn, Menu, X, ArrowRight, Sun, Moon, Type, Shield, Award, MapPin } from "lucide-react";
import styles from "./MobileNavbar.module.css";

function MobileNavbar() {
  const navigate = useNavigate();
  const { user: savedUser } = useAuth();
  const [activeNav, setActiveNav] = useState("HOME");
  const [fontSize, setFontSize] = useState(16);
  const [highContrast, setHighContrast] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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
    setIsDrawerOpen(false);
    if (savedUser) {
      navigate(getDashboardPathForUser(savedUser));
    } else {
      navigate("/auth/login");
    }
  };

  const handleSignInClick = () => {
    setIsDrawerOpen(false);
    if (savedUser) {
      navigate(getDashboardPathForUser(savedUser));
      return;
    }
    navigate("/auth/login");
  };

  const handleNavClick = (e, item) => {
    setActiveNav(item);
    setIsDrawerOpen(false);

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
        const offset = 80;
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
            const offset = 80;
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
    <>
      <header
        className={`${styles.mobileNavbar} ${highContrast ? styles.highContrast : ""}`}
        id="govt-mobile-navbar"
      >
        <div className={styles.headerContainer}>
          {/* Brand Logo group */}
          <div className={styles.brandGroup} onClick={() => navigate("/")}>
            <div className={styles.logoWrapper}>
              <img
                src={hshecLogo}
                alt="HSHEC Logo"
                className={styles.logoImg}
              />
            </div>
            <div className={styles.brandInfo}>
              <h1 className={styles.brandTitle}>HSHEC</h1>
              <span className={styles.brandSubtitle}>State Higher Education Council</span>
            </div>
          </div>

          {/* Quick Actions & Hamburger */}
          <div className={styles.actionsGroup}>
            <button
              className={styles.quickSignInBtn}
              onClick={handleSignInClick}
              aria-label={savedUser ? "Dashboard" : "Sign In"}
            >
              <span>{savedUser ? "Dashboard" : "Sign In"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            
            <button
              className={`${styles.hamburger} ${isDrawerOpen ? styles.hamburgerOpen : ""}`}
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
              aria-label="Menu"
            >
              {isDrawerOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Drawer Overlay */}
      {isDrawerOpen && (
        <div
          className={styles.drawerOverlay}
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      {/* Slide-out Drawer */}
      <div
        className={`${styles.drawer} ${isDrawerOpen ? styles.drawerOpen : ""} ${
          highContrast ? styles.highContrast : ""
        }`}
      >
        <div className={styles.drawerHeader}>
          <div className={styles.drawerStateIndicator}>
            <span className={styles.flagStub} />
            <span>Government of Haryana</span>
          </div>
          <button
            className={styles.closeBtn}
            onClick={() => setIsDrawerOpen(false)}
            aria-label="Close"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className={styles.drawerContent}>
          {/* Search bar inside drawer */}
          <div className={styles.searchWrapper}>
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search portal..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search"
            />
          </div>

          {/* Navigation Links */}
          <nav className={styles.navContainer}>
            <ul className={styles.navList}>
              {navItems.map((item) => {
                const displayLabel = item === "HOME" ? "Home" : item === "ABOUT" ? "About" : item === "SCHEMES" ? "Schemes" : item === "COLLEGES" ? "Colleges" : item === "NOTICES" ? "Notices" : item === "DASHBOARD" ? "Dashboard" : "Contact";
                return (
                  <li key={item} className={styles.navItem}>
                    <a
                      href="#"
                      className={`${styles.navLink} ${activeNav === item ? styles.navActive : ""}`}
                      onClick={(e) => handleNavClick(e, item)}
                    >
                      {displayLabel}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Accessibility Settings */}
          <div className={styles.accessibilityGroup}>
            <div className={styles.fontSizeSelector}>
              <div className={styles.controlHeader}>
                <Type className="w-4 h-4 text-slate-400" />
                <span className={styles.controlLabel}>Text Size</span>
              </div>
              <div className={styles.btnGroup}>
                <button onClick={() => handleFontSize("decrease")}>A-</button>
                <button onClick={() => handleFontSize("reset")}>A</button>
                <button onClick={() => handleFontSize("increase")}>A+</button>
              </div>
            </div>

            <div className={styles.contrastSelector}>
              <div className={styles.controlHeader}>
                {highContrast ? <Sun className="w-4 h-4 text-slate-400" /> : <Moon className="w-4 h-4 text-slate-400" />}
                <span className={styles.controlLabel}>Contrast Mode</span>
              </div>
              <button
                className={`${styles.contrastBtn} ${highContrast ? styles.active : ""}`}
                onClick={toggleContrast}
              >
                {highContrast ? "Standard" : "High Contrast"}
              </button>
            </div>
          </div>
        </div>

        {/* Footer actions in drawer */}
        <div className={styles.drawerFooter}>
          <button
            className={styles.primaryActionBtn}
            onClick={handleSignInClick}
          >
            <span>{savedUser ? "Go to Dashboard" : "Sign In to Portal"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );
}

export default MobileNavbar;
