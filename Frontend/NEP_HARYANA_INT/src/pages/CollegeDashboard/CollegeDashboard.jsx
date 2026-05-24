import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../Dashboard/Dashboard.module.css";
import FormsHub from "./FormsHub/FormsHub";
import {
  AUTH_TOKEN_KEY,
  AUTH_USER_KEY,
  getSavedAuthUser,
} from "../../api/auth";

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
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const savedUser = getSavedAuthUser();
  const collegeName = savedUser?.college_name || "Govt College Example";
  const principalName = savedUser?.full_name || "Dr. Rajesh Kumar";
  const principalRole = formatRole(savedUser?.role);
  const aisheCode = savedUser?.aishe_code || "C-12345";

  const handleLogout = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    setShowNotifDropdown(false);
    setShowProfileDropdown(false);
    navigate("/auth/login");
  };

  const menuItems = [
    {
      title: "Dashboard",
      icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    },
    { section: "PRINCIPAL VIEW" },
    {
      title: "Institution Snapshot",
      icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0V5a2 2 0 012-2h2a2 2 0 012 2v16",
    },
    {
      title: "Academic Progress",
      icon: "M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A8.995 8.995 0 0112 21a8.995 8.995 0 01-6.825-4.943 12.083 12.083 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222",
    },
    {
      title: "Faculty & Students",
      icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
    },
    {
      title: "Compliance Checks",
      icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
    },
    {
      title: "Forms",
      icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z",
    },
    {
      title: "Documents",
      icon: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12",
    },
    {
      title: "Reports",
      icon: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V17a2 2 0 01-2 2z",
    },
    {
      title: "Settings",
      icon: "M9.663 17h4.674M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-6.657l.707.707m2.828 9.9a4.5 4.5 0 115.656 0M9 21h6",
    },
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
          {menuItems.map((item, index) =>
            item.section ? (
              <div key={index} className={styles.navSectionHeader}>
                {item.section}
              </div>
            ) : (
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
            ),
          )}
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
            <p>Principal workspace for institution oversight and approvals.</p>
          </div>

          <div className={styles.headerActions}>
            <div className={styles.searchBar}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search reports, files, people..."
              />
              <div className={styles.searchShortcut}>⌘K</div>
            </div>

            <div className={styles.notifWrapper}>
              <button
                type="button"
                className={styles.notifBtn}
                onClick={() => setShowNotifDropdown(!showNotifDropdown)}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className={`${styles.notifBadge} ${styles.pulse}`}>
                  4
                </span>
              </button>
              {showNotifDropdown && (
                <div className={styles.dropdownMenu}>
                  <div className={styles.dropdownHeader}>Principal Alerts</div>
                  <div className={styles.dropdownItem}>
                    2 compliance items are due for review.
                  </div>
                  <div className={styles.dropdownItem}>
                    Faculty verification is pending for 3 records.
                  </div>
                  <div className={styles.dropdownItem}>
                    Quarterly report export is ready.
                  </div>
                </div>
              )}
            </div>

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
                  <div
                    className={styles.dropdownItem}
                    onClick={() => {
                      setActiveMenu("Institution Snapshot");
                      setShowProfileDropdown(false);
                    }}
                  >
                    My Profile
                  </div>
                  <div
                    className={styles.dropdownItem}
                    onClick={() => {
                      setActiveMenu("Settings");
                      setShowProfileDropdown(false);
                    }}
                  >
                    Settings
                  </div>
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

        {activeMenu === "Dashboard" ? (
          <>
            <div className={styles.kpiGrid}>
              <div className={styles.kpiCard}>
                <div className={`${styles.kpiIcon} ${styles.blue}`}>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0V5a2 2 0 012-2h2a2 2 0 012 2v16" />
                  </svg>
                </div>
                <div className={styles.kpiInfo}>
                  <span>Pending Reviews</span>
                  <div className={styles.kpiValueRow}>
                    <h3>18</h3>
                    <span className={styles.trendDown}>-4%</span>
                  </div>
                  <div className={styles.sparklineWrapper}>
                    <svg
                      viewBox="0 0 100 30"
                      className={styles.sparkline}
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M0,18 C30,10 70,24 100,12"
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                  <a href="#">Review queue →</a>
                </div>
              </div>

              <div className={styles.kpiCard}>
                <div className={`${styles.kpiIcon} ${styles.green}`}>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className={styles.kpiInfo}>
                  <span>Verified Records</span>
                  <div className={styles.kpiValueRow}>
                    <h3>52</h3>
                    <span className={styles.trendUp}>+12%</span>
                  </div>
                  <div className={styles.sparklineWrapper}>
                    <svg
                      viewBox="0 0 100 30"
                      className={styles.sparkline}
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M0,24 C30,8 75,6 100,16"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                  <span className={styles.kpiSub}>
                    Faculty and student data
                  </span>
                </div>
              </div>

              <div className={styles.kpiCard}>
                <div className={`${styles.kpiIcon} ${styles.orange}`}>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className={styles.kpiInfo}>
                  <span>Open Tasks</span>
                  <div className={styles.kpiValueRow}>
                    <h3>11</h3>
                    <span className={styles.trendDown}>-2%</span>
                  </div>
                  <div className={styles.sparklineWrapper}>
                    <svg
                      viewBox="0 0 100 30"
                      className={styles.sparkline}
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M0,15 C30,5 70,25 100,15"
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                  <span className={styles.kpiSub}>Items awaiting action</span>
                </div>
              </div>

              <div className={styles.kpiCard}>
                <div className={`${styles.kpiIcon} ${styles.purple}`}>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M9 19v-6a2 2 0 012-2h2a2 2 0 012 2v6m-6 0h6M12 10a2 2 0 100-4 2 2 0 000 4z" />
                  </svg>
                </div>
                <div className={styles.kpiInfo}>
                  <span>Compliance Score</span>
                  <div className={styles.kpiValueRow}>
                    <h3>
                      84 <span className={styles.scoreMax}>/ 100</span>
                    </h3>
                    <span className={styles.trendUp}>+6%</span>
                  </div>
                  <div className={styles.sparklineWrapper}>
                    <svg
                      viewBox="0 0 100 30"
                      className={styles.sparkline}
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M0,25 C30,22 70,8 100,6"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                  <a href="#">See compliance gaps →</a>
                </div>
              </div>
            </div>

            <div className={styles.analyticsGrid}>
              <div className={styles.chartCard}>
                <div className={styles.cardHeader}>
                  <h3>Institution Readiness Overview</h3>
                  <select>
                    <option>Current Quarter</option>
                  </select>
                </div>

                <div className={styles.chartContainer}>
                  <div className={styles.barChart}>
                    <div className={styles.chartYAxis}>
                      <span>100</span>
                      <span>75</span>
                      <span>50</span>
                      <span>25</span>
                      <span>0</span>
                    </div>
                    <div className={styles.chartBarsArea}>
                      <div className={styles.dottedLine} />

                      <div className={styles.barGroup}>
                        <div className={styles.bars}>
                          <div
                            className={styles.barBlue}
                            style={{ height: "78%" }}
                          >
                            <span>78</span>
                          </div>
                          <div
                            className={styles.barGray}
                            style={{ height: "100%" }}
                          />
                        </div>
                        <span>Faculty</span>
                      </div>

                      <div className={styles.barGroup}>
                        <div className={styles.bars}>
                          <div
                            className={styles.barBlue}
                            style={{ height: "68%" }}
                          >
                            <span>68</span>
                          </div>
                          <div
                            className={styles.barGray}
                            style={{ height: "100%" }}
                          />
                        </div>
                        <span>Students</span>
                      </div>

                      <div className={styles.barGroup}>
                        <div className={styles.bars}>
                          <div
                            className={styles.barBlue}
                            style={{ height: "86%" }}
                          >
                            <span>86</span>
                          </div>
                          <div
                            className={styles.barGray}
                            style={{ height: "100%" }}
                          />
                        </div>
                        <span>Docs</span>
                      </div>

                      <div className={styles.barGroup}>
                        <div className={styles.bars}>
                          <div
                            className={styles.barBlue}
                            style={{ height: "64%" }}
                          >
                            <span>64</span>
                          </div>
                          <div
                            className={styles.barGray}
                            style={{ height: "100%" }}
                          />
                        </div>
                        <span>Infra</span>
                      </div>

                      <div className={styles.barGroup}>
                        <div className={styles.bars}>
                          <div
                            className={styles.barBlue}
                            style={{ height: "72%" }}
                          >
                            <span>72</span>
                          </div>
                          <div
                            className={styles.barGray}
                            style={{ height: "100%" }}
                          />
                        </div>
                        <span>Compliance</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.chartLegend}>
                    <div>
                      <span className={styles.legendBlue} /> Ready score
                    </div>
                    <div>
                      <span className={styles.legendGray} /> Target
                    </div>
                    <div>
                      <span className={styles.legendDotted} /> Review line
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.sideCardsGrid}>
                <div className={styles.scoreLevelCard}>
                  <h3>Principal Priorities</h3>
                  <div className={styles.circularChartArea}>
                    <div className={styles.circularChart}>
                      <div className={styles.circleInner}>
                        <h4 className={styles.goldScore}>84</h4>
                        <span>/ 100</span>
                      </div>
                    </div>
                    <div className={styles.badgeArea}>
                      <div className={styles.badgeGold}>ON TRACK</div>
                      <p>Focus on review queue and report exports this week.</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className={styles.secondaryBtn}
                    onClick={() => setActiveMenu("Compliance Checks")}
                  >
                    Open compliance checks →
                  </button>
                </div>

                <div className={styles.statusCard}>
                  <h3>Submission Status</h3>
                  <div className={styles.statusTimeline}>
                    <div className={`${styles.statusItem} ${styles.completed}`}>
                      <div className={styles.statusDot} />
                      <div className={styles.statusInfo}>
                        <span>Institution profile updated</span>
                        <small>Today, 09:30 AM</small>
                      </div>
                    </div>
                    <div className={`${styles.statusItem} ${styles.completed}`}>
                      <div className={styles.statusDot} />
                      <div className={styles.statusInfo}>
                        <span>Faculty list verified</span>
                        <small>Today, 11:15 AM</small>
                      </div>
                    </div>
                    <div className={`${styles.statusItem} ${styles.active}`}>
                      <div className={styles.statusDot} />
                      <div className={styles.statusInfo}>
                        <span>Compliance review in progress</span>
                        <small>Awaiting final sign-off</small>
                        <span className={styles.statusPill}>In Progress</span>
                      </div>
                    </div>
                    <div className={styles.statusItem}>
                      <div className={styles.statusDot} />
                      <div className={styles.statusInfo}>
                        <span>Quarterly report draft</span>
                        <small>Pending export</small>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className={styles.primaryBtn}
                    onClick={() => setActiveMenu("Reports")}
                  >
                    Review latest report
                  </button>
                </div>
              </div>
            </div>

            <div className={styles.lowerGrid}>
              <div className={styles.tableCard}>
                <h3>Institution Snapshot</h3>
                <div className={styles.tableWrapper}>
                  <table>
                    <thead>
                      <tr>
                        <th>Area</th>
                        <th>Total</th>
                        <th>Verified</th>
                        <th>Pending</th>
                        <th>Status</th>
                        <th>Progress</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Faculty records</td>
                        <td>28</td>
                        <td>24</td>
                        <td>4</td>
                        <td>Ready</td>
                        <td>
                          <div className={styles.progressCell}>
                            <div className={styles.progBar}>
                              <div
                                style={{ width: "86%", background: "#10b981" }}
                              />
                            </div>
                            <span>86%</span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>Student statistics</td>
                        <td>1,240</td>
                        <td>1,182</td>
                        <td>58</td>
                        <td>Review</td>
                        <td>
                          <div className={styles.progressCell}>
                            <div className={styles.progBar}>
                              <div
                                style={{ width: "78%", background: "#3b82f6" }}
                              />
                            </div>
                            <span>78%</span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>Documents upload</td>
                        <td>36</td>
                        <td>31</td>
                        <td>5</td>
                        <td>Pending</td>
                        <td>
                          <div className={styles.progressCell}>
                            <div className={styles.progBar}>
                              <div
                                style={{ width: "86%", background: "#10b981" }}
                              />
                            </div>
                            <span>86%</span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>Infrastructure items</td>
                        <td>22</td>
                        <td>14</td>
                        <td>8</td>
                        <td>Needs review</td>
                        <td>
                          <div className={styles.progressCell}>
                            <div className={styles.progBar}>
                              <div
                                style={{ width: "64%", background: "#f59e0b" }}
                              />
                            </div>
                            <span>64%</span>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr>
                        <td>Total</td>
                        <td>326</td>
                        <td>271</td>
                        <td>55</td>
                        <td>Active</td>
                        <td>
                          <div className={styles.progressCell}>
                            <div className={styles.progBar}>
                              <div
                                style={{ width: "83%", background: "#2563eb" }}
                              />
                            </div>
                            <span>83%</span>
                          </div>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              <div className={styles.sideCardsGrid2}>
                <div className={styles.activityCard}>
                  <h3>Recent Principal Notes</h3>
                  <div className={styles.activityList}>
                    <div className={styles.activityItem}>
                      <div className={styles.activityIcon}>📄</div>
                      <div className={styles.activityInfo}>
                        <p>
                          Uploaded final proof for{" "}
                          <strong>faculty verification</strong>
                        </p>
                        <small>Today, 11:45 AM</small>
                      </div>
                    </div>
                    <div className={styles.activityItem}>
                      <div className={styles.activityIcon}>✏️</div>
                      <div className={styles.activityInfo}>
                        <p>
                          Updated <strong>institution profile</strong> contact
                          details
                        </p>
                        <small>Today, 10:20 AM</small>
                      </div>
                    </div>
                    <div className={styles.activityItem}>
                      <div className={styles.activityIcon}>📤</div>
                      <div className={styles.activityInfo}>
                        <p>
                          Exported <strong>quarterly summary report</strong>
                        </p>
                        <small>Yesterday, 06:40 PM</small>
                      </div>
                    </div>
                  </div>
                  <a href="#" className={styles.viewAllLink}>
                    View all notes →
                  </a>
                </div>

                <div className={styles.deadlinesCard}>
                  <h3>Upcoming Tasks</h3>
                  <div className={styles.deadlineList}>
                    <div className={styles.deadlineItem}>
                      <div className={styles.deadlineIcon}>1</div>
                      <div className={styles.deadlineInfo}>
                        <p>Submit compliance sign-off</p>
                        <span className={styles.deadlineTime}>
                          Due today, 5:00 PM
                        </span>
                      </div>
                    </div>
                    <div className={styles.deadlineItem}>
                      <div className={styles.deadlineIcon}>2</div>
                      <div className={styles.deadlineInfo}>
                        <p>Approve pending faculty entries</p>
                        <span className={styles.deadlineTime}>
                          Due tomorrow
                        </span>
                      </div>
                    </div>
                    <div className={styles.deadlineItem}>
                      <div className={styles.deadlineIcon}>3</div>
                      <div className={styles.deadlineInfo}>
                        <p>Review report export package</p>
                        <span className={styles.deadlineTime}>
                          Due in 2 days
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : activeMenu === "Forms" ? (
          <FormsHub />
        ) : (
          <div className={styles.analyticsGrid}>
            <div className={styles.chartCard}>
              <div className={styles.cardHeader}>
                <h3>{activeMenu}</h3>
                <select>
                  <option>Current Quarter</option>
                </select>
              </div>
              <p style={{ color: "#64748b", lineHeight: 1.7, marginTop: 0 }}>
                This section is set up for the principal workflow. It can be
                expanded with action forms, approvals, and detailed records
                without changing the layout.
              </p>
              <div className={styles.kpiGrid}>
                <div className={styles.kpiCard}>
                  <div className={`${styles.kpiIcon} ${styles.blue}`}>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M12 14l9-5-9-5-9 5 9 5z" />
                    </svg>
                  </div>
                  <div className={styles.kpiInfo}>
                    <span>Next step</span>
                    <h3>Review data</h3>
                    <span className={styles.kpiSub}>
                      Open pending records and verify changes.
                    </span>
                  </div>
                </div>
                <div className={styles.kpiCard}>
                  <div className={`${styles.kpiIcon} ${styles.green}`}>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className={styles.kpiInfo}>
                    <span>Status</span>
                    <h3>Ready</h3>
                    <span className={styles.kpiSub}>
                      Principal dashboard shell is active.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.sideCardsGrid}>
              <div className={styles.scoreLevelCard}>
                <h3>Workspace shortcuts</h3>
                <p style={{ color: "#64748b", margin: 0, lineHeight: 1.7 }}>
                  Move back to the main dashboard, open compliance checks, or
                  jump into reports when you are ready.
                </p>
                <button
                  type="button"
                  className={styles.primaryBtn}
                  onClick={() => setActiveMenu("Dashboard")}
                >
                  Back to overview
                </button>
              </div>

              <div className={styles.statusCard}>
                <h3>Checklist</h3>
                <div className={styles.statusTimeline}>
                  <div className={`${styles.statusItem} ${styles.completed}`}>
                    <div className={styles.statusDot} />
                    <div className={styles.statusInfo}>
                      <span>Principal session loaded</span>
                      <small>{principalName}</small>
                    </div>
                  </div>
                  <div className={`${styles.statusItem} ${styles.active}`}>
                    <div className={styles.statusDot} />
                    <div className={styles.statusInfo}>
                      <span>Open the current section</span>
                      <small>{activeMenu}</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CollegeDashboard;
