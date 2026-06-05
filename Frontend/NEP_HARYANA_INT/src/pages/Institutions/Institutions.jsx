import React, { useState, useMemo } from "react";
import { Search, MapPin, Award, Building, Bookmark } from "lucide-react";
import { getColleges } from "../../utils/mockData";
import styles from "./Institutions.module.css";

function Institutions() {
  const colleges = useMemo(() => getColleges() || [], []);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");

  const filteredColleges = useMemo(() => {
    return colleges.filter((college) => {
      const matchesSearch =
        college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        college.aishe.toLowerCase().includes(searchTerm.toLowerCase()) ||
        college.district.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === "All" || college.type === selectedType;
      return matchesSearch && matchesType;
    });
  }, [colleges, searchTerm, selectedType]);

  const collegeTypes = ["All", "Govt", "Aided", "Private"];

  return (
    <main className={styles.pageShell} id="main-content">
      {/* Header Area */}
      <section className={styles.heroSection}>
        <div className={styles.container}>
          <div className={styles.accentLine} aria-hidden="true" />
          <h1 className={styles.pageTitle}>Participating Institutions</h1>
          <p className={styles.pageSubtitle}>
            Browse colleges and universities across Haryana participating in the NEP Excellence Awards evaluation.
          </p>
        </div>
      </section>

      {/* Filter and Search Section */}
      <section className={styles.filterSection}>
        <div className={styles.container}>
          <div className={styles.filterBar}>
            
            {/* Search Input */}
            <div className={styles.searchWrapper}>
              <Search className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search by name, AISHE code, or district..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>

            {/* Type Buttons */}
            <div className={styles.typeFilter}>
              {collegeTypes.map((type) => (
                <button
                  key={type}
                  className={`${styles.filterBtn} ${selectedType === type ? styles.activeFilterBtn : ""}`}
                  onClick={() => setSelectedType(type)}
                >
                  {type === "All" ? "All Types" : `${type} Colleges`}
                </button>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* Grid List Section */}
      <section className={styles.listSection}>
        <div className={styles.container}>
          <div className={styles.resultsCount}>
            Showing {filteredColleges.length} of {colleges.length} institutions
          </div>

          <div className={styles.institutionsGrid}>
            {filteredColleges.map((college) => (
              <div key={college.id} className={styles.collegeCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.iconFrame}>
                    <Building className={styles.buildingIcon} />
                  </div>
                  <div className={styles.typeBadge}>{college.type}</div>
                </div>

                <div className={styles.cardBody}>
                  <h2 className={styles.collegeName}>{college.name}</h2>
                  
                  <div className={styles.metaRow}>
                    <div className={styles.metaItem}>
                      <Bookmark className={styles.metaIcon} />
                      <span>AISHE: {college.aishe}</span>
                    </div>
                    <div className={styles.metaItem}>
                      <MapPin className={styles.metaIcon} />
                      <span>{college.district}, Haryana</span>
                    </div>
                  </div>

                  {college.remarks && (
                    <p className={styles.remarksText}>
                      <strong>Evaluation status:</strong> {college.remarks}
                    </p>
                  )}
                </div>

                <div className={styles.cardFooter}>
                  <div className={`${styles.statusLabel} ${
                    college.status === "Approved"
                      ? styles.statusApproved
                      : college.status === "Pending Review"
                      ? styles.statusPending
                      : styles.statusActionNeeded
                  }`}>
                    {college.status}
                  </div>
                  <span className={styles.viewDetails}>Verification Active</span>
                </div>
              </div>
            ))}

            {filteredColleges.length === 0 && (
              <div className={styles.noResults}>
                <h3>No institutions found</h3>
                <p>Try refining your search terms or selecting a different college type filter.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default Institutions;
