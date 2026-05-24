import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { openNominationHeaderForm } from "../../../api/nomination";
import { getSavedAuthUser } from "../../../api/auth";
import styles from "./FormsHub.module.css";

const FORM_CARDS = [
  {
    id: "nomination",
    title: "Section A: Institutional Nomination Header",
    subtitle: "Phase 2 core form for institution profile and details.",
    status: "Active",
    action: "Open form",
    accent: "primary",
    routeLabel: "/college/forms/nomination/:formId",
  },
  {
    id: "indicators",
    title: "Section B: Per-Indicator Submissions Form",
    subtitle: "Phase 2 proforma table for 20 indicators and file uploads.",
    status: "Active",
    action: "Open form",
    accent: "primary",
    routeLabel: "/college/forms/indicators/:formId",
  },
  {
    id: "faculty-declaration",
    title: "Faculty Declaration Form",
    subtitle: "Declaration and verification of faculty records.",
    status: "Coming soon",
    action: "Preview",
    accent: "muted",
  },
];

function FormsHub() {
  const navigate = useNavigate();
  const [loadingFormId, setLoadingFormId] = useState("");
  const [error, setError] = useState("");

  const handleOpenNomination = async () => {
    setError("");
    setLoadingFormId("nomination");

    try {
      const response = await openNominationHeaderForm();
      const formId = response?.id;

      if (!formId) {
        throw new Error("Could not open nomination form.");
      }

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
    } catch (requestError) {
      setError(requestError.message || "Could not open nomination form.");
    } finally {
      setLoadingFormId("");
    }
  };

  const handleOpenIndicators = async () => {
    setError("");
    setLoadingFormId("indicators");

    try {
      const response = await openNominationHeaderForm();
      const formId = response?.id;

      if (!formId) {
        throw new Error("Could not open indicators form.");
      }

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
    } catch (requestError) {
      setError(requestError.message || "Could not open indicators form.");
    } finally {
      setLoadingFormId("");
    }
  };

  return (
    <section className={styles.formsSection}>
      <div className={styles.sectionHeader}>
        <div>
          <span className={styles.sectionTag}>Forms</span>
          <h3>Institution Forms Library</h3>
          <p>
            The forms tab will hold multiple structured submissions. Open a card
            to begin a form and track it with a backend-issued identifier.
          </p>
        </div>
        <div className={styles.sectionStats}>
          <div>
            <strong>3</strong>
            <span>Available forms</span>
          </div>
          <div>
            <strong>2</strong>
            <span>Live today</span>
          </div>
        </div>
      </div>

      {error && <div className={styles.errorBanner}>{error}</div>}

      <div className={styles.cardGrid}>
        {FORM_CARDS.map((card) => {
          const isActive = card.id === "nomination" || card.id === "indicators";
          const isLoading = loadingFormId === card.id;

          return (
            <article
              key={card.id}
              className={`${styles.formCard} ${styles[card.accent]}`}
            >
              <div className={styles.cardTopRow}>
                <span className={styles.cardStatus}>{card.status}</span>
                {isActive && (
                  <span className={styles.cardRoute}>{card.routeLabel}</span>
                )}
              </div>
              <h4>{card.title}</h4>
              <p>{card.subtitle}</p>
              <div className={styles.cardBottomRow}>
                <button
                  type="button"
                  className={styles.cardButton}
                  onClick={
                    card.id === "nomination"
                      ? handleOpenNomination
                      : card.id === "indicators"
                      ? handleOpenIndicators
                      : undefined
                  }
                  disabled={!isActive || isLoading}
                >
                  {isLoading ? "Opening..." : card.action}
                </button>
                <span className={styles.cardHint}>
                  {isActive
                    ? "Backed by saved form id"
                    : "Planned for next phase"}
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default FormsHub;
