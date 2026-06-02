import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  School,
  FileDown,
  X
} from 'lucide-react';
import { 
  calculateTotalScore, 
  getClassification 
} from '../../utils/mockData';
import { fetchAdminInstitutions } from '../../api/admin';

const CollegeManagement = () => {
  const navigate = useNavigate();
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [sortField, setSortField] = useState('score'); // 'name', 'score', 'status'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc', 'desc'

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

  // Districts and types list derived from data
  const districts = [...new Set(colleges.map(c => c.district))].sort();
  const types = [...new Set(colleges.map(c => c.type))].sort();
  const classifications = ['Platinum', 'Gold', 'Silver', 'No Award'];
  const statuses = ['Approved', 'Pending Review', 'Rejected', 'Sent Back'];

  // Handle clear all filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedStatus('');
    setSelectedType('');
    setSelectedClass('');
    setSelectedDistrict('');
    setSortField('score');
    setSortOrder('desc');
  };

  // Toggle Sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc'); // Default to desc when changing fields
    }
  };

  // Apply filters and sort
  const filteredColleges = colleges
    .map(c => {
      const score = calculateTotalScore(c.scores);
      const classification = getClassification(score);
      return {
        ...c,
        totalScore: score,
        classification: classification
      };
    })
    .filter(c => {
      const matchSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.aishe.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = selectedStatus ? c.status === selectedStatus : true;
      const matchType = selectedType ? c.type === selectedType : true;
      const matchDistrict = selectedDistrict ? c.district === selectedDistrict : true;
      const matchClass = selectedClass ? c.classification.name === selectedClass : true;

      return matchSearch && matchStatus && matchType && matchDistrict && matchClass;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortField === 'score') {
        comparison = a.totalScore - b.totalScore;
      } else if (sortField === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortField === 'status') {
        comparison = a.status.localeCompare(b.status);
      } else if (sortField === 'type') {
        comparison = a.type.localeCompare(b.type);
      }

      return sortOrder === 'desc' ? -comparison : comparison;
    });

  // Export filtered list to CSV helper
  const handleExportCSV = () => {
    const headers = 'College Name,AISHE Code,Type,District,Total Score,Classification,Status\n';
    const rows = filteredColleges.map(c => 
      `"${c.name}","${c.aishe}","${c.type}","${c.district}",${c.totalScore},"${c.classification.name}","${c.status}"`
    ).join('\n');
    
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `hshec_colleges_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider animate-pulse">Loading Institutions...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Title block */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Institutional Self-Appraisals</h1>
          <p className="text-xs text-slate-400 font-medium">Verify submissions, review marks, and manage classifications.</p>
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 bg-[#1D4ED8] hover:bg-blue-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-md shadow-blue-500/10 cursor-pointer transition-colors"
        >
          <FileDown className="w-4 h-4" />
          <span>Export CSV Report</span>
        </button>
      </div>

      {/* Filter panel */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center space-x-2 text-slate-800 font-bold text-sm">
          <Filter className="w-4 h-4 text-slate-500" />
          <span>Search & Advanced Filters</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search bar */}
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by College Name or AISHE Code..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1D4ED8] transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')} 
                className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Status filter */}
          <div>
            <select
              className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1D4ED8]"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              {statuses.map(st => <option key={st} value={st}>{st}</option>)}
            </select>
          </div>

          {/* Type filter */}
          <div>
            <select
              className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1D4ED8]"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="">All Types</option>
              {types.map(tp => <option key={tp} value={tp}>{tp} Managed</option>)}
            </select>
          </div>

          {/* Classification filter */}
          <div>
            <select
              className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1D4ED8]"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="">All Awards</option>
              {classifications.map(cl => <option key={cl} value={cl}>{cl}</option>)}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-100 gap-2">
          {/* District filter */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">District:</span>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setSelectedDistrict('')}
                className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-colors ${
                  !selectedDistrict 
                    ? 'bg-blue-50 border-blue-200 text-[#1D4ED8]' 
                    : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                All Districts
              </button>
              {districts.map(dt => (
                <button
                  key={dt}
                  onClick={() => setSelectedDistrict(dt)}
                  className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-colors ${
                    selectedDistrict === dt 
                      ? 'bg-blue-50 border-blue-200 text-[#1D4ED8]' 
                      : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {dt}
                </button>
              ))}
            </div>
          </div>

          {/* Reset Filters button */}
          {(searchTerm || selectedStatus || selectedType || selectedClass || selectedDistrict) && (
            <button
              onClick={handleClearFilters}
              className="text-xs font-bold text-red-500 hover:text-red-600 flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear All Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* College List Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50/70">
              <tr>
                <th 
                  onClick={() => handleSort('name')}
                  className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center space-x-1.5">
                    <span>College Name & AISHE</span>
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('type')}
                  className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center space-x-1.5">
                    <span>Type</span>
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">District</th>
                <th 
                  onClick={() => handleSort('status')}
                  className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center space-x-1.5">
                    <span>Status</span>
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('score')}
                  className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center space-x-1.5">
                    <span>Score (100)</span>
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Award Level</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {filteredColleges.length > 0 ? (
                filteredColleges.map((college) => (
                  <tr 
                    key={college.id}
                    onClick={() => navigate(`/admin/colleges/${college.id}`)}
                    className="hover:bg-slate-50/50 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4.5 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 group-hover:bg-blue-100 transition-colors">
                          <School className="w-4.5 h-4.5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-800 group-hover:text-[#1D4ED8] transition-colors max-w-sm truncate" title={college.name}>
                            {college.name}
                          </div>
                          <div className="text-[10px] text-slate-400 font-bold mt-0.5">
                            AISHE Code: <span className="font-mono text-slate-500">{college.aishe}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4.5 whitespace-nowrap">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                        college.type === 'Govt' ? 'bg-sky-50 border-sky-100 text-sky-800' :
                        college.type === 'Aided' ? 'bg-orange-50 border-orange-100 text-orange-800' :
                        'bg-slate-100 border-slate-200 text-slate-800'
                      }`}>
                        {college.type}
                      </span>
                    </td>
                    <td className="px-6 py-4.5 whitespace-nowrap text-xs font-semibold text-slate-600">
                      {college.district}
                    </td>
                    <td className="px-6 py-4.5 whitespace-nowrap">
                      <span className={`text-[9px] font-extrabold tracking-wide uppercase px-2.5 py-1 rounded-full ${
                        college.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                        college.status === 'Pending Review' ? 'bg-blue-100 text-blue-800' :
                        college.status === 'Sent Back' ? 'bg-amber-100 text-amber-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {college.status}
                      </span>
                    </td>
                    <td className="px-6 py-4.5 whitespace-nowrap text-sm font-extrabold text-slate-800">
                      {college.totalScore}
                    </td>
                    <td className="px-6 py-4.5 whitespace-nowrap">
                      <span 
                        className={`text-[10px] font-extrabold tracking-wide px-3 py-1 rounded-full border shadow-sm ${college.classification.bg}`}
                        style={{ borderColor: `${college.classification.color}33` }}
                      >
                        {college.classification.name}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <School className="w-10 h-10 text-slate-300" />
                      <p className="text-sm font-bold text-slate-500">No institutions match the search criteria.</p>
                      <button 
                        onClick={handleClearFilters}
                        className="text-xs text-[#1D4ED8] hover:underline font-bold"
                      >
                        Clear all filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-bold">
          <span>Showing {filteredColleges.length} of {colleges.length} institutions</span>
          <span>Haryana State Higher Education Council</span>
        </div>
      </div>
    </div>
  );
};

export default CollegeManagement;
