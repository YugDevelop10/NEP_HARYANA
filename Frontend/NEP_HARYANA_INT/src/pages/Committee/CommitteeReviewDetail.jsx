import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  FileText, 
  Eye, 
  Save,
  MessageSquare,
  History,
  Calendar,
  Layers,
  Award,
  HelpCircle,
  Plus,
  Trash2
} from 'lucide-react';
import { 
  fetchCommitteeReviewDetail,
  saveCommitteeReview,
  recommendCommitteeReview,
  requestCommitteeClarification
} from '../../api/committee';
import { motion } from 'framer-motion';

// Dynamic config of the 20 indicators
const INDICATORS = [
  { num: 1, title: "Indicator 1 — Two Simultaneous Academic Programmes", max: 4 },
  { num: 2, title: "Indicator 2 — Internship/Apprenticeship Embedded Degree Programmes", max: 4 },
  { num: 3, title: "Indicator 3 — Courses Offered in Indian Languages", max: 4 },
  { num: 4, title: "Indicator 4 — Special Programmes in IKS", max: 4 },
  { num: 5, title: "Indicator 5 — Institutional Development Plan (IDP) Developed", max: 6 },
  { num: 6, title: "Indicator 6 — Appointment of Ombudsperson", max: 2 },
  { num: 7, title: "Indicator 7 — NAAC Accreditation Status", max: 8 },
  { num: 8, title: "Indicator 8 — Adoption of National Credit Framework (NCrF)", max: 2 },
  { num: 9, title: "Indicator 9 — Academic Bank of Credits (ABC) Registered Students", max: 8 },
  { num: 10, title: "Indicator 10 — Annual Update on AISHE Portal", max: 4 },
  { num: 11, title: "Indicator 11 — Professor of Practice Appointed", max: 4 },
  { num: 12, title: "Indicator 12 — Incubation/Startup Cell Functional", max: 6 },
  { num: 13, title: "Indicator 13 — National Innovation and Start-up Policy Implemented", max: 4 },
  { num: 14, title: "Indicator 14 — Academic/Research Collaboration with Foreign HEIs", max: 6 },
  { num: 15, title: "Indicator 15 — Alumni Connect Cell Functional", max: 6 },
  { num: 16, title: "Indicator 16 — Gender Parity Initiatives", max: 6 },
  { num: 17, title: "Indicator 17 — Psychological and Emotional Well-Being Programmes", max: 6 },
  { num: 18, title: "Indicator 18 — UGC Guidelines on Student Welfare & Fitness", max: 6 },
  { num: 19, title: "Indicator 19 — Provision for Online Courses / MOOCs Policy", max: 4 },
  { num: 20, title: "Indicator 20 — Teachers Trained & Certified under MMTTC", max: 6 }
];

const CommitteeReviewDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [nomination, setNomination] = useState(null);
  const [clarifications, setClarifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [recommending, setRecommending] = useState(false);
  const [requestingClar, setRequestingClar] = useState(false);

  // Score states
  const [tempScores, setTempScores] = useState({});
  const [remarks, setRemarks] = useState('');

  // Clarification form states
  const [clarQuery, setClarQuery] = useState('');
  const [selectedFields, setSelectedFields] = useState([]);
  const [showClarForm, setShowClarForm] = useState(false);

  const loadData = async () => {
    try {
      const res = await fetchCommitteeReviewDetail(id);
      setNomination(res.nomination);
      setClarifications(res.clarifications || []);
      setRemarks(res.nomination.remarks || '');
      
      // Load initial scores
      const initialScores = {};
      INDICATORS.forEach(ind => {
        const key = `indicator_${ind.num}`;
        initialScores[key] = res.nomination.reviewer_scores?.[key] || 0;
      });
      setTempScores(initialScores);
    } catch (err) {
      console.error("Failed to load review details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleScoreChange = (paramId, val, maxVal) => {
    let num = Number(val);
    if (isNaN(num)) num = 0;
    if (num < 0) num = 0;
    if (num > maxVal) num = maxVal;
    
    setTempScores(prev => ({
      ...prev,
      [paramId]: num
    }));
  };

  const handleSaveReview = async () => {
    setSaving(true);
    try {
      await saveCommitteeReview(id, {
        remarks,
        reviewer_scores: tempScores
      });
      alert("Review progress saved successfully.");
      loadData();
    } catch (err) {
      alert("Failed to save review. " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleRecommendation = async (recommendationType) => {
    if (!remarks.trim()) {
      alert("Please enter remarks before submitting your recommendation.");
      return;
    }
    setRecommending(true);
    try {
      await recommendCommitteeReview(id, {
        recommendation: recommendationType,
        remarks
      });
      alert(`Recommendation '${recommendationType}' submitted successfully.`);
      navigate('/committee/submissions');
    } catch (err) {
      alert("Failed to submit recommendation. " + err.message);
    } finally {
      setRecommending(false);
    }
  };

  const handleSendClarification = async (e) => {
    e.preventDefault();
    if (!clarQuery.trim()) {
      alert("Please enter a query message.");
      return;
    }
    if (selectedFields.length === 0) {
      alert("Please select at least one field/indicator allowed for editing.");
      return;
    }
    setRequestingClar(true);
    try {
      await requestCommitteeClarification(id, {
        query: clarQuery,
        fields_to_edit: selectedFields
      });
      alert("Clarification request sent successfully to the college.");
      setClarQuery('');
      setSelectedFields([]);
      setShowClarForm(false);
      loadData();
    } catch (err) {
      alert("Failed to send clarification request. " + err.message);
    } finally {
      setRequestingClar(false);
    }
  };

  const toggleFieldSelection = (fieldKey) => {
    setSelectedFields(prev => 
      prev.includes(fieldKey) 
        ? prev.filter(f => f !== fieldKey)
        : [...prev, fieldKey]
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-orange-500 rounded-full animate-spin" />
        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider animate-pulse">Loading Submission review...</p>
      </div>
    );
  }

  const calculateSystemScoreForIndicator = (num, data) => {
    if (!data || !data.value) return 0;
    
    switch (num) {
      case 1:
        return data.value === "Yes" ? 4 : 0;
      case 2:
        return data.value === "Yes" ? 4 : 0;
      case 3:
        return data.value === "Yes" ? Math.min(data.items?.length || 0, 4) : 0;
      case 4:
        return data.value === "Yes" ? Math.min(data.items?.length || 0, 4) : 0;
      case 5:
        return data.value === "Yes" ? 6 : 0;
      case 6:
        return data.value === "Yes" ? 2 : 0;
      case 7:
        if (data.value === "A++") return 8;
        if (data.value === "A+") return 6;
        if (data.value === "A") return 4;
        if (data.value === "B+") return 3;
        if (data.value === "B" || data.value === "C") return 2;
        return 0;
      case 8:
        return data.value === "Yes" ? 2 : 0;
      case 9:
        if (data.value === "Yes") {
          const pct = parseFloat(data.percentage || 0);
          if (pct > 75) return 8;
          if (pct > 50) return 6;
          if (pct > 25) return 4;
          if (pct > 0) return 2;
        }
        return 0;
      case 10:
        return data.value === "Yes" ? 4 : 0;
      case 11:
        return data.value === "Yes" ? Math.min((data.items?.length || 0) * 2, 4) : 0;
      case 12:
        if (data.value === "Yes") {
          const count = parseInt(data.count || 0, 10);
          if (count > 10) return 6;
          if (count >= 6) return 4;
          if (count >= 1) return 2;
        }
        return 0;
      case 13:
        return data.value === "Yes" ? 4 : 0;
      case 14:
        return data.value === "Yes" ? Math.min(data.items?.length || 0, 6) : 0;
      case 15:
        return data.value === "Yes" ? Math.min(data.items?.length || 0, 6) : 0;
      case 16:
        return data.value === "Yes" ? Math.min(data.items?.length || 0, 6) : 0;
      case 17:
        return data.value === "Yes" ? Math.min(data.items?.length || 0, 6) : 0;
      case 18:
        return data.value === "Yes" ? Math.min(data.items?.length || 0, 6) : 0;
      case 19:
        return data.value === "Yes" ? 4 : 0;
      case 20:
        const pct20 = parseFloat(data.percentage || 0);
        if (pct20 > 75) return 6;
        if (pct20 > 50) return 4;
        if (pct20 > 0) return 2;
        return 0;
      default:
        return 0;
    }
  };

  const liveTotalScore = Object.values(tempScores).reduce((sum, v) => sum + v, 0);

  return (
    <div className="space-y-8">
      {/* Header bar */}
      <div className="flex items-center space-x-3">
        <button 
          onClick={() => navigate('/committee/submissions')}
          className="p-2 bg-white rounded-xl border border-slate-200 text-slate-600 hover:text-orange-500 hover:border-slate-300 hover:bg-slate-50 transition-all cursor-pointer shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Review Desk</span>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Evaluate College Submission</h1>
        </div>
      </div>

      {/* College Info Header Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="text-[10px] bg-slate-100 border border-slate-200 text-slate-500 font-bold px-2 py-0.5 rounded-md">
              AISHE Code: <span className="font-mono text-slate-600">{nomination?.aishe_code}</span>
            </span>
            <h2 className="text-xl font-extrabold text-slate-800 leading-tight">{nomination?.college_name}</h2>
            <p className="text-xs text-slate-400 font-medium">
              Submitted by: <span className="text-slate-600 font-semibold">{nomination?.head_name} ({nomination?.head_contact})</span>
            </p>
            <p className="text-xs text-slate-400">
              Address: <span className="text-slate-600">{nomination?.address}</span>
            </p>
          </div>

          <div className="flex items-center space-x-6 shrink-0 bg-slate-50/70 border border-slate-200/60 p-4 rounded-2xl">
            <div className="text-center border-r border-slate-200 pr-6">
              <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Self Score</span>
              <span className="block text-3xl font-black text-slate-800 mt-1">{nomination?.score}<span className="text-xs text-slate-400 font-bold">/100</span></span>
            </div>
            <div className="text-center">
              <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Award Grade</span>
              <span className="text-xs font-black tracking-wide px-3 py-1.5 rounded-full border shadow-sm bg-orange-100 text-orange-800 border-orange-200">
                {nomination?.award_category}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Review body */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Indicators List (takes 2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 text-base border-b border-slate-100 pb-3 flex items-center gap-2">
              <Layers className="w-5 h-5 text-orange-500" />
              Indicator Breakdown & Evidence Verification
            </h3>

            <div className="space-y-6">
              {INDICATORS.map((ind) => {
                const key = `indicator_${ind.num}`;
                const data = nomination?.answers?.[key] || {};
                const scoreVal = tempScores[key] ?? 0;
                
                return (
                  <div key={ind.num} className="p-4 bg-slate-50/50 rounded-2xl border border-slate-200/60 hover:bg-slate-50 transition-colors space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-slate-200 text-slate-600">
                            P-{ind.num}
                          </span>
                          <span className="text-xs font-bold text-slate-700">{ind.title}</span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-slate-400">Max: {ind.max} Marks</span>
                    </div>

                    {/* Answer details */}
                    <div className="bg-white p-3.5 rounded-xl border border-slate-100 text-xs space-y-2">
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <span className="font-semibold text-slate-400 block">Submitted Value:</span>
                          <span className="font-bold text-slate-800">{data.value || "N/A"}</span>
                        </div>
                        {data.note && (
                          <div className="col-span-2">
                            <span className="font-semibold text-slate-400 block">Details/Notes:</span>
                            <span className="font-medium text-slate-700">{data.note}</span>
                          </div>
                        )}
                        {data.url && (
                          <div className="col-span-2">
                            <span className="font-semibold text-slate-400 block">Web URL Link:</span>
                            <a href={data.url} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 underline truncate block">{data.url}</a>
                          </div>
                        )}
                        {data.percentage && (
                          <div>
                            <span className="font-semibold text-slate-400 block">Percentage/Count:</span>
                            <span className="font-bold text-slate-800">{data.percentage}%</span>
                          </div>
                        )}
                        {data.count && (
                          <div>
                            <span className="font-semibold text-slate-400 block">Incubated Count:</span>
                            <span className="font-bold text-slate-800">{data.count}</span>
                          </div>
                        )}
                      </div>

                      {/* Display items list if applicable */}
                      {data.items && data.items.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-slate-100">
                          <span className="font-semibold text-slate-400 block mb-1">List Entries:</span>
                          <ul className="list-disc list-inside space-y-0.5 font-medium text-slate-700">
                            {data.items.map((item, idx) => <li key={idx}>{item}</li>)}
                          </ul>
                        </div>
                      )}

                      {/* Evidence Files */}
                      {data.evidence_url && (
                        <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                          <span className="inline-flex items-center gap-1.5 text-slate-500 font-medium">
                            <FileText className="w-3.5 h-3.5 text-orange-400" />
                            Evidence: <span className="font-semibold text-slate-700 truncate max-w-xs">{data.evidence_name || "evidence_doc"}</span>
                          </span>
                          <a
                            href={data.evidence_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-orange-50 border border-orange-100 text-orange-600 font-bold hover:bg-orange-100 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            View Proof
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Evaluated Score editor */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100/80">
                      <div className="text-xs text-slate-500 font-medium">
                        Claimed Score: <span className="font-extrabold text-orange-600 bg-orange-50 border border-orange-100 px-2 py-0.5 rounded-full">{calculateSystemScoreForIndicator(ind.num, data)} / {ind.max}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-500">Verified Score:</span>
                        <div className="flex items-center space-x-2 bg-white border border-slate-200 rounded-lg p-1.5 shadow-sm">
                          <input
                            type="number"
                            min="0"
                            max={ind.max}
                            className="w-10 text-center font-bold text-xs text-slate-800 focus:outline-none"
                            value={scoreVal}
                            onChange={(e) => handleScoreChange(key, e.target.value, ind.max)}
                          />
                          <span className="text-xs text-slate-400 font-bold">/ {ind.max}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar Decision, History, Clarification requests (takes 1 col) */}
        <div className="space-y-6">
          {/* Decision Desk */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 text-base border-b border-slate-100 pb-3 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-orange-500" />
              Review Actions
            </h3>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Remarks & observations</label>
              <textarea
                rows="4"
                className="w-full p-3 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 placeholder-slate-400 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                placeholder="Write observations..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />

              <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                <span className="text-xs font-bold text-slate-500">Calculated Score:</span>
                <span className="text-lg font-black text-slate-800">{liveTotalScore}/100</span>
              </div>

              <div className="space-y-2.5 pt-2">
                <button
                  onClick={handleSaveReview}
                  disabled={saving}
                  className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl cursor-pointer transition-all shadow-sm disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  Save Remarks & Scores
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleRecommendation("Sent Back")}
                    disabled={recommending}
                    className="flex items-center justify-center gap-1 px-3 py-2 border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-bold rounded-xl cursor-pointer transition-colors"
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    Send Back
                  </button>
                  <button
                    onClick={() => handleRecommendation("Rejected")}
                    disabled={recommending}
                    className="flex items-center justify-center gap-1 px-3 py-2 border border-red-300 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-xl cursor-pointer transition-colors"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Reject
                  </button>
                </div>

                <button
                  onClick={() => handleRecommendation("Approved")}
                  disabled={recommending}
                  className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl cursor-pointer transition-all shadow-md shadow-orange-500/10"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Approve Application
                </button>
              </div>
            </div>
          </div>

          {/* Clarification Panel */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-orange-500" />
                Clarifications
              </h3>
              {!showClarForm && (
                <button
                  onClick={() => setShowClarForm(true)}
                  className="p-1 border border-slate-200 hover:border-orange-500 text-slate-500 hover:text-orange-500 rounded-lg bg-white transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              )}
            </div>

            {showClarForm && (
              <form onSubmit={handleSendClarification} className="space-y-3 animate-fadeIn">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Query Question</label>
                  <textarea
                    rows="3"
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 placeholder-slate-400 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    placeholder="Describe what college needs to clarify..."
                    value={clarQuery}
                    onChange={(e) => setClarQuery(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Select Fields for Edit</label>
                  <div className="max-h-36 overflow-y-auto border border-slate-200 rounded-lg p-2 space-y-1.5 text-xs bg-slate-50/55">
                    {INDICATORS.map(ind => {
                      const fieldKey = `indicator_${ind.num}`;
                      const isSelected = selectedFields.includes(fieldKey);
                      return (
                        <label key={ind.num} className="flex items-center gap-2 p-1 hover:bg-slate-100 rounded cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleFieldSelection(fieldKey)}
                          />
                          <span>Ind {ind.num}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowClarForm(false)}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={requestingClar}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-lg cursor-pointer"
                  >
                    Send Query
                  </button>
                </div>
              </form>
            )}

            {/* List of past clarifications */}
            <div className="space-y-4">
              {clarifications.length > 0 ? (
                clarifications.map((clar, idx) => (
                  <div key={clar.id} className="p-3 bg-slate-50/60 border border-slate-200/80 rounded-xl space-y-2 text-xs">
                    <div className="flex justify-between items-start">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        clar.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                      }`}>
                        {clar.status}
                      </span>
                      <span className="text-[9px] font-bold text-slate-400">
                        {new Date(clar.created_at).toLocaleDateString('en-IN')}
                      </span>
                    </div>

                    <div>
                      <span className="font-bold text-slate-500 block">Query:</span>
                      <p className="font-medium text-slate-700 mt-0.5">{clar.query}</p>
                    </div>

                    {clar.fields_to_edit && (
                      <div>
                        <span className="font-bold text-slate-400 block">Opened Fields:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {clar.fields_to_edit.map(f => (
                            <span key={f} className="text-[9px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded">
                              {f.replace('indicator_', 'Ind ')}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {clar.response ? (
                      <div className="pt-2 border-t border-slate-200">
                        <span className="font-bold text-emerald-600 block">College Response:</span>
                        <p className="font-medium text-slate-600 mt-0.5">{clar.response}</p>
                      </div>
                    ) : (
                      <p className="text-[10px] text-slate-400 font-semibold italic">Awaiting response...</p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic">No clarifications requested yet.</p>
              )}
            </div>
          </div>

          {/* Audit trail */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 text-base border-b border-slate-100 pb-3 flex items-center gap-2">
              <History className="w-5 h-5 text-orange-500" />
              Evaluation History
            </h3>

            <div className="flow-root">
              <ul className="-mb-8">
                {(nomination?.history || []).map((hist, index) => (
                  <li key={index}>
                    <div className="relative pb-6">
                      {index !== nomination.history.length - 1 ? (
                        <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-100" />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <span className="h-8 w-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        </span>
                        <div className="min-w-0 flex-1 pt-1.5">
                          <p className="text-xs font-bold text-slate-700">{hist.status}</p>
                          <span className="text-[10px] text-slate-400 font-semibold block">{hist.user} • {hist.date}</span>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CommitteeReviewDetail;
