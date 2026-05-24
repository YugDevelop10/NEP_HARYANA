import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../Dashboard/Dashboard.module.css";
import {
  AUTH_TOKEN_KEY,
  AUTH_USER_KEY,
  getSavedAuthUser,
} from "../../api/auth";

function formatRole(role) {
  if (role === "admin") {
    return "DHE Admin";
  }

  if (role === "principal") {
    return "College Principal";
  }

  if (role === "committee") {
    return "Screening Committee";
  }

  return "Administrator";
}

function AdminDashboard() {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const savedUser = getSavedAuthUser();
  const officerName = savedUser?.full_name || "Ms. Kavita Sharma";
  const officerRole = formatRole(savedUser?.role);
  const departmentName =
    savedUser?.college_name || "Higher Education Department";
  const zoneCode = savedUser?.aishe_code || "DHE-HR";

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
    { section: "ADMIN VIEW" },
    {
      title: "College Approvals",
      icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0V5a2 2 0 012-2h2a2 2 0 012 2v16",
    },
    {
      title: "Policy Compliance",
      icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
    },
    {
      title: "Funding & Grants",
      icon: "M12 8c-2.209 0-4 1.343-4 3s1.791 3 4 3 4 1.343 4 3-1.791 3-4 3m0-12c1.657 0 3 1.343 3 3M12 8V5m0 12v3",
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
            <span>Admin Portal</span>
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
              <h4>{departmentName}</h4>
              <span>Zone: {zoneCode}</span>
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
            <p>
              Department oversight for approvals, compliance, and reporting.
            </p>
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
                placeholder="Search colleges, reports, grants..."
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
                  6
                </span>
              </button>
              {showNotifDropdown && (
                <div className={styles.dropdownMenu}>
                  <div className={styles.dropdownHeader}>Admin Alerts</div>
                  <div className={styles.dropdownItem}>
                    4 colleges are awaiting approval.
                  </div>
                  <div className={styles.dropdownItem}>
                    2 grant submissions need review.
                  </div>
                  <div className={styles.dropdownItem}>
                    Monthly compliance export is ready.
                  </div>
                </div>
              )}
            </div>

            <div className={styles.profileWrapper}>
              <div
                className={styles.userProfile}
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              >
                <div className={styles.avatar}>AD</div>
                <div>
                  <h4>{officerName}</h4>
                  <span>{officerRole}</span>
                </div>
              </div>

              {showProfileDropdown && (
                <div className={styles.dropdownMenu}>
                  <div
                    className={styles.dropdownItem}
                    onClick={() => {
                      setActiveMenu("College Approvals");
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
                  <span>Pending Colleges</span>
                  <div className={styles.kpiValueRow}>
                    <h3>14</h3>
                    <span className={styles.trendDown}>-7%</span>
                  </div>
                  <div className={styles.sparklineWrapper}>
                    <svg
                      viewBox="0 0 100 30"
                      className={styles.sparkline}
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M0,18 C30,12 70,24 100,10"
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                  <a href="#">Review applications →</a>
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
                  <span>Approved Today</span>
                  <div className={styles.kpiValueRow}>
                    <h3>8</h3>
                    <span className={styles.trendUp}>+18%</span>
                  </div>
                  <div className={styles.sparklineWrapper}>
                    <svg
                      viewBox="0 0 100 30"
                      className={styles.sparkline}
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M0,25 C30,16 70,7 100,14"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                  <span className={styles.kpiSub}>
                    College and grant approvals
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
                  <span>Items in Queue</span>
                  <div className={styles.kpiValueRow}>
                    <h3>21</h3>
                    <span className={styles.trendDown}>-3%</span>
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
                        stroke="#ef4444"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                  <span className={styles.kpiSub}>Awaiting admin action</span>
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
                  <span>Policy Compliance</span>
                  <div className={styles.kpiValueRow}>
                    <h3>91</h3>
                    <span className={styles.trendUp}>+4%</span>
                  </div>
                  <div className={styles.sparklineWrapper}>
                    <svg
                      viewBox="0 0 100 30"
                      className={styles.sparkline}
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M0,25 C30,18 70,8 100,6"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                  <span className={styles.kpiSub}>
                    Department-wide compliance score
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.analyticsGrid}>
              <div className={styles.chartCard}>
                <div className={styles.cardHeader}>
                  <h3>State Oversight Overview</h3>
                  <select>
                    <option>Current Month</option>
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
                            style={{ height: "82%" }}
                          >
                            <span>82</span>
                          </div>
                          <div
                            className={styles.barGray}
                            style={{ height: "100%" }}
                          />
                        </div>
                        <span>Approvals</span>
                      </div>

                      <div className={styles.barGroup}>
                        <div className={styles.bars}>
                          <div
                            className={styles.barBlue}
                            style={{ height: "74%" }}
                          >
                            <span>74</span>
                          </div>
                          <div
                            className={styles.barGray}
                            style={{ height: "100%" }}
                          />
                        </div>
                        <span>Compliance</span>
                      </div>

                      <div className={styles.barGroup}>
                        <div className={styles.bars}>
                          <div
                            className={styles.barBlue}
                            style={{ height: "66%" }}
                          >
                            <span>66</span>
                          </div>
                          <div
                            className={styles.barGray}
                            style={{ height: "100%" }}
                          />
                        </div>
                        <span>Funding</span>
                      </div>

                      <div className={styles.barGroup}>
                        <div className={styles.bars}>
                          <div
                            className={styles.barBlue}
                            style={{ height: "58%" }}
                          >
                            <span>58</span>
                          </div>
                          <div
                            className={styles.barGray}
                            style={{ height: "100%" }}
                          />
                        </div>
                        <span>Reports</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.chartLegend}>
                    <div>
                      <span className={styles.legendBlue} /> Score
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
                  <h3>Admin Focus</h3>
                  <div className={styles.circularChartArea}>
                    <div className={styles.circularChart}>
                      <div className={styles.circleInner}>
                        <h4 className={styles.goldScore}>91</h4>
                        <span>/ 100</span>
                      </div>
                    </div>
                    <div className={styles.badgeArea}>
                      <div className={styles.badgeGold}>MONITORING</div>
                      <p>
                        Prioritize pending colleges and overdue compliance
                        items.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className={styles.secondaryBtn}
                    onClick={() => setActiveMenu("Policy Compliance")}
                  >
                    Open compliance view →
                  </button>
                </div>

                <div className={styles.statusCard}>
                  <h3>Approval Status</h3>
                  <div className={styles.statusTimeline}>
                    <div className={`${styles.statusItem} ${styles.completed}`}>
                      <div className={styles.statusDot} />
                      <div className={styles.statusInfo}>
                        <span>College registry synced</span>
                        <small>Updated 09:00 AM</small>
                      </div>
                    </div>
                    <div className={`${styles.statusItem} ${styles.completed}`}>
                      <div className={styles.statusDot} />
                      <div className={styles.statusInfo}>
                        <span>Grant review completed</span>
                        <small>Updated 11:10 AM</small>
                      </div>
                    </div>
                    <div className={`${styles.statusItem} ${styles.active}`}>
                      <div className={styles.statusDot} />
                      <div className={styles.statusInfo}>
                        <span>Policy exceptions pending</span>
                        <small>Waiting for approval</small>
                        <span className={styles.statusPill}>In Progress</span>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className={styles.primaryBtn}
                    onClick={() => setActiveMenu("College Approvals")}
                  >
                    Review queue
                  </button>
                </div>
              </div>
            </div>

            <div className={styles.lowerGrid}>
              <div className={styles.tableCard}>
                <h3>District Control Center</h3>
                <div className={styles.tableWrapper}>
                  <table>
                    <thead>
                      <tr>
                        <th>Category</th>
                        <th>Total</th>
                        <th>Approved</th>
                        <th>Pending</th>
                        <th>Escalated</th>
                        <th>Progress</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>College approvals</td>
                        <td>48</td>
                        <td>34</td>
                        <td>10</td>
                        <td>4</td>
                        <td>
                          <div className={styles.progressCell}>
                            <div className={styles.progBar}>
                              <div
                                style={{ width: "71%", background: "#10b981" }}
                              />
                            </div>
                            <span>71%</span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>Compliance reviews</td>
                        <td>62</td>
                        <td>49</td>
                        <td>9</td>
                        <td>4</td>
                        <td>
                          <div className={styles.progressCell}>
                            <div className={styles.progBar}>
                              <div
                                style={{ width: "79%", background: "#3b82f6" }}
                              />
                            </div>
                            <span>79%</span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>Funding requests</td>
                        <td>26</td>
                        <td>19</td>
                        <td>5</td>
                        <td>2</td>
                        <td>
                          <div className={styles.progressCell}>
                            <div className={styles.progBar}>
                              <div
                                style={{ width: "73%", background: "#f59e0b" }}
                              />
                            </div>
                            <span>73%</span>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr>
                        <td>Total</td>
                        <td>136</td>
                        <td>102</td>
                        <td>24</td>
                        <td>10</td>
                        <td>
                          <div className={styles.progressCell}>
                            <div className={styles.progBar}>
                              <div
                                style={{ width: "75%", background: "#2563eb" }}
                              />
                            </div>
                            <span>75%</span>
                          </div>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              <div className={styles.sideCardsGrid2}>
                <div className={styles.activityCard}>
                  <h3>Recent Admin Activity</h3>
                  <div className={styles.activityList}>
                    <div className={styles.activityItem}>
                      <div className={styles.activityIcon}>📄</div>
                      <div className={styles.activityInfo}>
                        <p>
                          Approved <strong>annual report submission</strong>
                        </p>
                        <small>Today, 11:30 AM</small>
                      </div>
                    </div>
                    <div className={styles.activityItem}>
                      <div className={styles.activityIcon}>✏️</div>
                      <div className={styles.activityInfo}>
                        <p>
                          Reviewed <strong>college compliance flag</strong>
                        </p>
                        <small>Today, 10:05 AM</small>
                      </div>
                    </div>
                    <div className={styles.activityItem}>
                      <div className={styles.activityIcon}>📤</div>
                      <div className={styles.activityInfo}>
                        <p>
                          Published <strong>grant instructions</strong>
                        </p>
                        <small>Yesterday, 05:40 PM</small>
                      </div>
                    </div>
                  </div>
                  <a href="#" className={styles.viewAllLink}>
                    View all activity →
                  </a>
                </div>

                <div className={styles.deadlinesCard}>
                  <h3>Upcoming Deadlines</h3>
                  <div className={styles.deadlineList}>
                    <div className={styles.deadlineItem}>
                      <div className={styles.deadlineIcon}>1</div>
                      <div className={styles.deadlineInfo}>
                        <p>Finalize pending approvals</p>
                        <span className={styles.deadlineTime}>
                          Due today, 4:00 PM
                        </span>
                      </div>
                    </div>
                    <div className={styles.deadlineItem}>
                      <div className={styles.deadlineIcon}>2</div>
                      <div className={styles.deadlineInfo}>
                        <p>Submit department summary</p>
                        <span className={styles.deadlineTime}>
                          Due tomorrow
                        </span>
                      </div>
                    </div>
                    <div className={styles.deadlineItem}>
                      <div className={styles.deadlineIcon}>3</div>
                      <div className={styles.deadlineInfo}>
                        <p>Review grant exceptions</p>
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
        ) : (
          <div className={styles.analyticsGrid}>
            <div className={styles.chartCard}>
              <div className={styles.cardHeader}>
                <h3>{activeMenu}</h3>
                <select>
                  <option>Current Month</option>
                </select>
              </div>
              <p style={{ color: "#64748b", lineHeight: 1.7, marginTop: 0 }}>
                This admin section is ready for forms, review tables, and
                approval workflows while keeping the same dashboard layout.
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
                    <h3>Approve items</h3>
                    <span className={styles.kpiSub}>
                      Open the queue and process pending work.
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
                      Admin dashboard shell is active.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.sideCardsGrid}>
              <div className={styles.scoreLevelCard}>
                <h3>Workspace shortcuts</h3>
                <p style={{ color: "#64748b", margin: 0, lineHeight: 1.7 }}>
                  Jump to approvals, compliance, or reports from this section.
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
                      <span>Admin session loaded</span>
                      <small>{officerName}</small>
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

export default AdminDashboard;
