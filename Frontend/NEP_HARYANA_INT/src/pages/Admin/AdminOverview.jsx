import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  School, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  FileCheck
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer 
} from 'recharts';
import { 
  getColleges, 
  calculateTotalScore, 
  getClassification,
  CATEGORIES,
  PARAMETERS
} from '../../utils/mockData';
import { fetchAdminInstitutions } from '../../api/admin';

const AdminOverview = () => {
  const navigate = useNavigate();
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetchAdminInstitutions();
        setColleges(res.institutions || []);
      } catch (err) {
        console.error("Failed to load institutions:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider animate-pulse">Loading Console Data...</p>
      </div>
    );
  }

  // 1. KPI Cards data calculations
  const totalCollegesCount = colleges.length;
  const approvedCount = colleges.filter(c => c.status === 'Approved').length;
  const pendingCount = colleges.filter(c => c.status === 'Pending Review').length;
  const sentBackCount = colleges.filter(c => c.status === 'Sent Back').length;
  const totalSubmissions = colleges.filter(c => c.is_submitted === true || String(c.is_submitted).toLowerCase() === 'true').length;

  const kpis = [
    { 
      title: 'Total Institutions', 
      value: totalCollegesCount, 
      desc: 'Participating Colleges',
      icon: School, 
      color: 'text-blue-600 bg-blue-50 border-blue-100',
      progress: 100
    },
    { 
      title: 'Total Submissions', 
      value: totalSubmissions, 
      desc: 'NEP Self-Appraisal Portals',
      icon: FileCheck, 
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
      progress: totalCollegesCount ? Math.round((totalSubmissions / totalCollegesCount) * 100) : 0
    },
    { 
      title: 'Approved Awards', 
      value: approvedCount, 
      desc: 'Evaluation completed',
      icon: CheckCircle2, 
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
      progress: totalCollegesCount ? Math.round((approvedCount / totalCollegesCount) * 100) : 0
    },
    { 
      title: 'Pending Review', 
      value: pendingCount, 
      desc: 'Awaiting desk audit',
      icon: Clock, 
      color: 'text-amber-600 bg-amber-50 border-amber-100',
      progress: totalCollegesCount ? Math.round((pendingCount / totalCollegesCount) * 100) : 0
    }
  ];

  // 2. Classification Breakdown (Pie Chart)
  const classificationCounts = {
    'Platinum': 0,
    'Gold': 0,
    'Silver': 0,
    'No Award': 0
  };

  colleges.filter(c => c.is_submitted === true || String(c.is_submitted).toLowerCase() === 'true').forEach(c => {
    const award = c.award_category || 'No Award';
    if (classificationCounts[award] !== undefined) {
      classificationCounts[award] += 1;
    } else {
      classificationCounts['No Award'] += 1;
    }
  });

  const pieData = Object.keys(classificationCounts).map(key => ({
    name: key,
    value: classificationCounts[key]
  })).filter(item => item.value > 0);

  const CLASSIFICATION_COLORS = {
    'Platinum': '#7C3AED',  // purple
    'Gold': '#D97706',      // amber
    'Silver': '#6B7280',    // gray
    'No Award': '#EF4444'   // red
  };

  // 3. Top 10 colleges by total score
  const top10Colleges = [...colleges]
    .map(c => {
      const score = c.score || 0;
      return {
        id: c.id,
        fullName: c.name,
        name: c.name.length > 20 ? c.name.substring(0, 20) + '...' : c.name,
        score: score,
        classification: c.award_category || 'No Award'
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  // Recent submitted colleges sorted by updated_at descending
  const submittedCollegesForFeed = colleges
    .filter(c => c.is_submitted === true || String(c.is_submitted).toLowerCase() === 'true')
    .sort((a, b) => new Date(b.updated_at || 0) - new Date(a.updated_at || 0));

  // 4. Category-wise average score across all colleges
  const categoryAverages = Object.keys(CATEGORIES).map(catName => {
    const categoryInfo = CATEGORIES[catName];
    let totalScoreInCat = 0;
    
    colleges.forEach(c => {
      categoryInfo.params.forEach(paramId => {
        totalScoreInCat += c.scores[paramId] || 0;
      });
    });

    const average = totalCollegesCount > 0 ? Number((totalScoreInCat / totalCollegesCount).toFixed(1)) : 0;
    
    return {
      category: catName,
      average: average,
      max: categoryInfo.max
    };
  });

  // Custom tooltips
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3 rounded-lg shadow-md border border-slate-700 text-xs font-semibold max-w-xs">
          <p className="mb-1 text-slate-300 leading-normal">{data.fullName || data.category || data.name}</p>
          <p className="text-sm font-bold text-blue-300">Score: {payload[0].value} {data.max ? `/ ${data.max}` : 'pts'}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#1E3A5F] to-[#1D4ED8] p-6 rounded-2xl shadow-lg text-white flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">NEP Excellence Awards Evaluation Portal</h1>
          <p className="text-blue-100 text-xs mt-1 font-medium max-w-xl">
            Monitor, audit, and compare the Haryana State Higher Education Council self-appraisals under the NEP 2020 parameters.
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-2 text-xs font-bold bg-[#172e4c]/40 border border-blue-400/20 py-2 px-4 rounded-xl">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <span>Evaluation Status: {Math.round((approvedCount / totalCollegesCount) * 100)}% Evaluated</span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.title} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{kpi.title}</p>
                  <p className="text-3xl font-extrabold text-slate-800 mt-2 tracking-tight">{kpi.value}</p>
                </div>
                <div className={`p-3 rounded-xl border ${kpi.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-5">
                <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase mb-1">
                  <span>{kpi.desc}</span>
                  <span>{kpi.progress}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-[#1D4ED8] h-1.5 rounded-full transition-all duration-500" 
                    style={{ width: `${kpi.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Top 10 Scores Bar Chart (takes 2 cols) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800 tracking-tight">Top 10 Performing Institutions</h3>
              <p className="text-xs text-slate-400 font-medium">Ranked by total validated score (out of 100 marks)</p>
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                layout="vertical" 
                data={top10Colleges} 
                margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis 
                  type="number"
                  domain={[0, 100]} 
                  tick={{ fill: '#64748b', fontSize: 10, fontWeight: 500 }}
                />
                <YAxis 
                  type="category"
                  dataKey="name" 
                  tick={{ fill: '#64748b', fontSize: 10, fontWeight: 500 }}
                  width={140}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="score" radius={[0, 6, 6, 0]}>
                  {top10Colleges.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={CLASSIFICATION_COLORS[entry.classification] || '#1D4ED8'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Classification Breakdown Pie Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-800 tracking-tight">Awards Classification</h3>
            <p className="text-xs text-slate-400 font-medium mb-4">Breakdown by current evaluated results</p>
          </div>
          
          <div className="h-48 flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry) => (
                    <Cell key={entry.name} fill={CLASSIFICATION_COLORS[entry.name]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Label */}
            <div className="absolute text-center">
              <span className="block text-2xl font-black text-slate-800 leading-none">{totalSubmissions}</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Submissions</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-slate-100">
            {Object.keys(CLASSIFICATION_COLORS).map(cls => {
              const count = classificationCounts[cls] || 0;
              const pct = totalSubmissions ? Math.round((count / totalSubmissions) * 100) : 0;
              return (
                <div key={cls} className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: CLASSIFICATION_COLORS[cls] }}></span>
                  <div className="min-w-0">
                    <span className="block text-xs font-bold text-slate-700 truncate">{cls}</span>
                    <span className="block text-[10px] text-slate-400 font-medium">{count} ({pct}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Category Wise Averages and Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Category Averages Bar Chart (takes 2 cols) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm lg:col-span-2">
          <div>
            <h3 className="text-lg font-bold text-slate-800 tracking-tight">Category-wise Average Score</h3>
            <p className="text-xs text-slate-400 font-medium mb-6">Grouped metrics comparison across all 15+ evaluated institutions</p>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryAverages} layout="vertical" margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 500 }} />
                <YAxis dataKey="category" type="category" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 500 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="average" fill="#1D4ED8" radius={[0, 4, 4, 0]} maxBarSize={30}>
                  {categoryAverages.map((entry, idx) => (
                    <Cell 
                      key={`cell-${idx}`} 
                      fill={idx === 0 ? '#1D4ED8' : idx === 1 ? '#0F766E' : idx === 2 ? '#D97706' : '#7C3AED'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Submissions Feed */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800 tracking-tight">Submissions Feed</h3>
              <p className="text-xs text-slate-400 font-medium">Recent evaluation activities</p>
            </div>
            <button 
              onClick={() => navigate('/admin/colleges')}
              className="text-xs font-bold text-[#1D4ED8] hover:text-blue-700 flex items-center gap-1 group cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          <div className="flow-root flex-1 overflow-y-auto max-h-72 pr-2">
            <ul className="-mb-8">
              {submittedCollegesForFeed.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs font-bold uppercase tracking-wider animate-pulse">
                  No submissions received yet.
                </div>
              ) : (
                submittedCollegesForFeed.slice(0, 5).map((col, index) => {
                  const totalScore = col.score || 0;
                  const latestHistory = col.history && col.history.length > 0 
                    ? col.history[col.history.length - 1] 
                    : { date: col.updated_at || 'Not Available', status: col.status, user: 'Principal' };

                  return (
                    <li key={col.id}>
                      <div className="relative pb-8">
                        {index !== submittedCollegesForFeed.slice(0, 5).length - 1 ? (
                          <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-100" aria-hidden="true"></span>
                        ) : null}
                        <div className="relative flex space-x-3">
                          <div>
                            <span className={`h-8 w-8 rounded-lg flex items-center justify-center ring-4 ring-white ${
                              col.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
                              col.status === 'Pending Review' ? 'bg-blue-50 text-blue-600 border border-blue-200' :
                              col.status === 'Sent Back' ? 'bg-amber-50 text-amber-600 border border-amber-200' :
                              'bg-red-50 text-red-600 border border-red-200'
                            }`}>
                              <School className="w-4 h-4" />
                            </span>
                          </div>
                          <div className="min-w-0 flex-1 pt-1 flex justify-between space-x-4">
                            <div>
                              <p 
                                onClick={() => navigate(`/admin/colleges/${col.id}`)}
                                className="text-xs font-bold text-slate-700 hover:text-[#1D4ED8] transition-colors cursor-pointer truncate max-w-[140px]"
                                title={col.name}
                              >
                                {col.name}
                              </p>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase ${
                                  col.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                                  col.status === 'Recommended' ? 'bg-indigo-100 text-indigo-800' :
                                  col.status === 'Not Recommended' ? 'bg-rose-100 text-rose-800' :
                                  col.status === 'Pending Review' ? 'bg-blue-100 text-blue-800' :
                                  col.status === 'Sent Back' ? 'bg-amber-100 text-amber-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {col.status === 'Recommended' ? 'Recommended by Committee' :
                                   col.status === 'Not Recommended' ? 'Not Recommended by Committee' :
                                   col.status}
                                </span>
                                <span className="text-[10px] text-slate-400 font-bold">{totalScore} Marks</span>
                              </div>
                            </div>
                            <div className="text-right text-[10px] whitespace-nowrap text-slate-400 font-medium">
                              <time>{latestHistory.date.split(' ')[0]}</time>
                              <span className="block text-[8px] text-slate-400/80 mt-0.5">{latestHistory.user}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        </div>

      </div>

    </div>
  );
};

export default AdminOverview;
