import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ClipboardList, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  Activity, 
  ArrowRight,
  School
} from 'lucide-react';
import { fetchCommitteeStats } from '../../api/committee';
import { motion } from 'framer-motion';

const CommitteeOverview = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await fetchCommitteeStats();
        setStats(data);
      } catch (err) {
        console.error("Error loading committee stats:", err);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="h-32 bg-white rounded-2xl border border-slate-100 p-6 animate-pulse" />
          ))}
        </div>
        <div className="h-96 bg-white rounded-2xl border border-slate-100 p-6 animate-pulse" />
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Assigned Submissions",
      value: stats?.total_assigned || 0,
      icon: ClipboardList,
      color: "text-blue-600 bg-blue-50 border-blue-100",
      description: "Applications ready for evaluation"
    },
    {
      title: "Pending Reviews",
      value: stats?.pending_reviews || 0,
      icon: AlertCircle,
      color: "text-amber-600 bg-amber-50 border-amber-100",
      description: "Requires evaluation and remarks"
    },
    {
      title: "Clarifications Requested",
      value: stats?.clarification_requests || 0,
      icon: HelpCircle,
      color: "text-purple-600 bg-purple-50 border-purple-100",
      description: "Awaiting college responses"
    },
    {
      title: "Completed Reviews",
      value: stats?.completed_reviews || 0,
      icon: CheckCircle2,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
      description: "Evaluation complete"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex flex-col justify-between"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{card.title}</p>
                  <h3 className="text-3xl font-extrabold text-slate-800 mt-2">{card.value}</h3>
                </div>
                <div className={`p-3 rounded-xl border ${card.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <p className="text-xs font-medium text-slate-500 mt-4">{card.description}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity Feed */}
        <motion.div 
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)]"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-orange-500" />
              <h4 className="font-bold text-slate-800 text-lg">Evaluation Timeline</h4>
            </div>
            <button 
              onClick={() => navigate('/committee/submissions')}
              className="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              View Submissions <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-6">
            {stats?.recent_activity && stats.recent_activity.length > 0 ? (
              stats.recent_activity.map((act, idx) => (
                <div key={idx} className="flex gap-4 relative group">
                  {idx < stats.recent_activity.length - 1 && (
                    <span className="absolute left-[18px] top-9 bottom-[-18px] w-0.5 bg-slate-100 group-hover:bg-slate-200 transition-colors" />
                  )}
                  <div className="w-9 h-9 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 shadow-sm">
                    <School className="w-4 h-4 text-slate-400" />
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex justify-between items-start">
                      <h5 className="font-semibold text-sm text-slate-800">{act.college_name}</h5>
                      <span className="text-[10px] font-semibold text-slate-400 bg-slate-50 border border-slate-100 px-2.5 py-0.5 rounded-full">{act.date}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Status updated to <span className="font-semibold text-slate-700">{act.status}</span> by {act.user}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-slate-400">
                <ClipboardList className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm font-medium">No recent activity logged</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Quick Guide Card */}
        <motion.div 
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-[0_4px_25px_rgba(15,23,42,0.15)] flex flex-col justify-between"
        >
          <div>
            <h4 className="font-bold text-lg leading-tight mb-2">Screening Guidelines</h4>
            <p className="text-slate-300 text-xs leading-relaxed mb-6">
              Welcome to the HSHEC Evaluation Console. As a Screening Committee member, you are tasked with verifying submitted claims, reviewing evidence documents, recommending final actions, and coordinating clarifications.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</span>
                <div>
                  <h5 className="text-xs font-bold">Assess & score indicators</h5>
                  <p className="text-[10px] text-slate-400">Review answers, scores and verify uploaded evidence documents.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</span>
                <div>
                  <h5 className="text-xs font-bold">Request Clarifications</h5>
                  <p className="text-[10px] text-slate-400">Lock general edits and open specific indicator fields for revision.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</span>
                <div>
                  <h5 className="text-xs font-bold">Provide Recommendation</h5>
                  <p className="text-[10px] text-slate-400">Recommend Approve, Reject or Send Back with final remarks.</p>
                </div>
              </div>
            </div>
          </div>
          <button 
            onClick={() => navigate('/committee/submissions')}
            className="w-full mt-8 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-3 rounded-xl transition-all duration-300 text-xs flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 cursor-pointer"
          >
            Start Evaluating <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default CommitteeOverview;
