import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getSavedAuthUser } from "../../../api/auth";
import {
  fetchNominationHeaderById,
  saveNominationHeaderById,
} from "../../../api/nomination";
import styles from "./NominationForm.module.css";

const initialState = {
  institution_name: "",
  aishe_code: "",
  head_name: "",
  head_contact: "",
  hei_address: "",
  institution_type: "college",
  establishment_year: "",
  affiliating_university: "",
  nodal_name: "",
  nodal_contact: "",
  nodal_email: "",
  website_url: "",
  institution_email: "",
  institution_phone: "",
  ugc_status: "none",
  accreditation_status: "not_accredited",
  naac_grade: "",
  naac_cgpa: "",
  total_students: "",
  total_faculty: "",
  is_submitted: false,
};

function NominationForm() {
  const navigate = useNavigate();
  const { formId } = useParams();
  const [formData, setFormData] = useState(initialState);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitType, setSubmitType] = useState("draft");

  const isLocked = formData.is_submitted;

  useEffect(() => {
    if (!formId) {
      setStatus({
        type: "error",
        message: "Missing form id. Please open the form from the Forms tab.",
      });
      setIsLoading(false);
      return undefined;
    }

    let active = true;

    const loadForm = async () => {
      try {
        const data = await fetchNominationHeaderById(formId);

        if (!active) {
          return;
        }

        setFormData({
          institution_name: data.institution_name || "",
          aishe_code: data.aishe_code || "",
          head_name: data.head_name || "",
          head_contact: data.head_contact || "",
          hei_address: data.hei_address || "",
          institution_type: data.institution_type || "college",
          establishment_year: data.establishment_year || "",
          affiliating_university: data.affiliating_university || "",
          nodal_name: data.nodal_name || "",
          nodal_contact: data.nodal_contact || "",
          nodal_email: data.nodal_email || "",
          website_url: data.website_url || "",
          institution_email: data.institution_email || "",
          institution_phone: data.institution_phone || "",
          ugc_status: data.ugc_status || "none",
          accreditation_status: data.accreditation_status || "not_accredited",
          naac_grade: data.naac_grade || "",
          naac_cgpa: data.naac_cgpa || "",
          total_students: data.total_students || "",
          total_faculty: data.total_faculty || "",
          is_submitted: data.is_submitted || false,
        });
      } catch (error) {
        if (active) {
          setStatus({
            type: "error",
            message: error.message || "Could not load nomination form.",
          });
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    loadForm();

    return () => {
      active = false;
    };
  }, [formId]);

  useEffect(() => {
    const savedUser = getSavedAuthUser();
    if (!savedUser) {
      return;
    }

    setFormData((current) => ({
      ...current,
      institution_name:
        current.institution_name || savedUser.college_name || "",
      aishe_code: current.aishe_code || savedUser.aishe_code || "",
      head_name: current.head_name || savedUser.full_name || "",
      head_contact: current.head_contact || savedUser.email || "",
      hei_address: current.hei_address || savedUser.address || "",
      website_url: current.website_url || savedUser.website || "",
      nodal_name: current.nodal_name || savedUser.full_name || "",
      nodal_email: current.nodal_email || savedUser.email || "",
    }));
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formId) {
      setStatus({
        type: "error",
        message: "Missing form id. Cannot save the submission.",
      });
      return;
    }

    setStatus({ type: "", message: "" });
    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        is_submitted: submitType === "final",
      };
      const response = await saveNominationHeaderById(formId, payload);
      const saved = response.data || response;
      setFormData({
        institution_name: saved.institution_name || formData.institution_name,
        aishe_code: saved.aishe_code || formData.aishe_code,
        head_name: saved.head_name || formData.head_name,
        head_contact: saved.head_contact || formData.head_contact,
        hei_address: saved.hei_address || formData.hei_address,
        institution_type: saved.institution_type || formData.institution_type,
        establishment_year: saved.establishment_year || formData.establishment_year,
        affiliating_university: saved.affiliating_university || formData.affiliating_university,
        nodal_name: saved.nodal_name || formData.nodal_name,
        nodal_contact: saved.nodal_contact || formData.nodal_contact,
        nodal_email: saved.nodal_email || formData.nodal_email,
        website_url: saved.website_url || formData.website_url,
        institution_email: saved.institution_email || formData.institution_email,
        institution_phone: saved.institution_phone || formData.institution_phone,
        ugc_status: saved.ugc_status || formData.ugc_status,
        accreditation_status: saved.accreditation_status || formData.accreditation_status,
        naac_grade: saved.naac_grade || formData.naac_grade,
        naac_cgpa: saved.naac_cgpa || formData.naac_cgpa,
        total_students: saved.total_students || formData.total_students,
        total_faculty: saved.total_faculty || formData.total_faculty,
        is_submitted: saved.is_submitted || false,
      });
      setStatus({
        type: "success",
        message: submitType === "final"
          ? "Nomination Form successfully submitted and locked."
          : "Nomination Draft saved successfully.",
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Could not save nomination header.",
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToDashboard = () => {
    const savedUser = getSavedAuthUser();
    const nameSlug = String(savedUser?.college_name || "college")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    const codeSlug = String(savedUser?.aishe_code || "code")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    navigate(`/institution/${nameSlug}/${codeSlug}/dashboard`);
  };

  const handleProceedToSectionB = () => {
    const savedUser = getSavedAuthUser();
    const nameSlug = String(savedUser?.college_name || "college")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    const codeSlug = String(savedUser?.aishe_code || "code")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    navigate(`/institution/${nameSlug}/${codeSlug}/forms/indicators/${formId}`);
  };

  return (
    <main className={styles.pageShell}>
      <div className={styles.pageContainer}>
        {/* Header Block */}
        <div className={styles.pageHeader}>
          <button
            type="button"
            className={styles.backButton}
            onClick={handleBackToDashboard}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to dashboard
          </button>
          <div className={styles.headerInfo}>
            <span className={styles.badge}>Phase 2</span>
            <h3>Nomination Form & Indicator Submission</h3>
            <p>
              Section A is the institution header. It is auto-filled from the
              college profile and can be saved as a draft for later indicator
              submission.
            </p>
          </div>
          <div className={styles.formMeta}>
            <span>Form ID</span>
            <strong>{formId || "Pending"}</strong>
          </div>
        </div>

        {isLocked && (
          <div className={styles.lockedBanner}>
            <div className={styles.statusIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <span>This Nomination Form has been final submitted and is locked for editing (Read-Only Mode).</span>
          </div>
        )}

        {status.message && (
          <div
            className={`${styles.statusMessage} ${status.type === "success" ? styles.success : styles.error}`}
          >
            <div className={styles.statusIcon}>
              {status.type === "success" ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
              )}
            </div>
            <span>{status.message}</span>
          </div>
        )}

        {isLoading ? (
          <div className={styles.loadingSpinnerContainer}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading Institution Details...</p>
          </div>
        ) : (
          <form className={styles.nominationForm} onSubmit={handleSubmit}>
            <fieldset disabled={isLocked} style={{ border: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "2rem" }}>
            
            {/* Section 1: Basic Institutional Profile */}
            <section className={styles.formCard}>
              <div className={styles.sectionTitle}>
                <div className={styles.sectionNumber}>1</div>
                <h4>Basic Institutional Profile</h4>
              </div>
              <div className={styles.formGrid}>
                <div className={`${styles.field} ${styles.disabledField}`}>
                  <label htmlFor="institution_name">Institution Name</label>
                  <input
                    id="institution_name"
                    name="institution_name"
                    value={formData.institution_name}
                    readOnly
                  />
                  <span className={styles.helperText}>Managed in college profile</span>
                </div>

                <div className={`${styles.field} ${styles.disabledField}`}>
                  <label htmlFor="aishe_code">AISHE Code</label>
                  <input
                    id="aishe_code"
                    name="aishe_code"
                    value={formData.aishe_code}
                    readOnly
                  />
                  <span className={styles.helperText}>Managed in college profile</span>
                </div>

                <div className={styles.field}>
                  <label htmlFor="institution_type">Institution Type *</label>
                  <select
                    id="institution_type"
                    name="institution_type"
                    value={formData.institution_type}
                    onChange={handleChange}
                    required
                  >
                    <option value="university">University</option>
                    <option value="college">College</option>
                  </select>
                </div>

                <div className={styles.field}>
                  <label htmlFor="establishment_year">Year of Establishment *</label>
                  <input
                    type="number"
                    id="establishment_year"
                    name="establishment_year"
                    value={formData.establishment_year}
                    onChange={handleChange}
                    required
                    min="1800"
                    max={new Date().getFullYear()}
                    placeholder="e.g. 1995"
                  />
                </div>

                {formData.institution_type === "college" && (
                  <div className={`${styles.field} ${styles.fullWidth}`}>
                    <label htmlFor="affiliating_university">Affiliating University *</label>
                    <input
                      id="affiliating_university"
                      name="affiliating_university"
                      value={formData.affiliating_university}
                      onChange={handleChange}
                      required={formData.institution_type === "college"}
                      placeholder="Enter the name of affiliating university"
                    />
                  </div>
                )}
              </div>
            </section>

            {/* Section 2: Contact Details */}
            <section className={styles.formCard}>
              <div className={styles.sectionTitle}>
                <div className={styles.sectionNumber}>2</div>
                <h4>Institutional Contact Details</h4>
              </div>
              <div className={styles.formGrid}>
                <div className={styles.field}>
                  <label htmlFor="head_name">Name of Head of Institute (Principal/Director) *</label>
                  <input
                    id="head_name"
                    name="head_name"
                    value={formData.head_name}
                    onChange={handleChange}
                    required
                    placeholder="Enter full name of the Head"
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="head_contact">Contact of Head (Mobile/Email) *</label>
                  <input
                    id="head_contact"
                    name="head_contact"
                    value={formData.head_contact}
                    onChange={handleChange}
                    required
                    placeholder="Mobile number or Email ID"
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="institution_email">Official Institution Email *</label>
                  <input
                    type="email"
                    id="institution_email"
                    name="institution_email"
                    value={formData.institution_email}
                    onChange={handleChange}
                    required
                    placeholder="e.g. office@college.org"
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="institution_phone">Official Institution Contact Number *</label>
                  <input
                    type="tel"
                    id="institution_phone"
                    name="institution_phone"
                    value={formData.institution_phone}
                    onChange={handleChange}
                    required
                    placeholder="e.g. 01664-242111 or Mobile"
                  />
                </div>

                <div className={`${styles.field} ${styles.fullWidth}`}>
                  <label htmlFor="hei_address">Full Address of HEI *</label>
                  <textarea
                    id="hei_address"
                    name="hei_address"
                    value={formData.hei_address}
                    onChange={handleChange}
                    required
                    rows="3"
                    placeholder="Complete institutional postal address"
                  />
                </div>

                <div className={`${styles.field} ${styles.fullWidth}`}>
                  <label htmlFor="website_url">Official Website URL *</label>
                  <input
                    type="url"
                    id="website_url"
                    name="website_url"
                    value={formData.website_url}
                    onChange={handleChange}
                    required
                    placeholder="e.g. https://www.college.ac.in"
                  />
                </div>
              </div>
            </section>

            {/* Section 3: Nodal Officer Details */}
            <section className={styles.formCard}>
              <div className={styles.sectionTitle}>
                <div className={styles.sectionNumber}>3</div>
                <h4>Nodal Officer Details (For NEP/Portal Queries)</h4>
              </div>
              <div className={styles.formGrid}>
                <div className={styles.field}>
                  <label htmlFor="nodal_name">Nodal Officer Name *</label>
                  <input
                    id="nodal_name"
                    name="nodal_name"
                    value={formData.nodal_name}
                    onChange={handleChange}
                    required
                    placeholder="Enter full name of Nodal Officer"
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="nodal_contact">Nodal Officer Contact Number *</label>
                  <input
                    type="tel"
                    id="nodal_contact"
                    name="nodal_contact"
                    value={formData.nodal_contact}
                    onChange={handleChange}
                    required
                    placeholder="10-digit mobile number"
                  />
                </div>

                <div className={`${styles.field} ${styles.fullWidth}`}>
                  <label htmlFor="nodal_email">Nodal Officer Email Address *</label>
                  <input
                    type="email"
                    id="nodal_email"
                    name="nodal_email"
                    value={formData.nodal_email}
                    onChange={handleChange}
                    required
                    placeholder="e.g. nodal.officer@college.org"
                  />
                </div>
              </div>
            </section>

            {/* Section 4: Regulatory & Accreditation Status */}
            <section className={styles.formCard}>
              <div className={styles.sectionTitle}>
                <div className={styles.sectionNumber}>4</div>
                <h4>Regulatory & Accreditation Status</h4>
              </div>
              <div className={styles.formGrid}>
                <div className={styles.field}>
                  <label htmlFor="ugc_status">UGC Recognition Status *</label>
                  <select
                    id="ugc_status"
                    name="ugc_status"
                    value={formData.ugc_status}
                    onChange={handleChange}
                    required
                  >
                    <option value="none">None / Not Recognized</option>
                    <option value="2f">Recognized under UGC 2(f)</option>
                    <option value="12b">Recognized under UGC 12(B)</option>
                    <option value="both">Recognized under both 2(f) and 12(B)</option>
                  </select>
                </div>

                <div className={styles.field}>
                  <label htmlFor="accreditation_status">NAAC Accreditation Status *</label>
                  <select
                    id="accreditation_status"
                    name="accreditation_status"
                    value={formData.accreditation_status}
                    onChange={handleChange}
                    required
                  >
                    <option value="not_accredited">Not Accredited / Cycle 1 Not Initiated</option>
                    <option value="in_progress">Accreditation First Cycle In Progress</option>
                    <option value="accredited">NAAC Accredited</option>
                  </select>
                </div>

                {formData.accreditation_status === "accredited" && (
                  <>
                    <div className={styles.field}>
                      <label htmlFor="naac_grade">NAAC Grade *</label>
                      <select
                        id="naac_grade"
                        name="naac_grade"
                        value={formData.naac_grade}
                        onChange={handleChange}
                        required={formData.accreditation_status === "accredited"}
                      >
                        <option value="">Select Grade</option>
                        <option value="A++">A++</option>
                        <option value="A+">A+</option>
                        <option value="A">A</option>
                        <option value="B++">B++</option>
                        <option value="B+">B+</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                      </select>
                    </div>

                    <div className={styles.field}>
                      <label htmlFor="naac_cgpa">NAAC CGPA *</label>
                      <input
                        type="number"
                        id="naac_cgpa"
                        name="naac_cgpa"
                        value={formData.naac_cgpa}
                        onChange={handleChange}
                        required={formData.accreditation_status === "accredited"}
                        step="0.01"
                        min="0"
                        max="4.00"
                        placeholder="e.g. 3.52"
                      />
                    </div>
                  </>
                )}
              </div>
            </section>

            {/* Section 5: Student & Faculty Capacity */}
            <section className={styles.formCard}>
              <div className={styles.sectionTitle}>
                <div className={styles.sectionNumber}>5</div>
                <h4>Student & Faculty Capacity (Current Academic Year)</h4>
              </div>
              <div className={styles.formGrid}>
                <div className={styles.field}>
                  <label htmlFor="total_students">Total Student Enrollment *</label>
                  <input
                    type="number"
                    id="total_students"
                    name="total_students"
                    value={formData.total_students}
                    onChange={handleChange}
                    required
                    min="0"
                    placeholder="Total registered students"
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="total_faculty">Total Regular Teaching Faculty *</label>
                  <input
                    type="number"
                    id="total_faculty"
                    name="total_faculty"
                    value={formData.total_faculty}
                    onChange={handleChange}
                    required
                    min="0"
                    placeholder="Total teaching faculty strength"
                  />
                </div>
              </div>
            </section>

            </fieldset>

            {/* Submit Action */}
            <div className={styles.formActions}>
              {isLocked ? (
                <div style={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#166534", fontWeight: "700" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Section A Saved & Locked</span>
                  </div>
                  <button
                    type="button"
                    className={styles.submitButton}
                    onClick={handleProceedToSectionB}
                    style={{ maxWidth: "300px" }}
                  >
                    Proceed to Section B (Indicators)
                  </button>
                </div>
              ) : (
                <div className={styles.submitTypeRow}>
                  <button
                    type="submit"
                    formNoValidate
                    className={styles.draftButton}
                    disabled={isSubmitting}
                    onClick={() => setSubmitType("draft")}
                  >
                    {isSubmitting ? (
                      <>
                        <span className={styles.btnSpinner}></span>
                        Saving Draft...
                      </>
                    ) : (
                      "Save Section A Draft"
                    )}
                  </button>
                  <button
                    type="button"
                    className={styles.submitButton}
                    onClick={handleProceedToSectionB}
                  >
                    Proceed to Section B (Indicators)
                  </button>
                </div>
              )}
            </div>
          </form>
        )}
      </div>
    </main>
  );
}

export default NominationForm;
