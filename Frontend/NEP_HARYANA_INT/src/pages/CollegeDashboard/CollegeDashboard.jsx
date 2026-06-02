import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../Dashboard/Dashboard.module.css";
import pageStyles from "./CollegeDashboard.module.css";
import { useAuth } from "../../context/AuthContext.jsx";
import { fetchNominations } from "../../api/nomination";
import NominationWorkspace from "./NominationWorkspace";

function formatRole(role) {
  if (role === "principal") {
    return "College Principal";
  }
  if (role === "admin") {
    return "DHE Admin";
  }
  if (role === "committee") {
    return "Screening Committee";
  }
  return "Principal";
}

function CollegeDashboard() {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const { user: savedUser, logout } = useAuth();
  const collegeName = savedUser?.college_name || "Govt College Example";
  const principalName = savedUser?.full_name || "Dr. Rajesh Kumar";
  const principalRole = formatRole(savedUser?.role);
  const aisheCode = savedUser?.aishe_code || "C-12345";
  
  // Forms loading state
  const [formsList, setFormsList] = useState([]);
  const [formsLoading, setFormsLoading] = useState(false);
  const [formsError, setFormsError] = useState("");
  const [selectedFormId, setSelectedFormId] = useState(null);

  const loadFormsList = useCallback(async () => {
    setFormsLoading(true);
    setFormsError("");
    try {
      const data = await fetchNominations();
      setFormsList(data);
    } catch (err) {
      console.error("Failed to load forms list:", err);
      setFormsError(err.message || "Failed to load available forms.");
    } finally {
      setFormsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeMenu === "Forms") {
      loadFormsList();
    }
  }, [activeMenu, loadFormsList]);

  const handleLogout = async () => {
    await logout();
    setShowProfileDropdown(false);
    navigate("/auth/login");
  };

  const menuItems = [
    {
      title: "Dashboard",
      icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    },
    {
      title: "Forms",
      icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    }
  ];

  return (
    <div className={styles.dashboardLayout}>
      <aside className={styles.sidebar}>
        <div
          className={styles.sidebarLogo}
          onClick={() => setActiveMenu("Dashboard")}
          style={{ cursor: "pointer" }}
        >
          <svg
            className={styles.logoIcon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 14l9-5-9-5-9 5 9 5z" />
            <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A8.995 8.995 0 0112 21a8.995 8.995 0 01-6.825-4.943 12.083 12.083 0 01.665-6.479L12 14z" />
            <path d="M12 14v7" />
          </svg>
          <div className={styles.logoText}>
            <h1>HSHEC</h1>
            <span>Principal Portal</span>
          </div>
        </div>

        <nav className={styles.sidebarNav}>
          {menuItems.map((item, index) => (
            <button
              key={index}
              type="button"
              className={`${styles.navItem} ${activeMenu === item.title ? styles.active : ""}`}
              onClick={() => setActiveMenu(item.title)}
            >
              <svg
                className={styles.navIcon}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d={item.icon} />
              </svg>
              <span>{item.title}</span>
            </button>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.collegeProfile}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0V5a2 2 0 012-2h2a2 2 0 012 2v16" />
            </svg>
            <div>
              <h4>{collegeName}</h4>
              <span>AISHE: {aisheCode}</span>
            </div>
          </div>
        </div>
      </aside>

      <div className={styles.mainContent}>
        <header className={styles.topNavbar}>
          <div className={styles.headerTitle}>
            <div className={styles.breadcrumbs}>
              <span>Home</span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 5l7 7-7 7" />
              </svg>
              <span className={styles.breadcrumbActive}>{activeMenu}</span>
            </div>
            <h2>{activeMenu}</h2>
            <p>NEP Excellence Awards Evaluation Portal.</p>
          </div>

          <div className={styles.headerActions}>
            <div className={styles.profileWrapper}>
              <div
                className={styles.userProfile}
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              >
                <div className={styles.avatar}>PP</div>
                <div>
                  <h4>{principalName}</h4>
                  <span>{principalRole}</span>
                </div>
              </div>

              {showProfileDropdown && (
                <div className={styles.dropdownMenu}>
                  <button
                    type="button"
                    className={styles.dropdownItemButton}
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

            <button
              type="button"
              className={styles.logoutButton}
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </header>

        {selectedFormId ? (
          <NominationWorkspace formId={selectedFormId} onBack={() => { setSelectedFormId(null); loadFormsList(); }} />
        ) : activeMenu === "Dashboard" ? (
          <div className={pageStyles.overviewGrid}>
            <section className={pageStyles.welcomeCard}>
              <h3>HSHEC Principal Portal</h3>
              <p>
                Welcome to the Haryana State Higher Education Council portal.
                The nomination workflow and scoring modules have been refactored
                to use the secure JWT and evaluation engines.
              </p>
            </section>

            <section className={pageStyles.infoCard}>
              <h3>Institution Profile</h3>
              <div className={pageStyles.infoDetails}>
                <div className={pageStyles.infoRow}>
                  <span>College Name:</span>
                  <strong>{collegeName}</strong>
                </div>
                <div className={pageStyles.infoRow}>
                  <span>AISHE Code:</span>
                  <strong>{aisheCode}</strong>
                </div>
                <div className={pageStyles.infoRow}>
                  <span>Principal:</span>
                  <strong>{principalName}</strong>
                </div>
                <div className={pageStyles.infoRow}>
                  <span>Role:</span>
                  <strong>{principalRole}</strong>
                </div>
              </div>
            </section>
          </div>
        ) : activeMenu === "Forms" ? (
          <div style={{ padding: "24px" }}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: "700", marginBottom: "18px", color: "#1e293b" }}>Available Nomination Forms</h3>
            {formsError && (
              <div style={{ backgroundColor: "#fee2e2", borderLeft: "4px solid #ef4444", color: "#b91c1c", padding: "12px", borderRadius: "8px", fontSize: "0.875rem", marginBottom: "16px" }}>
                {formsError}
              </div>
            )}
            {formsLoading ? (
              <p style={{ color: "#64748b", fontSize: "0.875rem" }}>Loading available forms...</p>
            ) : formsList.length === 0 ? (
              <p style={{ color: "#64748b", fontSize: "0.875rem" }}>No active forms available at the moment.</p>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "24px" }}>
                {formsList.map((form) => (
                  <div key={form.id} style={{ backgroundColor: "#ffffff", border: "1px solid #f1f5f9", borderRadius: "16px", padding: "24px", boxShadow: "0 4px 20px rgba(0,0,0,0.02)", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "180px" }}>
                    <div>
                      <span style={{ fontSize: "0.6875rem", backgroundColor: "#f1f5f9", padding: "4px 10px", borderRadius: "9999px", textTransform: "uppercase", fontWeight: "700", color: "#64748b" }}>{form.issued_by} • {form.academic_session}</span>
                      <h4 style={{ fontSize: "0.9375rem", fontWeight: "700", marginTop: "12px", marginBottom: "16px", color: "#0f172a", lineHeight: "1.4" }}>{form.title}</h4>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{
                        fontSize: "0.75rem",
                        fontWeight: "700",
                        padding: "6px 14px",
                        borderRadius: "9999px",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        backgroundColor: form.status === "submitted" ? "#d1fae5" : form.status === "draft" ? "#fef3c7" : "#f1f5f9",
                        color: form.status === "submitted" ? "#065f46" : form.status === "draft" ? "#78350f" : "#475569"
                      }}>{form.status.replace("_", " ")}</span>
                      <button
                        type="button"
                        className={styles.secondaryBtn}
                        style={{ padding: "8px 16px", fontSize: "0.8125rem", fontWeight: "600", borderColor: "#2563eb", color: "#2563eb", cursor: "pointer" }}
                        onClick={() => setSelectedFormId(form.id)}
                      >
                        Open Form
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default CollegeDashboard;
