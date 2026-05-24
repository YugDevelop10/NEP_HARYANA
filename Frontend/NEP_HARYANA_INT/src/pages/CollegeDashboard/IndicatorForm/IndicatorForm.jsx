import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getSavedAuthUser } from "../../../api/auth";
import {
  fetchNominationHeaderById,
  fetchIndicatorsByFormId,
  saveIndicators,
  uploadIndicatorFile,
  saveNominationHeaderById
} from "../../../api/nomination";
import styles from "./IndicatorForm.module.css";

const INDICATORS_CONFIG = [
  {
    number: 1,
    title: "Provision for allowing two Academic Programmes pursued Simultaneously",
    maxMarks: 4,
    dataRefLabel: "Relevant document reference",
    docRequired: "Copy of relevant document to support the claim",
    inputType: "yes_no",
  },
  {
    number: 2,
    title: "Internship/Apprenticeship Embedded Degree Programmes",
    maxMarks: 4,
    dataRefLabel: "Name of programme",
    docRequired: "Copy of MOU",
    inputType: "yes_no",
  },
  {
    number: 3,
    title: "Courses offered in Indian Languages (one mark per course)",
    maxMarks: 4,
    dataRefLabel: "Name of Course(s)",
    docRequired: "Copy of relevant document to support the claim",
    inputType: "count_names",
  },
  {
    number: 4,
    title: "Special Programmes in IKS (one mark per course offered)",
    maxMarks: 4,
    dataRefLabel: "Name of Programme(s)",
    docRequired: "Copy of relevant document to support the claim",
    inputType: "count_names",
  },
  {
    number: 5,
    title: "Developed Institutional Development Plan (IDP) as per UGC Guidelines",
    maxMarks: 6,
    dataRefLabel: "Hyperlink of website where uploaded",
    docRequired: "Copy of resolution where it is accepted",
    inputType: "yes_no_url",
  },
  {
    number: 6,
    title: "Appointment of Ombudsperson",
    maxMarks: 2,
    dataRefLabel: "Name of Ombudsperson",
    docRequired: "Copy of notification",
    inputType: "yes_no",
  },
  {
    number: 7,
    title: "Accreditation Status (NAAC) — A++=8, A+=6, A=4, B+=3, B/C=2 marks",
    maxMarks: 8,
    dataRefLabel: "Status (grade) to be given",
    docRequired: "Copy of certificate to be attached",
    inputType: "dropdown_naac",
  },
  {
    number: 8,
    title: "Adoption of National Credit Framework (NCrF)",
    maxMarks: 2,
    dataRefLabel: "Resolution details",
    docRequired: "Copy of resolution where it is accepted",
    inputType: "yes_no",
  },
  {
    number: 9,
    title: "Academic Bank of Credits (ABC) Registered — <25%=2, <50%=4, <75%=6, >75%=8",
    maxMarks: 8,
    dataRefLabel: "% of enrolled students registered",
    docRequired: "Certified copy of evidence to be attached",
    inputType: "dropdown_percentage",
  },
  {
    number: 10,
    title: "Annual Update on AISHE Portal",
    maxMarks: 4,
    dataRefLabel: "AISHE certification details",
    docRequired: "Copy of latest certificate to be attached",
    inputType: "yes_no",
  },
  {
    number: 11,
    title: "Professor of Practice Appointed (2 marks per PoP)",
    maxMarks: 4,
    dataRefLabel: "Name of PoP(s) to be given",
    docRequired: "Copy of contract letter to be attached",
    inputType: "count_names",
  },
  {
    number: 12,
    title: "Incubation/Startup Cell Functional — 1-5=2, 6-10=4, >10=6 marks",
    maxMarks: 6,
    dataRefLabel: "List of startup/companies incubated",
    docRequired: "Copy of Registration to be attached",
    inputType: "dropdown_incubation",
  },
  {
    number: 13,
    title: "National Innovation and Start-up Policy Implemented",
    maxMarks: 4,
    dataRefLabel: "Copy of policy adopting letter",
    docRequired: "Policy adopting letter",
    inputType: "yes_no",
  },
  {
    number: 14,
    title: "Academic/Research Collaboration with Foreign HEIs (one mark per active collaboration)",
    maxMarks: 6,
    dataRefLabel: "List of Foreign HEIs",
    docRequired: "First page of copy of MOU to be attached",
    inputType: "count_names",
  },
  {
    number: 15,
    title: "Alumni Connect Cell Functional (one mark per activity, Jul 2024-Jun 2025)",
    maxMarks: 6,
    dataRefLabel: "List of Activities",
    docRequired: "Evidence for each activity to be attached",
    inputType: "count_list",
  },
  {
    number: 16,
    title: "Gender Parity Initiatives (one mark per activity, Jul 2024-Jun 2025)",
    maxMarks: 6,
    dataRefLabel: "List of Activities",
    docRequired: "Evidence for each activity to be attached",
    inputType: "count_list",
  },
  {
    number: 17,
    title: "Psychological and Emotional Well-Being Programmes (one mark per activity, Jul 2024-Jun 2025)",
    maxMarks: 6,
    dataRefLabel: "List of Activities",
    docRequired: "Evidence for each activity to be attached",
    inputType: "count_list",
  },
  {
    number: 18,
    title: "Implementation of UGC Guidelines on Student Welfare & Fitness (one mark per activity, Jul 2024-Jun 2025)",
    maxMarks: 6,
    dataRefLabel: "List of Activities",
    docRequired: "Evidence for each activity to be attached",
    inputType: "count_list",
  },
  {
    number: 19,
    title: "Provision for Online courses designed by HEIs or adoption of MOOCs policy for students",
    maxMarks: 4,
    dataRefLabel: "Policy document / relevant document reference",
    docRequired: "Policy document to be attached",
    inputType: "yes_no_doc",
  },
  {
    number: 20,
    title: "Number of Teachers trained & certified in NEP orientation workshops under MMTTC — <50%=2, <75%=4, >75%=6",
    maxMarks: 6,
    dataRefLabel: "% of faculty trained (range)",
    docRequired: "Training evidence / certificate to be attached",
    inputType: "dropdown_percentage",
  },
];

