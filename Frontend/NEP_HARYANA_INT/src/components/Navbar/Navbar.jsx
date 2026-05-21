import { useState } from "react";
import { useNavigate } from "react-router-dom";
import hshecLogo from "../../assets/hshec_logo.jpeg";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
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

  const handleNavClick = (e, item) => {
    setActiveNav(item);
    setIsMenuOpen(false); // Close mobile drawer
    
    if (item === "HOME") {
      e.preventDefault();
      navigate("/");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (item === "DASHBOARD") {
      e.preventDefault();
      navigate("/dashboard");
    } else {
      e.preventDefault();
      const targetId = item.toLowerCase();
      let elementId = targetId;
      if (targetId === "about") elementId = "leadership-section";
      if (targetId === "schemes") elementId = "schemes";
      if (targetId === "colleges") elementId = "about-stats"; 
      if (targetId === "notices") elementId = "news-events";
      if (targetId === "contact") elementId = "contact"; // target footer contact
      
      const element = document.getElementById(elementId);
      if (element) {
        const offset = 140; // Navbar height offset
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      } else {
        navigate(`/#${elementId}`);
        setTimeout(() => {
          const el = document.getElementById(elementId);
          if (el) {
            const offset = 140;
            const elementPosition = el.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;
            window.scrollTo({
              top: offsetPosition,
              behavior: "smooth"
            });
          }
        }, 150);
      }
    }
  };

  return (
    <header
      className={`govt-navbar ${highContrast ? "high-contrast" : ""}`}
      id="govt-navbar"
    >
      {/* ===== TIER 1: Utility Bar ===== */}
      <div className="utility-bar" id="utility-bar">
        <div className="utility-container">
          {/* Left side: Contact info + state link */}
          <div className="utility-left">
            <span className="utility-item state-indicator">
              <span className="india-flag-stub"></span>
              <span>Government of Haryana</span>
            </span>
            <span className="utility-divider">|</span>
            <a
              href="tel:+911234567890"
              className="utility-item"
              id="utility-phone"
            >
              <svg
                className="utility-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>+91-1234-567-890</span>
            </a>
            <span className="utility-divider">|</span>
            <a
              href="mailto:info@hshec.gov.in"
              className="utility-item"
              id="utility-email"
            >
              <svg
                className="utility-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <span>info@hshec.gov.in</span>
            </a>
          </div>

          {/* Right side: Accessibility & language controls */}
          <div className="utility-right">
            <a
              href="#main-content"
              className="utility-item skip-link"
              id="skip-to-content"
            >
              Skip to Main Content
            </a>
            <span className="utility-divider">|</span>
            <div
              className="utility-item text-size-controls"
              id="text-size-controls"
            >
              <span className="text-size-label">A</span>
              <button
                onClick={() => handleFontSize("decrease")}
                className="text-size-btn"
                aria-label="Decrease text size"
                id="btn-font-decrease"
              >
                A-
              </button>
              <button
                onClick={() => handleFontSize("reset")}
                className="text-size-btn"
                aria-label="Reset text size"
                id="btn-font-reset"
              >
                A
              </button>
              <button
                onClick={() => handleFontSize("increase")}
                className="text-size-btn"
                aria-label="Increase text size"
                id="btn-font-increase"
              >
                A+
              </button>
            </div>
            <span className="utility-divider">|</span>
            <button
              className="utility-item contrast-toggle"
              onClick={toggleContrast}
              aria-label="Toggle high contrast mode"
              id="btn-contrast-toggle"
            >
              <svg
                className="utility-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2v20M12 2a10 10 0 0 0 0 20z" fill="currentColor" />
              </svg>
              <span>{highContrast ? "Standard" : "High Contrast"}</span>
            </button>
            <span className="utility-divider">|</span>
            <div
              className="utility-item language-switcher"
              id="language-switcher"
            >
              <button className="lang-btn active" id="lang-en">
                English
              </button>
              <button className="lang-btn" id="lang-hi">
                हिन्दी
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ===== TIER 2: Header / Branding ===== */}
      <div className="header-bar" id="header-bar">
        <div className="header-container">
          {/* Left: Dual Logos + Branding Text */}
          <div className="header-left">
            <div className="logos-group">
              <div className="hshec-logo-wrapper" id="hshec-logo" title="Haryana State Higher Education Council">
                <img
                  src={hshecLogo}
                  alt="Haryana State Higher Education Council Logo"
                  className="hshec-logo-img"
                />
              </div>
            </div>
            <div className="branding-text">
              <span className="branding-department">GOVERNMENT OF HARYANA</span>
              <h1 className="branding-title">
                Haryana State Higher Education Council
              </h1>
              <span className="branding-subtitle">
                हरियाणा राज्य उच्च शिक्षा परिषद &nbsp;|&nbsp; National Education Policy Portal
              </span>
            </div>
          </div>

          {/* Right: Search + Sign In */}
          <div className="header-right">
            <div className="search-wrapper" id="search-wrapper">
              <svg
                className="search-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                className="search-input"
                placeholder="Search portal..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                id="search-input"
                aria-label="Search portal"
              />
            </div>
            <button
              className="signin-btn"
              id="btn-signin"
              onClick={() => navigate("/login")}
            >
              <svg
                className="signin-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13.8 12H3" />
              </svg>
              <span>Sign in</span>
            </button>
          </div>
        </div>
      </div>

      {/* ===== TIER 3: Primary Navigation ===== */}
      <nav
        className="primary-nav"
        id="primary-nav"
        aria-label="Main navigation"
      >
        <div className="nav-container">
          <ul className={`nav-list ${isMenuOpen ? "open" : ""}`}>
            {navItems.map((item) => (
              <li key={item} className="nav-item">
                <a
                  href={
                    item === "HOME"
                      ? "/"
                      : item === "DASHBOARD"
                        ? "/dashboard"
                        : `#${item.toLowerCase()}`
                  }
                  className={`nav-link ${activeNav === item ? "active" : ""}`}
                  onClick={(e) => handleNavClick(e, item)}
                  id={`nav-${item.toLowerCase()}`}
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>

          {/* Hamburger for mobile */}
          <button
            className={`hamburger ${isMenuOpen ? "open" : ""}`}
            id="hamburger"
            aria-label="Toggle navigation menu"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
