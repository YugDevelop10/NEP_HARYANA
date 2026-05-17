import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.css';
import InstitutionInfo from '../InstitutionInfo/InstitutionInfo';
import AcademicInfo from '../AcademicInfo/AcademicInfo';
import FacultyInfo from '../FacultyInfo/FacultyInfo';
import StudentStats from '../StudentStats/StudentStats';
import NEPIndicators from '../NEPIndicators/NEPIndicators';
import InfraDetails from '../InfraDetails/InfraDetails';
import ResearchInnovation from '../ResearchInnovation/ResearchInnovation';
import InternshipPlacement from '../InternshipPlacement/InternshipPlacement';
import DocsUpload from '../DocsUpload/DocsUpload';
import ScoreEvaluation from '../ScoreEvaluation/ScoreEvaluation';
import UserProfile from '../UserProfile/UserProfile';
import Settings from '../Settings/Settings';
import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from '../../api/auth';

function Dashboard() {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    setShowNotifDropdown(false);
    setShowProfileDropdown(false);
    navigate('/signin');
  };

  const menuItems = [
    { title: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { section: 'DATA ENTRY' },
    { title: 'Institution Information', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0V5a2 2 0 012-2h2a2 2 0 012 2v16' },
    { title: 'Academic Information', icon: 'M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A8.995 8.995 0 0112 21a8.995 8.995 0 01-6.825-4.943 12.083 12.083 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222' },
    { title: 'Faculty Information', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
    { title: 'Student Statistics', icon: 'M9 19v-6a2 2 0 012-2h2a2 2 0 012 2v6m-6 0h6M12 10a2 2 0 100-4 2 2 0 000 4z' },
    { title: 'NEP Indicators', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
    { title: 'Infrastructure Details', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0V5a2 2 0 012-2h2a2 2 0 012 2v16' },
    { title: 'Research & Innovation', icon: 'M9.663 17h4.674M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-6.657l.707.707m2.828 9.9a4.5 4.5 0 115.656 0M9 21h6' },
    { title: 'Internship & Placement', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { title: 'Documents Upload', icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12' },
    { section: 'EVALUATION' },
    { title: 'Score & Evaluation', icon: 'M9 19v-6a2 2 0 012-2h2a2 2 0 012 2v6m-6 0h6M12 10a2 2 0 100-4 2 2 0 000 4z' },
    { title: 'Indicator Summary', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V17a2 2 0 01-2 2z' },
    { section: 'OTHER' },
    { title: 'Notifications', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
    { title: 'Help & Support', icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z' }
  ];

  return (
    <div className={styles.dashboardLayout}>
      {/* ===== SIDEBAR ===== */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarLogo} onClick={() => setActiveMenu('Dashboard')} style={{ cursor: 'pointer' }}>
          <svg className={styles.logoIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 14l9-5-9-5-9 5 9 5z" />
            <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A8.995 8.995 0 0112 21a8.995 8.995 0 01-6.825-4.943 12.083 12.083 0 01.665-6.479L12 14z" />
            <path d="M12 14v7" />
          </svg>
          <div className={styles.logoText}>
            <h1>HSHEC</h1>
            <span>NEP Portal</span>
          </div>
        </div>

        <nav className={styles.sidebarNav}>
          {menuItems.map((item, index) => (
            item.section ? (
              <div key={index} className={styles.navSectionHeader}>{item.section}</div>
            ) : (
              <button
                key={index}
                className={`${styles.navItem} ${activeMenu === item.title ? styles.active : ''}`}
                onClick={() => setActiveMenu(item.title)}
              >
                <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d={item.icon} />
                </svg>
                <span>{item.title}</span>
              </button>
            )
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.collegeProfile}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0V5a2 2 0 012-2h2a2 2 0 012 2v16" />
            </svg>
            <div>
              <h4>Govt College Example</h4>
              <span>AISHE: C-12345</span>
            </div>
          </div>
        </div>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <div className={styles.mainContent}>
        {/* TOP NAVBAR */}
        <header className={styles.topNavbar}>
          <div className={styles.headerTitle}>
            <div className={styles.breadcrumbs}>
              <span>Home</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 5l7 7-7 7" /></svg>
              <span className={styles.breadcrumbActive}>{activeMenu}</span>
            </div>
            <h2>{activeMenu}</h2>
            <p>Manage your data and track progress.</p>
          </div>
          <div className={styles.headerActions}>
            <div className={styles.searchBar}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input type="text" placeholder="Search anything..." />
              <div className={styles.searchShortcut}>⌘K</div>
            </div>
            <div className={styles.notifWrapper}>
              <button className={styles.notifBtn} onClick={() => setShowNotifDropdown(!showNotifDropdown)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className={`${styles.notifBadge} ${styles.pulse}`}>3</span>
              </button>
              {showNotifDropdown && (
                <div className={styles.dropdownMenu}>
                  <div className={styles.dropdownHeader}>Notifications</div>
                  <div className={styles.dropdownItem}>New document request from State.</div>
                  <div className={styles.dropdownItem}>Your score was updated.</div>
                  <div className={styles.dropdownItem}>Deadline approaching: 31 May.</div>
                </div>
              )}
            </div>

            <div className={styles.profileWrapper}>
              <div className={styles.userProfile} onClick={() => setShowProfileDropdown(!showProfileDropdown)}>
                <div className={styles.avatar}>DR</div>
                <div>
                  <h4>Dr. Rajesh Kumar</h4>
                  <span>College Admin</span>
                </div>
              </div>
              {showProfileDropdown && (
                <div className={styles.dropdownMenu}>
                  <div className={styles.dropdownItem} onClick={() => { setActiveMenu('My Profile'); setShowProfileDropdown(false); }}>My Profile</div>
                  <div className={styles.dropdownItem} onClick={() => { setActiveMenu('Settings'); setShowProfileDropdown(false); }}>Settings</div>
                  <button type="button" className={styles.dropdownItemButton} onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>

            <button type="button" className={styles.logoutButton} onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        {/* Conditional Content */}
        {activeMenu === 'Dashboard' && (
          <>
            {/* KPI CARDS */}
            <div className={styles.kpiGrid}>
              <div className={styles.kpiCard}>
                <div className={`${styles.kpiIcon} ${styles.blue}`}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0V5a2 2 0 012-2h2a2 2 0 012 2v16" /></svg>
                </div>
                <div className={styles.kpiInfo}>
                  <span>Total Indicators</span>
                  <div className={styles.kpiValueRow}>
                    <h3>78</h3>
                    <span className={styles.trendUp}>+5%</span>
                  </div>
                  <div className={styles.sparklineWrapper}>
                    <svg viewBox="0 0 100 30" className={styles.sparkline} preserveAspectRatio="none">
                      <path d="M0,20 C30,10 70,30 100,15" fill="none" stroke="#10b981" strokeWidth="2" />
                    </svg>
                  </div>
                  <a href="#">All Indicators →</a>
                </div>
              </div>
              <div className={styles.kpiCard}>
                <div className={`${styles.kpiIcon} ${styles.green}`}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 13l4 4L19 7" /></svg>
                </div>
                <div className={styles.kpiInfo}>
                  <span>Completed</span>
                  <div className={styles.kpiValueRow}>
                    <h3>52</h3>
                    <span className={styles.trendUp}>+12%</span>
                  </div>
                  <div className={styles.sparklineWrapper}>
                    <svg viewBox="0 0 100 30" className={styles.sparkline} preserveAspectRatio="none">
                      <path d="M0,25 C25,5 75,5 100,25" fill="none" stroke="#10b981" strokeWidth="2" />
                    </svg>
                  </div>
                  <span className={styles.kpiSub}>66.67% Completed</span>
                </div>
              </div>
              <div className={styles.kpiCard}>
                <div className={`${styles.kpiIcon} ${styles.orange}`}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div className={styles.kpiInfo}>
                  <span>Pending</span>
                  <div className={styles.kpiValueRow}>
                    <h3>18</h3>
                    <span className={styles.trendDown}>-3%</span>
                  </div>
                  <div className={styles.sparklineWrapper}>
                    <svg viewBox="0 0 100 30" className={styles.sparkline} preserveAspectRatio="none">
                      <path d="M0,15 C30,5 70,25 100,15" fill="none" stroke="#ef4444" strokeWidth="2" />
                    </svg>
                  </div>
                  <span className={styles.kpiSub}>23.08% Pending</span>
                </div>
              </div>
              <div className={styles.kpiCard}>
                <div className={`${styles.kpiIcon} ${styles.red}`}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                </div>
                <div className={styles.kpiInfo}>
                  <span>Documents Uploaded</span>
                  <div className={styles.kpiValueRow}>
                    <h3>64</h3>
                    <span className={styles.trendUp}>+8%</span>
                  </div>
                  <div className={styles.sparklineWrapper}>
                    <svg viewBox="0 0 100 30" className={styles.sparkline} preserveAspectRatio="none">
                      <path d="M0,15 C30,5 70,25 100,20" fill="none" stroke="#10b981" strokeWidth="2" />
                    </svg>
                  </div>
                  <a href="#">View All Documents →</a>
                </div>
              </div>
              <div className={styles.kpiCard}>
                <div className={`${styles.kpiIcon} ${styles.purple}`}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 19v-6a2 2 0 012-2h2a2 2 0 012 2v6m-6 0h6M12 10a2 2 0 100-4 2 2 0 000 4z" /></svg>
                </div>
                <div className={styles.kpiInfo}>
                  <span>Current Score</span>
                  <div className={styles.kpiValueRow}>
                    <h3>612 <span className={styles.scoreMax}>/ 1000</span></h3>
                    <span className={styles.trendUp}>+15%</span>
                  </div>
                  <div className={styles.sparklineWrapper}>
                    <svg viewBox="0 0 100 30" className={styles.sparkline} preserveAspectRatio="none">
                      <path d="M0,25 C30,25 70,5 100,10" fill="none" stroke="#10b981" strokeWidth="2" />
                    </svg>
                  </div>
                  <a href="#">View Score Details →</a>
                </div>
              </div>
            </div>

            {/* ANALYTICS SECTION */}
            <div className={styles.analyticsGrid}>
              {/* Left Large Card: Score Overview */}
              <div className={styles.chartCard}>
                <div className={styles.cardHeader}>
                  <h3>Score Overview</h3>
                  <select>
                    <option>Current Year</option>
                  </select>
                </div>
                <div className={styles.chartContainer}>
                  {/* Simulated Chart */}
                  <div className={styles.barChart}>
                    <div className={styles.chartYAxis}>
                      <span>1000</span><span>750</span><span>500</span><span>250</span><span>0</span>
                    </div>
                    <div className={styles.chartBarsArea}>
                      {/* Dotted Line for State Average */}
                      <div className={styles.dottedLine}></div>
                      
                      <div className={styles.barGroup}>
                        <div className={styles.bars}>
                          <div className={styles.barBlue} style={{ height: '70%' }}><span>140</span></div>
                          <div className={styles.barGray} style={{ height: '100%' }}></div>
                        </div>
                        <span>Academic</span>
                      </div>
                      <div className={styles.barGroup}>
                        <div className={styles.bars}>
                          <div className={styles.barBlue} style={{ height: '60%' }}><span>120</span></div>
                          <div className={styles.barGray} style={{ height: '100%' }}></div>
                        </div>
                        <span>Research</span>
                      </div>
                      <div className={styles.barGroup}>
                        <div className={styles.bars}>
                          <div className={styles.barBlue} style={{ height: '80%' }}><span>160</span></div>
                          <div className={styles.barGray} style={{ height: '100%' }}></div>
                        </div>
                        <span>NEP Impl.</span>
                      </div>
                      <div className={styles.barGroup}>
                        <div className={styles.bars}>
                          <div className={styles.barBlue} style={{ height: '55%' }}><span>110</span></div>
                          <div className={styles.barGray} style={{ height: '100%' }}></div>
                        </div>
                        <span>Infra.</span>
                      </div>
                      <div className={styles.barGroup}>
                        <div className={styles.bars}>
                          <div className={styles.barBlue} style={{ height: '50%' }}><span>100</span></div>
                          <div className={styles.barGray} style={{ height: '100%' }}></div>
                        </div>
                        <span>Support</span>
                      </div>
                      <div className={styles.barGroup}>
                        <div className={styles.bars}>
                          <div className={styles.barBlue} style={{ height: '36%' }}><span>72</span></div>
                          <div className={styles.barGray} style={{ height: '100%' }}></div>
                        </div>
                        <span>Governance</span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.chartLegend}>
                    <div><span className={styles.legendBlue}></span> Your Score</div>
                    <div><span className={styles.legendGray}></span> Max Score</div>
                    <div><span className={styles.legendDotted}></span> State Avg</div>
                  </div>
                </div>
              </div>

              {/* Right Cards */}
              <div className={styles.sideCardsGrid}>
                {/* Overall Score & Level */}
                <div className={styles.scoreLevelCard}>
                  <h3>Overall Score & Level</h3>
                  <div className={styles.circularChartArea}>
                    <div className={styles.circularChart}>
                      <div className={styles.circleInner}>
                        <h4 className={styles.goldScore}>612</h4>
                        <span>/ 1000</span>
                      </div>
                    </div>
                    <div className={styles.badgeArea}>
                      <div className={styles.badgeGold}>GOLD ⭐</div>
                      <p>You are 388 points away from Platinum level</p>
                    </div>
                  </div>
                  <button className={styles.secondaryBtn} onClick={() => setActiveMenu('Score & Evaluation')}>View Score Breakdown →</button>
                </div>

                {/* Submission Status */}
                <div className={styles.statusCard}>
                  <h3>Submission Status</h3>
                  <div className={styles.statusTimeline}>
                    <div className={`${styles.statusItem} ${styles.completed}`}>
                      <div className={styles.statusDot}></div>
                      <div className={styles.statusInfo}>
                        <span>Draft Saved</span>
                        <small>12 Mar 2025, 10:30 AM</small>
                      </div>
                    </div>
                    <div className={`${styles.statusItem} ${styles.completed}`}>
                      <div className={styles.statusDot}></div>
                      <div className={styles.statusInfo}>
                        <span>Submitted</span>
                        <small>15 Mar 2025, 04:15 PM</small>
                      </div>
                    </div>
                    <div className={`${styles.statusItem} ${styles.active}`}>
                      <div className={styles.statusDot}></div>
                      <div className={styles.statusInfo}>
                        <span>Under Review</span>
                        <small>20 Mar 2025, 11:20 AM</small>
                        <span className={styles.statusPill}>In Progress</span>
                      </div>
                    </div>
                    <div className={styles.statusItem}>
                      <div className={styles.statusDot}></div>
                      <div className={styles.statusInfo}><span>Verified</span><small>-</small></div>
                    </div>
                    <div className={styles.statusItem}>
                      <div className={styles.statusDot}></div>
                      <div className={styles.statusInfo}><span>Approved</span><small>-</small></div>
                    </div>
                  </div>
                  <button className={styles.primaryBtn} onClick={() => setActiveMenu('Documents Upload')}>View Submission Details</button>
                </div>
              </div>
            </div>

            {/* LOWER SECTION */}
            <div className={styles.lowerGrid}>
              {/* Table Card */}
              <div className={styles.tableCard}>
                <h3>Indicator Wise Progress</h3>
                <div className={styles.tableWrapper}>
                  <table>
                    <thead>
                      <tr>
                        <th>Indicator Category</th>
                        <th>Total</th>
                        <th>Completed</th>
                        <th>Pending</th>
                        <th>Score</th>
                        <th>Progress</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Academic Excellence</td><td>12</td><td>9</td><td>3</td><td>150/200</td>
                        <td>
                          <div className={styles.progressCell}>
                            <div className={styles.progBar}><div style={{ width: '75%', background: '#10b981' }}></div></div>
                            <span>75%</span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>Research & Innovation</td><td>14</td><td>10</td><td>4</td><td>120/200</td>
                        <td>
                          <div className={styles.progressCell}>
                            <div className={styles.progBar}><div style={{ width: '60%', background: '#3b82f6' }}></div></div>
                            <span>60%</span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>NEP Implementation</td><td>18</td><td>13</td><td>5</td><td>160/200</td>
                        <td>
                          <div className={styles.progressCell}>
                            <div className={styles.progBar}><div style={{ width: '80%', background: '#10b981' }}></div></div>
                            <span>80%</span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>Infrastructure & Facilities</td><td>12</td><td>8</td><td>4</td><td>110/200</td>
                        <td>
                          <div className={styles.progressCell}>
                            <div className={styles.progBar}><div style={{ width: '55%', background: '#3b82f6' }}></div></div>
                            <span>55%</span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>Student Support & Progress</td><td>12</td><td>8</td><td>4</td><td>100/200</td>
                        <td>
                          <div className={styles.progressCell}>
                            <div className={styles.progBar}><div style={{ width: '50%', background: '#f59e0b' }}></div></div>
                            <span>50%</span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>Governance & Leadership</td><td>10</td><td>4</td><td>6</td><td>72/200</td>
                        <td>
                          <div className={styles.progressCell}>
                            <div className={styles.progBar}><div style={{ width: '36%', background: '#ef4444' }}></div></div>
                            <span>36%</span>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr>
                        <td>Total</td><td>78</td><td>52</td><td>18</td><td>612/1200</td>
                        <td>
                          <div className={styles.progressCell}>
                            <div className={styles.progBar}><div style={{ width: '66.67%', background: '#2563eb' }}></div></div>
                            <span>66.7%</span>
                          </div>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Right Side Cards */}
              <div className={styles.sideCardsGrid2}>
                {/* Recent Activity */}
                <div className={styles.activityCard}>
                  <h3>Recent Activity</h3>
                  <div className={styles.activityList}>
                    <div className={styles.activityItem}>
                      <div className={styles.activityIcon}>📄</div>
                      <div className={styles.activityInfo}>
                        <p>Document uploaded for <strong>Research Publications</strong></p>
                        <small>20 May 2025, 11:20 AM</small>
                      </div>
                    </div>
                    <div className={styles.activityItem}>
                      <div className={styles.activityIcon}>✏️</div>
                      <div className={styles.activityInfo}>
                        <p>Data updated in <strong>Faculty Information</strong></p>
                        <small>20 May 2025, 10:15 AM</small>
                      </div>
                    </div>
                    <div className={styles.activityItem}>
                      <div className={styles.activityIcon}>📄</div>
                      <div className={styles.activityInfo}>
                        <p>Document uploaded for <strong>NEP Implementation</strong></p>
                        <small>19 May 2025, 04:45 PM</small>
                      </div>
                    </div>
                  </div>
                  <a href="#" className={styles.viewAllLink}>View All Activity →</a>
                </div>

                {/* Upcoming Deadlines */}
                <div className={styles.deadlinesCard}>
                  <h3>Upcoming Deadlines</h3>
                  <div className={styles.deadlineList}>
                    <div className={styles.deadlineItem}>
                      <div className={styles.deadlineIcon}>📅</div>
                      <div className={styles.deadlineInfo}>
                        <p>NEP Data Submission Last Date</p>
                        <small>31 May 2025</small>
                      </div>
                      <span className={`${styles.deadlinePill} ${styles.redPill}`}>11 Days Left</span>
                    </div>
                    <div className={styles.deadlineItem}>
                      <div className={styles.deadlineIcon}>📅</div>
                      <div className={styles.deadlineInfo}>
                        <p>Document Verification Last Date</p>
                        <small>15 June 2025</small>
                      </div>
                      <span className={`${styles.deadlinePill} ${styles.orangePill}`}>26 Days Left</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* ADVANCED ANALYTICS SECTION */}
            <div className={styles.analyticsSection}>
              <h3>Advanced Analytics & AI Insights</h3>
              <div className={styles.analyticsGrid2}>
                {/* AI Insights Card */}
                <div className={styles.aiInsightsCard}>
                  <div className={styles.cardHeader}>
                    <h4>AI Recommendations</h4>
                    <span className={styles.aiBadge}>AI Powered</span>
                  </div>
                  <div className={styles.aiList}>
                    <div className={styles.aiItem}>
                      <div className={styles.aiIcon}>💡</div>
                      <div className={styles.aiContent}>
                        <p><strong>Improve Research Output:</strong> Increasing publications in UGC care list by 15% could boost your overall score by 25 points.</p>
                        <button className={styles.textBtn}>Learn More</button>
                      </div>
                    </div>
                    <div className={styles.aiItem}>
                      <div className={styles.aiIcon}>⚠️</div>
                      <div className={styles.aiContent}>
                        <p><strong>Pending Verification:</strong> 5 documents in Student Support are pending. Complete them to avoid score reduction.</p>
                        <button className={styles.textBtn}>View Docs</button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Heatmap/Peer Comparison Card */}
                <div className={styles.heatmapCard}>
                  <div className={styles.cardHeader}>
                    <h4>Peer Comparison (Percentile)</h4>
                    <span>Top 10% in State</span>
                  </div>
                  <div className={styles.heatmapArea}>
                    {/* Simulated Heatmap Grid */}
                    <div className={styles.heatmapGrid}>
                      <div className={styles.heatmapRow}>
                        <span>Academic</span>
                        <div className={styles.heatBox} style={{ background: '#10b981' }}></div>
                        <div className={styles.heatBox} style={{ background: '#10b981' }}></div>
                        <div className={styles.heatBox} style={{ background: '#34d399' }}></div>
                        <div className={styles.heatBox} style={{ background: '#6ee7b7' }}></div>
                      </div>
                      <div className={styles.heatmapRow}>
                        <span>Research</span>
                        <div className={styles.heatBox} style={{ background: '#3b82f6' }}></div>
                        <div className={styles.heatBox} style={{ background: '#60a5fa' }}></div>
                        <div className={styles.heatBox} style={{ background: '#93c5fd' }}></div>
                        <div className={styles.heatBox} style={{ background: '#bfdbfe' }}></div>
                      </div>
                      <div className={styles.heatmapRow}>
                        <span>NEP Impl.</span>
                        <div className={styles.heatBox} style={{ background: '#10b981' }}></div>
                        <div className={styles.heatBox} style={{ background: '#10b981' }}></div>
                        <div className={styles.heatBox} style={{ background: '#10b981' }}></div>
                        <div className={styles.heatBox} style={{ background: '#34d399' }}></div>
                      </div>
                    </div>
                    <div className={styles.heatmapLegend}>
                      <span>Low</span>
                      <div className={styles.legendGradient}></div>
                      <span>High</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Dynamic Pages */}
        {activeMenu === 'Institution Information' && <InstitutionInfo />}
        {activeMenu === 'Academic Information' && <AcademicInfo />}
        {activeMenu === 'Faculty Information' && <FacultyInfo />}
        {activeMenu === 'Student Statistics' && <StudentStats />}
        {activeMenu === 'NEP Indicators' && <NEPIndicators />}
        {activeMenu === 'Infrastructure Details' && <InfraDetails />}
        {activeMenu === 'Research & Innovation' && <ResearchInnovation />}
        {activeMenu === 'Internship & Placement' && <InternshipPlacement />}
        {activeMenu === 'Documents Upload' && <DocsUpload />}
        {activeMenu === 'Score & Evaluation' && <ScoreEvaluation />}
        {activeMenu === 'My Profile' && <UserProfile />}
        {activeMenu === 'Settings' && <Settings />}

        {/* FOOTER */}
        <footer className={styles.dashboardFooter}>
          <span>© 2025 HSHEC, Government of Haryana. All rights reserved.</span>
          <div className={styles.footerLinks}>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms & Conditions</a>
            <a href="#">Contact Us</a>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Dashboard;