function IndicatorForm() {
  const navigate = useNavigate();
  const { formId } = useParams();
  const [indicators, setIndicators] = useState([]);
  const [isNominationSubmitted, setIsNominationSubmitted] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingState, setUploadingState] = useState({}); // Stores loading state for file uploads by indicator number

  useEffect(() => {
    if (!formId) {
      setStatus({
        type: "error",
        message: "Missing Form ID. Please return to the dashboard.",
      });
      setIsLoading(false);
      return;
    }

    let active = true;

    const loadData = async () => {
      try {
        // Load submission status
        const nomination = await fetchNominationHeaderById(formId);
        if (active) {
          setIsNominationSubmitted(nomination.is_submitted || false);
        }

        // Load 20 indicators
        const indicatorsData = await fetchIndicatorsByFormId(formId);
        if (active) {
          // Merge configuration with database values
          const merged = INDICATORS_CONFIG.map((config) => {
            const dbVal = indicatorsData.find(
              (ind) => ind.indicator_number === config.number
            ) || {};
            return {
              ...config,
              status: dbVal.status || false,
              data_ref_value: dbVal.data_ref_value || "",
              document_name: dbVal.document_name || "",
              page_number: dbVal.page_number || "",
              uploaded_file_name: dbVal.uploaded_file_name || "",
              uploaded_file_url: dbVal.uploaded_file_url || "",
            };
          });
          setIndicators(merged);
        }
      } catch (err) {
        if (active) {
          setStatus({
            type: "error",
            message: err.message || "Failed to load indicator details.",
          });
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      active = false;
    };
  }, [formId]);

  const handleStatusChange = (num, val) => {
    setIndicators((prev) =>
      prev.map((ind) =>
        ind.number === num
          ? {
              ...ind,
              status: val,
              // If toggled to No, reset fields
              ...(val === false
                ? {
                    data_ref_value: "",
                    document_name: "",
                    page_number: "",
                  }
                : {}),
            }
          : ind
      )
    );
  };

  const handleFieldChange = (num, fieldName, value) => {
    setIndicators((prev) =>
      prev.map((ind) =>
        ind.number === num ? { ...ind, [fieldName]: value } : ind
      )
    );
  };

  // Handles dynamic compound inputs (e.g. Count + Details)
  const handleCompoundChange = (num, subField, val) => {
    setIndicators((prev) =>
      prev.map((ind) => {
        if (ind.number !== num) return ind;
        let parsed = { count: 0, details: "" };
        try {
          if (ind.data_ref_value.startsWith("{")) {
            parsed = JSON.parse(ind.data_ref_value);
          } else if (ind.data_ref_value) {
            // Fallback parsing for flat strings
            const match = ind.data_ref_value.match(/Count:\s*(\d+);\s*Details:\s*(.*)/);
            if (match) {
              parsed.count = parseInt(match[1], 10);
              parsed.details = match[2];
            }
          }
        } catch (e) {
          // ignore
        }
        parsed[subField] = val;
        const serialized = `Count: ${parsed.count || 0}; Details: ${parsed.details || ""}`;
        return {
          ...ind,
          data_ref_value: serialized,
        };
      })
    );
  };

  const getCompoundValues = (dataRefVal) => {
    let parsed = { count: 0, details: "" };
    if (!dataRefVal) return parsed;
    const match = dataRefVal.match(/Count:\s*(\d+);\s*Details:\s*(.*)/);
    if (match) {
      parsed.count = parseInt(match[1], 10);
      parsed.details = match[2];
    }
    return parsed;
  };

  const handleFileUpload = async (num, event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Maximum file size is 5MB.");
      return;
    }

    setUploadingState((prev) => ({ ...prev, [num]: true }));
    setStatus({ type: "", message: "" });

    try {
      const data = await uploadIndicatorFile(formId, num, file);
      setIndicators((prev) =>
        prev.map((ind) =>
          ind.number === num
            ? {
                ...ind,
                uploaded_file_name: data.uploaded_file_name,
                uploaded_file_url: data.uploaded_file_url,
              }
            : ind
        )
      );
      setStatus({
        type: "success",
        message: `Indicator ${num} evidence document uploaded successfully.`,
      });
    } catch (err) {
      setStatus({
        type: "error",
        message: `Upload failed for Indicator ${num}: ${err.message}`,
      });
    } finally {
      setUploadingState((prev) => ({ ...prev, [num]: false }));
    }
  };

  const handleSaveDraft = async () => {
    setStatus({ type: "", message: "" });
    setIsSubmitting(true);

    try {
      // Map frontend model list back to Backend fields
      const payload = indicators.map((ind) => ({
        indicator_number: ind.number,
        status: ind.status,
        data_ref_value: ind.data_ref_value,
        document_name: ind.document_name,
        page_number: ind.page_number || null,
      }));

      await saveIndicators(formId, payload);
      setStatus({
        type: "success",
        message: "Indicators draft saved successfully.",
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setStatus({
        type: "error",
        message: err.message || "Failed to save draft.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitFinal = async () => {
    setStatus({ type: "", message: "" });

    // Validate that all "Yes" indicators have filled in their details and uploaded a file
    const incomplete = [];
    indicators.forEach((ind) => {
      if (ind.status) {
        if (!ind.data_ref_value.trim()) {
          incomplete.push(`Indicator ${ind.number}: Missing Data/Ref details.`);
        }
        if (!ind.uploaded_file_url) {
          incomplete.push(`Indicator ${ind.number}: Evidence file upload is required.`);
        }
      }
    });

    if (incomplete.length > 0) {
      setStatus({
        type: "error",
        message: `Please complete the following before submitting:\n${incomplete.slice(0, 5).join("\n")}${
          incomplete.length > 5 ? `\n...and ${incomplete.length - 5} more issues.` : ""
        }`,
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (
      !window.confirm(
        "Are you sure you want to final submit? This will LOCK the entire proforma (Section A & B) and you will not be able to edit it again."
      )
    ) {
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Save current state
      const payload = indicators.map((ind) => ({
        indicator_number: ind.number,
        status: ind.status,
        data_ref_value: ind.data_ref_value,
        document_name: ind.document_name,
        page_number: ind.page_number || null,
      }));
      await saveIndicators(formId, payload);

      // 2. Lock the nomination form
      const nominationData = await fetchNominationHeaderById(formId);
      await saveNominationHeaderById(formId, {
        ...nominationData,
        is_submitted: true,
      });

      setIsNominationSubmitted(true);
      setStatus({
        type: "success",
        message: "Entire nomination proforma submitted successfully. Form is now locked.",
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setStatus({
        type: "error",
        message: err.message || "Final submission failed.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToSectionA = () => {
    const savedUser = getSavedAuthUser();
    const nameSlug = String(savedUser?.college_name || "college")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    const codeSlug = String(savedUser?.aishe_code || "code")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    navigate(`/institution/${nameSlug}/${codeSlug}/forms/nomination/${formId}`);
  };

  // Helper to render customized input fields based on indicator input type
  const renderDataRefInput = (ind) => {
    const isLocked = isNominationSubmitted;
    const isRowDisabled = !ind.status || isLocked;

    if (ind.inputType === "yes_no" || ind.inputType === "yes_no_doc") {
      return (
        <input
          type="text"
          value={ind.data_ref_value}
          onChange={(e) => handleFieldChange(ind.number, "data_ref_value", e.target.value)}
          disabled={isRowDisabled}
          placeholder="Enter reference details"
          required={ind.status}
          className={styles.rowInput}
        />
      );
    }

    if (ind.inputType === "yes_no_url") {
      return (
        <input
          type="url"
          value={ind.data_ref_value}
          onChange={(e) => handleFieldChange(ind.number, "data_ref_value", e.target.value)}
          disabled={isRowDisabled}
          placeholder="https://example.com/idp"
          required={ind.status}
          className={styles.rowInput}
        />
      );
    }

    if (ind.inputType === "count_names" || ind.inputType === "count_list") {
      const vals = getCompoundValues(ind.data_ref_value);
      return (
        <div className={styles.compoundInputGroup}>
          <input
            type="number"
            value={vals.count || ""}
            onChange={(e) => handleCompoundChange(ind.number, "count", parseInt(e.target.value, 10) || 0)}
            disabled={isRowDisabled}
            placeholder="Count"
            min="0"
            required={ind.status}
            className={styles.rowInputSmall}
          />
          <input
            type="text"
            value={vals.details || ""}
            onChange={(e) => handleCompoundChange(ind.number, "details", e.target.value)}
            disabled={isRowDisabled}
            placeholder={ind.inputType === "count_names" ? "Names (comma-separated)" : "List of Activities"}
            required={ind.status}
            className={styles.rowInputLarge}
          />
        </div>
      );
    }

    if (ind.inputType === "dropdown_naac") {
      return (
        <select
          value={ind.data_ref_value}
          onChange={(e) => handleFieldChange(ind.number, "data_ref_value", e.target.value)}
          disabled={isRowDisabled}
          required={ind.status}
          className={styles.rowSelect}
        >
          <option value="">Select Grade</option>
          <option value="A++">A++ (8 Marks)</option>
          <option value="A+">A+ (6 Marks)</option>
          <option value="A">A (4 Marks)</option>
          <option value="B++">B++ (3 Marks)</option>
          <option value="B/C">B / C (2 Marks)</option>
          <option value="D">D (0 Marks)</option>
          <option value="not_accredited">Not Accredited (0 Marks)</option>
        </select>
      );
    }

    if (ind.inputType === "dropdown_percentage") {
      return (
        <select
          value={ind.data_ref_value}
          onChange={(e) => handleFieldChange(ind.number, "data_ref_value", e.target.value)}
          disabled={isRowDisabled}
          required={ind.status}
          className={styles.rowSelect}
        >
          <option value="">Select Range</option>
          {ind.number === 9 ? (
            <>
              <option value=">75%">&gt; 75% registered (8 Marks)</option>
              <option value="<75%">&lt; 75% registered (6 Marks)</option>
              <option value="<50%">&lt; 50% registered (4 Marks)</option>
              <option value="<25%">&lt; 25% registered (2 Marks)</option>
            </>
          ) : (
            <>
              <option value=">75%">&gt; 75% trained (6 Marks)</option>
              <option value="<75%">&lt; 75% trained (4 Marks)</option>
              <option value="<50%">&lt; 50% trained (2 Marks)</option>
            </>
          )}
          <option value="None">None (0 Marks)</option>
        </select>
      );
    }

    if (ind.inputType === "dropdown_incubation") {
      return (
        <select
          value={ind.data_ref_value}
          onChange={(e) => handleFieldChange(ind.number, "data_ref_value", e.target.value)}
          disabled={isRowDisabled}
          required={ind.status}
          className={styles.rowSelect}
        >
          <option value="">Select Range</option>
          <option value=">10">&gt; 10 companies (6 Marks)</option>
          <option value="6-10">6 to 10 companies (4 Marks)</option>
          <option value="1-5">1 to 5 companies (2 Marks)</option>
          <option value="None">None (0 Marks)</option>
        </select>
      );
    }

    return null;
  };

  return (
    <main className={styles.pageShell}>
      <div className={styles.pageContainer}>
        {/* Header Area */}
        <div className={styles.pageHeader}>
          <button
            type="button"
            className={styles.backButton}
            onClick={handleBackToSectionA}
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
            Back to Section A
          </button>
          <div className={styles.headerInfo}>
            <span className={styles.badge}>Phase 2 - Section B</span>
            <h3>Per-Indicator Submissions Form</h3>
            <p>
              Complete all 20 indicators. Toggling an indicator to &quot;Yes&quot; activates
              its details row. File uploads (max 5MB, PDF/JPG/PNG) are mandatory for active claims.
            </p>
          </div>
          <div className={styles.formMeta}>
            <span>Nomination UUID</span>
            <strong>{formId}</strong>
          </div>
        </div>

        {/* Lock / Submitted Banner */}
        {isNominationSubmitted && (
          <div className={styles.lockedBanner}>
            <div className={styles.lockedIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <span>This Proforma is final submitted and is locked for editing (Read-Only Mode).</span>
          </div>
        )}

        {/* Status Message */}
        {status.message && (
          <div
            className={`${styles.statusMessage} ${status.type === "success" ? styles.success : styles.error}`}
          >
            <span>{status.message}</span>
          </div>
        )}

        {isLoading ? (
          <div className={styles.loadingSpinnerContainer}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading Indicator Proforma...</p>
          </div>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.proformaTable}>
              <thead>
                <tr>
                  <th style={{ width: "6%" }}>S. No</th>
                  <th style={{ width: "35%" }}>Indicator Details</th>
                  <th style={{ width: "10%" }}>Status</th>
                  <th style={{ width: "20%" }}>Data / Ref Numbers</th>
                  <th style={{ width: "15%" }}>Evidence Name & Page</th>
                  <th style={{ width: "14%" }}>Document Upload</th>
                </tr>
              </thead>
              <tbody>
                {indicators.map((ind) => {
                  const isRowDisabled = !ind.status || isNominationSubmitted;
                  const isUploading = uploadingState[ind.number] || false;

                  return (
                    <tr
                      key={ind.number}
                      className={`${styles.tableRow} ${ind.status ? styles.activeRow : ""} ${isNominationSubmitted ? styles.lockedRow : ""}`}
                    >
                      <td className={styles.serialCol}>{ind.number}</td>
                      <td>
                        <div className={styles.indicatorCell}>
                          <p className={styles.indicatorTitle}>{ind.title}</p>
                          <div className={styles.indicatorMeta}>
                            <span className={styles.marksBadge}>Max Marks: {ind.maxMarks}</span>
                            <span className={styles.docReqBadge} title={ind.docRequired}>
                              Req: {ind.docRequired.substring(0, 45)}...
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className={styles.toggleContainer}>
                          <label className={styles.switch}>
                            <input
                              type="checkbox"
                              checked={ind.status}
                              onChange={(e) => handleStatusChange(ind.number, e.target.checked)}
                              disabled={isNominationSubmitted}
                            />
                            <span className={styles.slider}></span>
                          </label>
                          <span className={styles.toggleLabel}>
                            {ind.status ? "Yes" : "No"}
                          </span>
                        </div>
                      </td>
                      <td>{renderDataRefInput(ind)}</td>
                      <td>
                        <div className={styles.evidenceInputs}>
                          <input
                            type="text"
                            value={ind.document_name}
                            onChange={(e) => handleFieldChange(ind.number, "document_name", e.target.value)}
                            disabled={isRowDisabled}
                            placeholder="Doc Name"
                            className={styles.rowInput}
                          />
                          <input
                            type="number"
                            value={ind.page_number}
                            onChange={(e) => handleFieldChange(ind.number, "page_number", e.target.value)}
                            disabled={isRowDisabled}
                            placeholder="Page #"
                            min="1"
                            className={styles.rowInputSmall}
                          />
                        </div>
                      </td>
                      <td>
                        <div className={styles.uploadCell}>
                          {ind.uploaded_file_url ? (
                            <div className={styles.fileLinkRow}>
                              <a
                                href={ind.uploaded_file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.fileNameLink}
                                title={ind.uploaded_file_name}
                              >
                                {ind.uploaded_file_name.substring(0, 12)}...
                              </a>
                              {!isNominationSubmitted && (
                                <button
                                  type="button"
                                  onClick={() => handleFieldChange(ind.number, "uploaded_file_url", "")}
                                  className={styles.deleteFileBtn}
                                  title="Remove file"
                                >
                                  &times;
                                </button>
                              )}
                            </div>
                          ) : (
                            <div className={styles.uploadBtnWrapper}>
                              <button
                                type="button"
                                className={styles.uploadBtn}
                                disabled={isRowDisabled || isUploading}
                              >
                                {isUploading ? "Uploading..." : "Choose File"}
                              </button>
                              <input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => handleFileUpload(ind.number, e)}
                                disabled={isRowDisabled || isUploading}
                              />
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Bottom Actions Row */}
            <div className={styles.tableActions}>
              {isNominationSubmitted ? (
                <div className={styles.lockedSubmissionState}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Proforma Submission Locked & Verification Pending</span>
                </div>
              ) : (
                <div className={styles.formActionsRow}>
                  <button
                    type="button"
                    className={styles.draftButton}
                    onClick={handleSaveDraft}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Saving..." : "Save Progress (Draft)"}
                  </button>
                  <button
                    type="button"
                    className={styles.submitButton}
                    onClick={handleSubmitFinal}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Final Proforma"}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default IndicatorForm;
