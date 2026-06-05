import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  FileText, 
  Eye, 
  Save,
  MessageSquare,
  History,
  Calendar,
  Layers,
  Award
} from 'lucide-react';
import { 
  calculateTotalScore, 
  getClassification, 
  PARAMETERS,
  CATEGORIES 
} from '../../utils/mockData';
import { fetchAdminInstitutions, reviewAdminNomination } from '../../api/admin';

const CollegeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [colleges, setColleges] = useState([]);
  const [college, setCollege] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Tab states
  const [activeTab, setActiveTab] = useState('existing'); // 'existing' or 'new'
  
  // Document view modal states
  const [showDocModal, setShowDocModal] = useState(false);
  const [selectedDocParam, setSelectedDocParam] = useState(null);
  
  // Editing state for scores and remarks
  const [tempScores, setTempScores] = useState({});
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetchAdminInstitutions();
        const list = res.institutions || [];
        setColleges(list);
        const found = list.find(c => String(c.id) === String(id));
        if (found) {
          setCollege(found);
          setTempScores({ ...found.scores });
          setRemarks(found.remarks || '');
        }
      } catch (err) {
        console.error("Failed to load details:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider animate-pulse">Loading College Profile...</p>
      </div>
    );
  }

  if (!college) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <AlertCircle className="w-12 h-12 text-slate-300 animate-bounce" />
        <h2 className="text-lg font-bold text-slate-800">College Profile Not Found</h2>
        <button onClick={() => navigate('/admin/colleges')} className="text-xs font-bold text-[#1D4ED8] hover:underline">
          Back to College List
        </button>
      </div>
    );
  }

  // Calculate scores on the fly for display
  const currentTotalScore = college.score || 0;
  const currentClassification = getClassification(currentTotalScore);

  // Group parameter configurations
  const existingParams = PARAMETERS.filter(p => p.type === 'existing');
  const newParams = PARAMETERS.filter(p => p.type === 'new');

  // Dynamic category calculations based on tempScores
  const categoryScores = Object.keys(CATEGORIES).map(catName => {
    const cat = CATEGORIES[catName];
    const score = cat.params.reduce((sum, pId) => sum + (Number(tempScores[pId]) || 0), 0);
    return {
      name: catName,
      score,
      max: cat.max
    };
  });

  // Handle score change
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

  // View Document Handler
  const handleViewDoc = (param) => {
    setSelectedDocParam(param);
    setShowDocModal(true);
  };

  // Submit Decision Handler
  const handleDecision = async (newStatus) => {
    if (!remarks.trim()) {
      alert("Please enter admin remarks before submitting your decision.");
      return;
    }

    try {
      const res = await reviewAdminNomination(college.college_id, {
        status: newStatus,
        remarks: remarks,
        scores: tempScores
      });
      
      alert(`Institutional Status Updated to: ${newStatus}`);
      if (res.institution) {
        setCollege(res.institution);
        setRemarks(res.institution.remarks || '');
        setTempScores(res.institution.scores || {});
      }
    } catch (err) {
      console.error("Failed to submit review:", err);
      alert(err.message || "Failed to submit review decision.");
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Back button & Title bar */}
      <div className="flex items-center space-x-3">
        <button 
          onClick={() => navigate('/admin/colleges')}
          className="p-2 bg-white rounded-xl border border-slate-200 text-slate-600 hover:text-[#1D4ED8] hover:border-slate-300 hover:bg-slate-50 transition-all cursor-pointer shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Audit Workstation</span>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Institutional Profile Review</h1>
        </div>
      </div>

      {/* College Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 relative overflow-hidden">
        {/* Decorative corner flash */}
        <div 
          className="absolute top-0 right-0 w-24 h-24 rotate-45 translate-x-12 -translate-y-12 opacity-20"
          style={{ backgroundColor: currentClassification.color }}
        ></div>

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                college.type === 'Govt' ? 'bg-sky-50 border-sky-100 text-sky-800' :
                college.type === 'Aided' ? 'bg-orange-50 border-orange-100 text-orange-800' :
                'bg-slate-100 border-slate-200 text-slate-800'
              }`}>
                {college.type} Managed
              </span>
              <span className="text-[10px] bg-slate-100 border border-slate-200 text-slate-500 font-bold px-2 py-0.5 rounded-md">
                District: {college.district}
              </span>
            </div>
            
            <h2 className="text-xl font-extrabold text-slate-800 leading-tight">{college.name}</h2>
            
            <p className="text-xs text-slate-400 font-bold">
              AISHE Code: <span className="font-mono text-slate-600">{college.aishe}</span>
            </p>
          </div>

          <div className="flex items-center space-x-6 shrink-0 bg-slate-50/70 border border-slate-200/60 p-4 rounded-2xl">
            <div className="text-center border-r border-slate-200 pr-6">
              <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Score</span>
              <span className="block text-3xl font-black text-slate-800 mt-1">{currentTotalScore}<span className="text-xs text-slate-400 font-bold">/100</span></span>
            </div>
            <div className="text-center">
              <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Award Grade</span>
              <span 
                className={`text-xs font-black tracking-wide px-3 py-1.5 rounded-full border shadow-sm ${currentClassification.bg}`}
                style={{ borderColor: `${currentClassification.color}33` }}
              >
                {currentClassification.name}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Evaluation Dashboard layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Category Breakdown Progress Bars (takes 1 col) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6 h-fit">
          <div className="flex items-center space-x-2 pb-4 border-b border-slate-100">
            <Layers className="w-5 h-5 text-slate-500" />
            <h3 className="text-base font-bold text-slate-800 tracking-tight">Category Breakdown</h3>
          </div>
          
          <div className="space-y-5">
            {categoryScores.map((cat, idx) => {
              const pct = cat.max ? Math.round((cat.score / cat.max) * 100) : 0;
              const color = idx === 0 ? 'bg-[#1D4ED8]' : idx === 1 ? 'bg-emerald-600' : idx === 2 ? 'bg-amber-600' : 'bg-purple-600';
              const text = idx === 0 ? 'text-[#1D4ED8]' : idx === 1 ? 'text-emerald-700' : idx === 2 ? 'text-amber-700' : 'text-purple-700';
              const bg = idx === 0 ? 'bg-blue-50' : idx === 1 ? 'bg-emerald-50' : idx === 2 ? 'bg-amber-50' : 'bg-purple-50';
              return (
                <div key={cat.name} className={`p-4 rounded-xl border border-slate-100/50 ${bg}`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-slate-700">{cat.name}</span>
                    <span className={`text-xs font-black ${text}`}>{cat.score}/{cat.max}</span>
                  </div>
                  <div className="w-full bg-slate-200/60 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${color}`}
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                  <span className="text-[9px] text-slate-400 font-bold mt-1.5 block">Contribution: {pct}% achieved</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Scoring list (takes 2 cols) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm lg:col-span-2 space-y-6">
          {/* Tab headers */}
          <div className="flex border-b border-slate-100">
            <button
              onClick={() => setActiveTab('existing')}
              className={`pb-4 px-6 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer ${
                activeTab === 'existing' 
                  ? 'border-[#1D4ED8] text-[#1D4ED8]' 
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              Existing Parameters (1-14) <span className="ml-1 text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full">68 pts</span>
            </button>
            <button
              onClick={() => setActiveTab('new')}
              className={`pb-4 px-6 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer ${
                activeTab === 'new' 
                  ? 'border-[#1D4ED8] text-[#1D4ED8]' 
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              Suggested Parameters (15-22) <span className="ml-1 text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full">32 pts</span>
            </button>
          </div>

          {/* Parameters List */}
          <div className="space-y-4">
            {(activeTab === 'existing' ? existingParams : newParams).map((param) => {
              const scoreVal = tempScores[param.id] ?? 0;
              const hasDoc = college.docs && college.docs[param.id];
              return (
                <div key={param.id} className="p-4 bg-slate-50/50 rounded-2xl border border-slate-200/60 hover:bg-slate-50 transition-colors flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-slate-200 text-slate-600">
                        P-{param.num}
                      </span>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-blue-100 text-[#1D4ED8]">
                        {param.category}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-700 leading-snug">{param.name}</p>
                    <div className="flex items-center space-x-3 text-[10px] text-slate-400 font-bold">
                      <span>Submitted value:</span>
                      <span className="text-slate-500 font-semibold">{scoreVal > 0 ? "Compliant & Configured" : "Not Implemented"}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 shrink-0 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                    {/* Document Status */}
                    <div className="flex items-center space-x-1.5">
                      <span className={`text-[10px] font-bold flex items-center gap-1 ${
                        hasDoc ? 'text-emerald-600' : 'text-slate-400'
                      }`}>
                        <FileText className="w-3.5 h-3.5" />
                        <span>{hasDoc ? 'Uploaded' : 'No Doc'}</span>
                      </span>
                      {hasDoc && (
                        <a
                          href={college.docs[param.id]}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 text-slate-400 hover:text-[#1D4ED8] hover:bg-white rounded border border-transparent hover:border-slate-200 cursor-pointer flex items-center justify-center"
                          title="View Proof File"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>

                    {/* Score Editor Input */}
                    <div className="flex items-center space-x-2 bg-white border border-slate-200 rounded-lg p-1.5">
                      <input
                        type="number"
                        min="0"
                        max={param.max}
                        className="w-10 text-center font-bold text-xs text-slate-800 focus:outline-none"
                        value={scoreVal}
                        onChange={(e) => handleScoreChange(param.id, e.target.value, param.max)}
                      />
                      <span className="text-xs text-slate-400 font-bold">/ {param.max}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Review Actions & Timeline Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Remarks and Buttons (takes 2 cols) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm lg:col-span-2 space-y-6">
          <div className="flex items-center space-x-2 pb-4 border-b border-slate-100">
            <MessageSquare className="w-5 h-5 text-slate-500" />
            <h3 className="text-base font-bold text-slate-800 tracking-tight">Review Decision Desk</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Evaluator Remarks & Instructions</label>
              <textarea
                rows="4"
                className="w-full p-4 border border-slate-200 rounded-2xl text-xs font-medium text-slate-700 placeholder-slate-400 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1D4ED8]"
                placeholder="Write specific auditing remarks regarding parameter checks, documents missing, or praises for implementation..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              ></textarea>
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-4 border-t border-slate-100 pt-4">
              <span className="text-[10px] text-slate-400 font-bold leading-normal max-w-xs">
                Saving score reviews or statuses registers live records into the Council's Local Session DB.
              </span>
              
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleDecision('Sent Back')}
                  className="flex items-center gap-1.5 px-4 py-2 border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-bold rounded-xl cursor-pointer transition-colors"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>Send Back</span>
                </button>
                <button
                  onClick={() => handleDecision('Rejected')}
                  className="flex items-center gap-1.5 px-4 py-2 border border-red-300 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-xl cursor-pointer transition-colors"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Reject Appraisal</span>
                </button>
                <button
                  onClick={() => handleDecision('Approved')}
                  className="flex items-center gap-1.5 px-5 py-2.5 bg-[#1D4ED8] hover:bg-blue-700 text-white text-xs font-bold rounded-xl cursor-pointer transition-all shadow-md shadow-blue-500/10"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Approve Award</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline (takes 1 col) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center space-x-2 pb-4 border-b border-slate-100">
            <History className="w-5 h-5 text-slate-500" />
            <h3 className="text-base font-bold text-slate-800 tracking-tight">Audit Trail Timeline</h3>
          </div>

          <div className="flow-root">
            <ul className="-mb-8">
              {(college.history || []).map((hist, index) => (
                <li key={index}>
                  <div className="relative pb-8">
                    {index !== college.history.length - 1 ? (
                      <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-100" aria-hidden="true"></span>
                    ) : null}
                    <div className="relative flex space-x-3">
                      <div>
                        <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-4 ring-white ${
                          hist.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
                          hist.status === 'Recommended' ? 'bg-indigo-50 text-indigo-600 border border-indigo-200' :
                          hist.status === 'Not Recommended' ? 'bg-rose-50 text-rose-600 border border-rose-200' :
                          hist.status === 'Submitted' ? 'bg-indigo-50 text-indigo-600 border border-indigo-200' :
                          hist.status === 'Pending Review' ? 'bg-blue-50 text-blue-600 border border-blue-200' :
                          hist.status === 'Sent Back' ? 'bg-amber-50 text-amber-600 border border-amber-200' :
                          'bg-red-50 text-red-600 border border-red-200'
                        }`}>
                          <Calendar className="w-3.5 h-3.5" />
                        </span>
                      </div>
                      <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <p className="text-xs font-bold text-slate-700">
                            Status: {hist.status === 'Recommended' ? 'Recommended by Committee' :
                                     hist.status === 'Not Recommended' ? 'Not Recommended by Committee' :
                                     hist.status}
                          </p>
                          <span className="text-[10px] text-slate-400 font-bold block mt-0.5">{hist.user}</span>
                        </div>
                        <div className="text-right text-[10px] whitespace-nowrap text-slate-400 font-bold">
                          <span>{hist.date.split(' ')[0]}</span>
                          <span className="block text-[8px] font-medium text-slate-400/80 mt-0.5">{hist.date.split(' ')[1] || ''}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>

      {/* Document Viewer Modal */}
      {showDocModal && selectedDocParam && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-zoomIn">
            <div className="px-6 py-4 bg-[#1E3A5F] text-white flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-blue-300" />
                <span className="text-sm font-bold tracking-tight">Verified Document: P-{selectedDocParam.num}</span>
              </div>
              <button 
                onClick={() => setShowDocModal(false)}
                className="p-1 bg-[#172e4c] hover:bg-slate-700/50 rounded-lg text-white transition-colors cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="border border-slate-100 bg-slate-50/50 p-4 rounded-xl space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Evaluating Parameter</p>
                <p className="text-xs font-bold text-slate-700 leading-snug">{selectedDocParam.name}</p>
              </div>

              {/* Mock PDF document body */}
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-10 flex flex-col items-center justify-center space-y-4 bg-slate-50">
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-full text-blue-600">
                  <Award className="w-12 h-12" />
                </div>
                <div className="text-center space-y-1">
                  <h4 className="text-sm font-black text-slate-800">Haryana State Higher Education Council Verification Proof</h4>
                  <p className="text-xs font-medium text-slate-500">Document Hash Ref: SHA256-4902FJKDLS9320</p>
                  <p className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full inline-block mt-2 border border-emerald-100">
                    Digitally Signed & Validated (AISHE: {college.aishe})
                  </p>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setShowDocModal(false)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl cursor-pointer transition-colors"
              >
                Close Viewer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CollegeDetail;
