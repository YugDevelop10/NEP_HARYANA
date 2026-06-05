import React, { useState, useMemo } from "react";
import { Bell, Calendar, MapPin, Search, Megaphone, FileText, ChevronRight } from "lucide-react";
import styles from "./Notifications.module.css";

const noticesData = [
  { id: 1, dateNum: '22', dateMon: 'APR', tag: 'AWARD', text: 'Submission window opens for NEP 2020 Implementation Excellence Award 2026', category: 'Notice' },
  { id: 2, dateNum: '18', dateMon: 'APR', tag: 'NOTICE', text: 'Revised guidelines for Model Sanskriti College evaluation released', category: 'Notice' },
  { id: 3, dateNum: '12', dateMon: 'APR', tag: 'EVENT', text: 'Workshop on Academic Bank of Credits — register before 30 April', category: 'Event' },
  { id: 4, dateNum: '05', dateMon: 'APR', tag: 'REPORT', text: 'Annual report 2024–25 published — view on Publications page', category: 'Notice' },
  { id: 5, dateNum: '28', dateMon: 'MAR', tag: 'TENDER', text: 'Tender for digital evaluation platform — last date 15 May', category: 'Tender' },
  { id: 6, dateNum: '15', dateMon: 'MAR', tag: 'GUIDELINE', text: 'Notification regarding mandatory registration of HEIs on AISHE portal', category: 'Notice' },
  { id: 7, dateNum: '01', dateMon: 'MAR', tag: 'CIRCULAR', text: 'Implementation of multiple entry-exit options across general degree programs', category: 'Notice' }
];

const eventsData = [
  { id: 1, dateNum: '05', dateMon: 'MAY', name: 'NEP Stakeholder Consultation', location: 'Panchkula', time: '10:00 AM' },
  { id: 2, dateNum: '18', dateMon: 'MAY', name: 'Workshop: Outcome-Based Education', location: 'Online', time: '02:00 PM' },
  { id: 3, dateNum: '02', dateMon: 'JUN', name: 'Vice-Chancellors\' Conclave 2026', location: 'Gurugram', time: '11:00 AM' },
  { id: 4, dateNum: '15', dateMon: 'JUN', name: 'Capacity Building Programme for Principals', location: 'Kurukshetra University', time: '09:30 AM' }
];

function Notifications() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  const filteredNotices = useMemo(() => {
    return noticesData.filter((item) => {
      const matchesSearch = item.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.tag.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTab = activeTab === "All" || activeTab === "Notices";
      return matchesSearch && matchesTab;
    });
  }, [searchTerm, activeTab]);

  const filteredEvents = useMemo(() => {
    return eventsData.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTab = activeTab === "All" || activeTab === "Events";
      return matchesSearch && matchesTab;
    });
  }, [searchTerm, activeTab]);

  return (
    <main className={styles.pageShell} id="main-content">
      {/* Header Area */}
      <section className={styles.heroSection}>
        <div className={styles.container}>
          <div className={styles.accentLine} aria-hidden="true" />
          <h1 className={styles.pageTitle}>Notifications & Announcements</h1>
          <p className={styles.pageSubtitle}>
            Stay updated with the latest circulars, notices, press releases, and upcoming events from HSHEC.
          </p>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className={styles.filterSection}>
        <div className={styles.container}>
          <div className={styles.filterBar}>
            
            {/* Search */}
            <div className={styles.searchWrapper}>
              <Search className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search notices, circulars, or events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>

            {/* Tabs */}
            <div className={styles.tabButtons}>
              {["All", "Notices", "Events"].map((tab) => (
                <button
                  key={tab}
                  className={`${styles.tabBtn} ${activeTab === tab ? styles.activeTabBtn : ""}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* Content Columns */}
      <section className={styles.contentSection}>
        <div className={styles.container}>
          <div className={styles.columnsGrid}>
            
            {/* Left Column — Notices & Circulars */}
            {(activeTab === "All" || activeTab === "Notices") && (
              <div className={styles.columnBlock}>
                <div className={styles.columnHeader}>
                  <Megaphone className={styles.columnIcon} />
                  <h2 className={styles.columnHeading}>Notices & Circulars</h2>
                </div>

                <div className={styles.noticeList}>
                  {filteredNotices.map((notice) => (
                    <div key={notice.id} className={styles.noticeRow}>
                      <div className={styles.dateBadge}>
                        <span className={styles.dateDay}>{notice.dateNum}</span>
                        <span className={styles.dateMonth}>{notice.dateMon}</span>
                      </div>
                      <div className={styles.noticeContent}>
                        <span className={styles.noticeTag}>{notice.tag}</span>
                        <p className={styles.noticeText}>{notice.text}</p>
                      </div>
                      <div className={styles.noticeChevron} aria-hidden="true">
                        <ChevronRight className="w-5 h-5" />
                      </div>
                    </div>
                  ))}

                  {filteredNotices.length === 0 && (
                    <p className={styles.noData}>No matching notices found.</p>
                  )}
                </div>
              </div>
            )}

            {/* Right Column — Upcoming Events */}
            {(activeTab === "All" || activeTab === "Events") && (
              <div className={styles.columnBlock}>
                <div className={styles.columnHeader}>
                  <Calendar className={styles.columnIcon} />
                  <h2 className={styles.columnHeading}>Upcoming Events</h2>
                </div>

                <div className={styles.eventsList}>
                  {filteredEvents.map((event) => (
                    <div key={event.id} className={styles.eventCard}>
                      <div className={styles.eventBadge}>
                        <span className={styles.dateDay}>{event.dateNum}</span>
                        <span className={styles.dateMonth}>{event.dateMon}</span>
                      </div>
                      <div className={styles.eventContent}>
                        <h3 className={styles.eventName}>{event.name}</h3>
                        <div className={styles.eventMeta}>
                          <div className={styles.metaItem}>
                            <MapPin className="w-4 h-4 shrink-0 text-slate-400" />
                            <span>{event.location}</span>
                          </div>
                          <span className={styles.metaDivider}>•</span>
                          <span className={styles.eventTime}>{event.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {filteredEvents.length === 0 && (
                    <p className={styles.noData}>No matching events found.</p>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      </section>
    </main>
  );
}

export default Notifications;
