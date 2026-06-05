// Parameters definitions
export const PARAMETERS = [
  // Existing Parameters (Max 68)
  { id: 'p1', num: 1, name: 'Internship/Apprenticeship Embedded Degree Programmes', max: 4, type: 'existing', category: 'Academic' },
  { id: 'p2', num: 2, name: 'Courses offered in Indian Languages', max: 4, type: 'existing', category: 'Academic' },
  { id: 'p3', num: 3, name: 'Special Programmes in IKS', max: 4, type: 'existing', category: 'Academic' },
  { id: 'p4', num: 4, name: 'Targets achieved under IDP (2024-25 + 2025-26)', max: 6, type: 'existing', category: 'NEP Implementation' },
  { id: 'p5', num: 5, name: 'Accreditation Status (NAAC)', max: 8, type: 'existing', category: 'NEP Implementation' },
  { id: 'p6', num: 6, name: 'Academic Bank of Credits (ABC) Registered', max: 6, type: 'existing', category: 'Academic' },
  { id: 'p7', num: 7, name: 'Professor of Practice Appointed', max: 4, type: 'existing', category: 'NEP Implementation' },
  { id: 'p8', num: 8, name: 'Incubation/Startup Cell Performance', max: 4, type: 'existing', category: 'NEP Implementation' },
  { id: 'p9', num: 9, name: 'Academic/Research Collaboration with Foreign HEIs', max: 6, type: 'existing', category: 'Research' },
  { id: 'p10', num: 10, name: 'Alumni Connect Cell Functional', max: 4, type: 'existing', category: 'Welfare & Inclusion' },
  { id: 'p11', num: 11, name: 'Gender Parity Initiatives', max: 5, type: 'existing', category: 'Welfare & Inclusion' },
  { id: 'p12', num: 12, name: 'UGC Guidelines – Physical Fitness, Sports & Wellbeing', max: 5, type: 'existing', category: 'Welfare & Inclusion' },
  { id: 'p13', num: 13, name: 'Provision for Online Courses / MOOCs', max: 4, type: 'existing', category: 'Academic' },
  { id: 'p14', num: 14, name: 'Teacher Trained under MMTTC NEP Workshops', max: 4, type: 'existing', category: 'Welfare & Inclusion' },
  
  // New Parameters (Max 32)
  { id: 'p15', num: 15, name: 'Multidisciplinary Education', max: 8, type: 'new', category: 'Academic' },
  { id: 'p16', num: 16, name: 'Multiple Entry-Exit Operationalized', max: 2, type: 'new', category: 'Academic' },
  { id: 'p17', num: 17, name: 'Research Outcome – Patents Filed & Granted', max: 4, type: 'new', category: 'Research' },
  { id: 'p18', num: 18, name: 'Registration & Performance in NIRF', max: 2, type: 'new', category: 'Research' },
  { id: 'p19', num: 19, name: 'Outcome-Based Education (OBE) Implementation', max: 6, type: 'new', category: 'Academic' },
  { id: 'p20', num: 20, name: 'Utilization of Funds (Previous Financial Year)', max: 2, type: 'new', category: 'NEP Implementation' }
];

export const CATEGORIES = {
  Academic: { max: 38, params: ['p1', 'p2', 'p3', 'p6', 'p13', 'p15', 'p16', 'p19'] },
  Research: { max: 12, params: ['p9', 'p17', 'p18'] },
  'NEP Implementation': { max: 24, params: ['p4', 'p5', 'p7', 'p8', 'p20'] },
  'Welfare & Inclusion': { max: 18, params: ['p10', 'p11', 'p12', 'p14'] }
};

// Help helper to calculate total score
export const calculateTotalScore = (scores) => {
  return Object.values(scores).reduce((sum, val) => sum + (Number(val) || 0), 0);
};

// Help helper to get classification badge
export const getClassification = (score) => {
  if (score >= 91) return { name: 'Platinum', color: '#7C3AED', bg: 'bg-purple-100 text-purple-800 border-purple-300' };
  if (score >= 75) return { name: 'Gold', color: '#D97706', bg: 'bg-amber-100 text-amber-800 border-amber-300' };
  if (score >= 51) return { name: 'Silver', color: '#6B7280', bg: 'bg-slate-100 text-slate-800 border-slate-300' };
  return { name: 'No Award', color: '#EF4444', bg: 'bg-red-100 text-red-800 border-red-300' };
};

// Pre-seeded colleges list
const INITIAL_COLLEGES = [
  {
    id: 'col-1',
    name: 'Pandit Neki Ram Sharma Government College, Rohtak',
    aishe: 'C-23451',
    type: 'Govt',
    district: 'Rohtak',
    status: 'Approved',
    remarks: 'Excellent implementation of Indian knowledge system and NAAC credentials. Keep maintaining research collaborations.',
    scores: {
      p1: 4, p2: 3, p3: 4, p4: 5, p5: 8, p6: 6, p7: 3, p8: 4, p9: 5, p10: 4, p11: 5, p12: 5, p13: 4, p14: 4,
      p15: 7, p16: 2, p17: 3, p18: 2, p19: 5, p20: 2, p21: 3, p22: 3
    },
    docs: {
      p1: true, p2: true, p3: true, p4: true, p5: true, p6: true, p7: true, p8: true, p9: true, p10: true, p11: true, p12: true, p13: true, p14: true,
      p15: true, p16: true, p17: true, p18: true, p19: true, p20: true, p21: true, p22: true
    },
    history: [
      { date: '2026-05-02 10:15', status: 'Submitted', user: 'College Principal' },
      { date: '2026-05-05 14:30', status: 'Pending Review', user: 'System Allocator' },
      { date: '2026-05-18 16:45', status: 'Approved', user: 'Admin Evaluator' }
    ]
  },
  {
    id: 'col-2',
    name: 'Government College for Girls, Sector-14, Panchkula',
    aishe: 'C-28490',
    type: 'Govt',
    district: 'Panchkula',
    status: 'Approved',
    remarks: 'Highly notable gender parity initiatives. All indicators thoroughly verified.',
    scores: {
      p1: 3, p2: 4, p3: 3, p4: 6, p5: 7, p6: 5, p7: 4, p8: 3, p9: 4, p10: 4, p11: 5, p12: 4, p13: 3, p14: 4,
      p15: 6, p16: 2, p17: 2, p18: 1, p19: 5, p20: 2, p21: 2, p22: 4
    },
    docs: {
      p1: true, p2: true, p3: true, p4: true, p5: true, p6: true, p7: true, p8: true, p9: true, p10: true, p11: true, p12: true, p13: true, p14: true,
      p15: true, p16: true, p17: true, p18: true, p19: true, p20: true, p21: true, p22: true
    },
    history: [
      { date: '2026-05-03 09:00', status: 'Submitted', user: 'College Principal' },
      { date: '2026-05-06 11:20', status: 'Pending Review', user: 'System Allocator' },
      { date: '2026-05-15 13:00', status: 'Approved', user: 'Admin Evaluator' }
    ]
  },
  {
    id: 'col-3',
    name: 'D.A.V. College, Ambala Cantt',
    aishe: 'C-10384',
    type: 'Aided',
    district: 'Ambala',
    status: 'Approved',
    remarks: 'Strong research and incubation performance. Excellent score across all criteria.',
    scores: {
      p1: 4, p2: 3, p3: 3, p4: 5, p5: 8, p6: 6, p7: 3, p8: 4, p9: 5, p10: 4, p11: 4, p12: 4, p13: 4, p14: 3,
      p15: 8, p16: 2, p17: 4, p18: 2, p19: 6, p20: 2, p21: 4, p22: 3
    },
    docs: {
      p1: true, p2: true, p3: true, p4: true, p5: true, p6: true, p7: true, p8: true, p9: true, p10: true, p11: true, p12: true, p13: true, p14: true,
      p15: true, p16: true, p17: true, p18: true, p19: true, p20: true, p21: true, p22: true
    },
    history: [
      { date: '2026-05-01 11:00', status: 'Submitted', user: 'College Admin' },
      { date: '2026-05-04 15:40', status: 'Pending Review', user: 'System Allocator' },
      { date: '2026-05-12 10:20', status: 'Approved', user: 'Admin Evaluator' }
    ]
  },
  {
    id: 'col-4',
    name: 'Dyal Singh College, Karnal',
    aishe: 'C-11204',
    type: 'Aided',
    district: 'Karnal',
    status: 'Approved',
    remarks: 'Solid implementation of OBE and NAAC parameters. Incubation cell performance can be improved.',
    scores: {
      p1: 3, p2: 3, p3: 2, p4: 4, p5: 7, p6: 5, p7: 2, p8: 2, p9: 3, p10: 3, p11: 4, p12: 4, p13: 3, p14: 3,
      p15: 6, p16: 2, p17: 2, p18: 1, p19: 5, p20: 2, p21: 2, p22: 3
    },
    docs: {
      p1: true, p2: true, p3: true, p4: true, p5: true, p6: true, p7: true, p8: true, p9: true, p10: true, p11: true, p12: true, p13: true, p14: true,
      p15: true, p16: true, p17: true, p18: true, p19: true, p20: true, p21: true, p22: true
    },
    history: [
      { date: '2026-05-05 14:12', status: 'Submitted', user: 'College Principal' },
      { date: '2026-05-07 10:00', status: 'Pending Review', user: 'System Allocator' },
      { date: '2026-05-16 11:30', status: 'Approved', user: 'Admin Evaluator' }
    ]
  },
  {
    id: 'col-5',
    name: 'Government Post Graduate College, Sector-9, Gurugram',
    aishe: 'C-24902',
    type: 'Govt',
    district: 'Gurugram',
    status: 'Pending Review',
    remarks: 'Initial scores inputted. Documents for special programs in IKS need verification.',
    scores: {
      p1: 3, p2: 2, p3: 2, p4: 4, p5: 6, p6: 5, p7: 2, p8: 3, p9: 3, p10: 3, p11: 4, p12: 4, p13: 3, p14: 3,
      p15: 5, p16: 1, p17: 1, p18: 1, p19: 4, p20: 1, p21: 2, p22: 2
    },
    docs: {
      p1: true, p2: true, p3: true, p4: true, p5: true, p6: true, p7: true, p8: true, p9: false, p10: true, p11: true, p12: true, p13: true, p14: true,
      p15: true, p16: true, p17: false, p18: false, p19: true, p20: true, p21: false, p22: true
    },
    history: [
      { date: '2026-05-08 16:30', status: 'Submitted', user: 'College Registrar' },
      { date: '2026-05-11 09:15', status: 'Pending Review', user: 'Admin Evaluator' }
    ]
  },
  {
    id: 'col-6',
    name: 'Vaish College, Rohtak',
    aishe: 'C-10902',
    type: 'Private',
    district: 'Rohtak',
    status: 'Approved',
    remarks: 'Private institution with respectable growth in online courses and sports facilities.',
    scores: {
      p1: 3, p2: 2, p3: 2, p4: 4, p5: 6, p6: 4, p7: 2, p8: 2, p9: 3, p10: 3, p11: 4, p12: 4, p13: 3, p14: 3,
      p15: 5, p16: 1, p17: 2, p18: 0, p19: 4, p20: 2, p21: 1, p22: 2
    },
    docs: {
      p1: true, p2: true, p3: true, p4: true, p5: true, p6: true, p7: true, p8: true, p9: true, p10: true, p11: true, p12: true, p13: true, p14: true,
      p15: true, p16: true, p17: true, p18: false, p19: true, p20: true, p21: true, p22: true
    },
    history: [
      { date: '2026-05-02 09:40', status: 'Submitted', user: 'College IQAC Coordinator' },
      { date: '2026-05-06 14:00', status: 'Approved', user: 'Admin Evaluator' }
    ]
  },
  {
    id: 'col-7',
    name: 'Radha Krishan Sanatan Dharam College (RKSD), Kaithal',
    aishe: 'C-11453',
    type: 'Aided',
    district: 'Karnal', // Region of Karnal division
    status: 'Pending Review',
    remarks: 'Awaiting verification of funding utilization certificates.',
    scores: {
      p1: 2, p2: 2, p3: 3, p4: 3, p5: 6, p6: 5, p7: 2, p8: 2, p9: 2, p10: 3, p11: 4, p12: 4, p13: 3, p14: 3,
      p15: 5, p16: 1, p17: 1, p18: 1, p19: 4, p20: 1, p21: 1, p22: 2
    },
    docs: {
      p1: true, p2: true, p3: true, p4: true, p5: true, p6: true, p7: false, p8: true, p9: false, p10: true, p11: true, p12: true, p13: true, p14: true,
      p15: true, p16: false, p17: false, p18: true, p19: true, p20: true, p21: false, p22: true
    },
    history: [
      { date: '2026-05-09 11:20', status: 'Submitted', user: 'College Principal' },
      { date: '2026-05-12 15:00', status: 'Pending Review', user: 'Admin Evaluator' }
    ]
  },
  {
    id: 'col-8',
    name: 'Mukand Lal National College, Yamunanagar',
    aishe: 'C-10291',
    type: 'Aided',
    district: 'Yamunanagar',
    status: 'Approved',
    remarks: 'Strong co-curricular and multi-disciplinary program implementation. Score updated to 78.',
    scores: {
      p1: 4, p2: 3, p3: 3, p4: 5, p5: 7, p6: 5, p7: 3, p8: 3, p9: 4, p10: 4, p11: 4, p12: 4, p13: 3, p14: 4,
      p15: 6, p16: 1, p17: 2, p18: 1, p19: 5, p20: 2, p21: 2, p22: 3
    },
    docs: {
      p1: true, p2: true, p3: true, p4: true, p5: true, p6: true, p7: true, p8: true, p9: true, p10: true, p11: true, p12: true, p13: true, p14: true,
      p15: true, p16: true, p17: true, p18: true, p19: true, p20: true, p21: true, p22: true
    },
    history: [
      { date: '2026-05-03 14:15', status: 'Submitted', user: 'College Admin' },
      { date: '2026-05-07 10:20', status: 'Approved', user: 'Admin Evaluator' }
    ]
  },
  {
    id: 'col-9',
    name: 'Government College, Hisar',
    aishe: 'C-22941',
    type: 'Govt',
    district: 'Hisar',
    status: 'Sent Back',
    remarks: 'Several core documents are missing. Please upload the proof of ABC registration and targets achieved under IDP. Recalculation needed.',
    scores: {
      p1: 2, p2: 1, p3: 1, p4: 2, p5: 4, p6: 2, p7: 1, p8: 1, p9: 1, p10: 2, p11: 3, p12: 3, p13: 2, p14: 2,
      p15: 4, p16: 1, p17: 0, p18: 0, p19: 3, p20: 1, p21: 1, p22: 1
    },
    docs: {
      p1: true, p2: false, p3: false, p4: false, p5: true, p6: false, p7: false, p8: true, p9: false, p10: true, p11: true, p12: true, p13: false, p14: true,
      p15: true, p16: false, p17: false, p18: false, p19: false, p20: true, p21: false, p22: false
    },
    history: [
      { date: '2026-05-04 16:00', status: 'Submitted', user: 'College Registrar' },
      { date: '2026-05-08 11:30', status: 'Pending Review', user: 'Admin Evaluator' },
      { date: '2026-05-14 15:45', status: 'Sent Back', user: 'Admin Evaluator' }
    ]
  },
  {
    id: 'col-10',
    name: 'Arya College, Panipat',
    aishe: 'C-10492',
    type: 'Private',
    district: 'Karnal', // Panipat is in Karnal administrative division
    status: 'Pending Review',
    remarks: 'Undergoing visual and code verification for academic and collaboration parameters.',
    scores: {
      p1: 3, p2: 3, p3: 2, p4: 4, p5: 6, p6: 5, p7: 2, p8: 2, p9: 3, p10: 3, p11: 4, p12: 4, p13: 3, p14: 3,
      p15: 6, p16: 1, p17: 2, p18: 1, p19: 4, p20: 2, p21: 2, p22: 2
    },
    docs: {
      p1: true, p2: true, p3: true, p4: true, p5: true, p6: true, p7: true, p8: true, p9: true, p10: true, p11: true, p12: true, p13: true, p14: true,
      p15: true, p16: true, p17: true, p18: true, p19: true, p20: true, p21: true, p22: true
    },
    history: [
      { date: '2026-05-10 10:00', status: 'Submitted', user: 'College Admin' },
      { date: '2026-05-13 14:20', status: 'Pending Review', user: 'Admin Evaluator' }
    ]
  },
  {
    id: 'col-11',
    name: 'Kurukshetra University College, Kurukshetra',
    aishe: 'C-10023',
    type: 'Aided',
    district: 'Kurukshetra',
    status: 'Approved',
    remarks: 'Outstanding performance in patents and PhD scholars enrollment. True standard model college.',
    scores: {
      p1: 4, p2: 4, p3: 4, p4: 6, p5: 8, p6: 6, p7: 4, p8: 4, p9: 6, p10: 4, p11: 5, p12: 5, p13: 4, p14: 4,
      p15: 8, p16: 2, p17: 4, p18: 2, p19: 6, p20: 2, p21: 4, p22: 4
    },
    docs: {
      p1: true, p2: true, p3: true, p4: true, p5: true, p6: true, p7: true, p8: true, p9: true, p10: true, p11: true, p12: true, p13: true, p14: true,
      p15: true, p16: true, p17: true, p18: true, p19: true, p20: true, p21: true, p22: true
    },
    history: [
      { date: '2026-05-02 11:30', status: 'Submitted', user: 'University Dean' },
      { date: '2026-05-05 09:20', status: 'Approved', user: 'Admin Evaluator' }
    ]
  },
  {
    id: 'col-12',
    name: 'Government College, Faridabad',
    aishe: 'C-24011',
    type: 'Govt',
    district: 'Faridabad',
    status: 'Rejected',
    remarks: 'Submission rejected due to failure to meet the minimum standards and large discrepancies in documents uploaded for NAAC.',
    scores: {
      p1: 1, p2: 1, p3: 1, p4: 2, p5: 3, p6: 2, p7: 0, p8: 1, p9: 0, p10: 2, p11: 3, p12: 3, p13: 1, p14: 2,
      p15: 3, p16: 0, p17: 0, p18: 0, p19: 2, p20: 1, p21: 0, p22: 1
    },
    docs: {
      p1: true, p2: false, p3: true, p4: false, p5: true, p6: false, p7: false, p8: false, p9: false, p10: true, p11: true, p12: true, p13: false, p14: true,
      p15: false, p16: false, p17: false, p18: false, p19: false, p20: true, p21: false, p22: false
    },
    history: [
      { date: '2026-05-04 12:45', status: 'Submitted', user: 'College Principal' },
      { date: '2026-05-07 16:30', status: 'Pending Review', user: 'Admin Evaluator' },
      { date: '2026-05-15 11:00', status: 'Rejected', user: 'Admin Evaluator' }
    ]
  },
  {
    id: 'col-13',
    name: 'S.A. Jain College, Ambala City',
    aishe: 'C-10143',
    type: 'Aided',
    district: 'Ambala',
    status: 'Pending Review',
    remarks: 'Currently reviewing proof of multiple entry/exit operationalization.',
    scores: {
      p1: 3, p2: 3, p3: 2, p4: 4, p5: 6, p6: 5, p7: 2, p8: 2, p9: 3, p10: 3, p11: 4, p12: 4, p13: 3, p14: 3,
      p15: 5, p16: 2, p17: 1, p18: 1, p19: 4, p20: 2, p21: 2, p22: 2
    },
    docs: {
      p1: true, p2: true, p3: true, p4: true, p5: true, p6: true, p7: true, p8: true, p9: false, p10: true, p11: true, p12: true, p13: true, p14: true,
      p15: true, p16: true, p17: false, p18: true, p19: true, p20: true, p21: true, p22: true
    },
    history: [
      { date: '2026-05-12 14:40', status: 'Submitted', user: 'College Coordinator' },
      { date: '2026-05-14 10:10', status: 'Pending Review', user: 'Admin Evaluator' }
    ]
  },
  {
    id: 'col-14',
    name: 'Government College for Women, Rohtak',
    aishe: 'C-23466',
    type: 'Govt',
    district: 'Rohtak',
    status: 'Approved',
    remarks: 'Superb focus on women sports and physical activities matching UGC guidelines.',
    scores: {
      p1: 3, p2: 3, p3: 3, p4: 4, p5: 7, p6: 5, p7: 3, p8: 3, p9: 3, p10: 4, p11: 5, p12: 5, p13: 3, p14: 4,
      p15: 6, p16: 1, p17: 2, p18: 1, p19: 4, p20: 2, p21: 2, p22: 3
    },
    docs: {
      p1: true, p2: true, p3: true, p4: true, p5: true, p6: true, p7: true, p8: true, p9: true, p10: true, p11: true, p12: true, p13: true, p14: true,
      p15: true, p16: true, p17: true, p18: true, p19: true, p20: true, p21: true, p22: true
    },
    history: [
      { date: '2026-05-04 10:15', status: 'Submitted', user: 'College Principal' },
      { date: '2026-05-08 14:50', status: 'Approved', user: 'Admin Evaluator' }
    ]
  },
  {
    id: 'col-15',
    name: 'Hindu College, Sonepat',
    aishe: 'C-10654',
    type: 'Private',
    district: 'Sonipat',
    status: 'Approved',
    remarks: 'Highly active alumni network and well-executed Incubation/Startup performance.',
    scores: {
      p1: 3, p2: 3, p3: 2, p4: 5, p5: 7, p6: 5, p7: 3, p8: 4, p9: 4, p10: 4, p11: 4, p12: 4, p13: 3, p14: 3,
      p15: 6, p16: 1, p17: 3, p18: 1, p19: 5, p20: 2, p21: 3, p22: 3
    },
    docs: {
      p1: true, p2: true, p3: true, p4: true, p5: true, p6: true, p7: true, p8: true, p9: true, p10: true, p11: true, p12: true, p13: true, p14: true,
      p15: true, p16: true, p17: true, p18: true, p19: true, p20: true, p21: true, p22: true
    },
    history: [
      { date: '2026-05-05 09:10', status: 'Submitted', user: 'College IQAC Head' },
      { date: '2026-05-08 17:30', status: 'Approved', user: 'Admin Evaluator' }
    ]
  }
];

// Load / Initialize database
export const initializeDatabase = () => {
  if (!localStorage.getItem('hshec_colleges')) {
    localStorage.setItem('hshec_colleges', JSON.stringify(INITIAL_COLLEGES));
  }
  
  if (!localStorage.getItem('hshec_settings')) {
    const defaultSettings = {
      openDate: '2026-05-01',
      closeDate: '2026-06-30',
      adminAccounts: [
        { name: 'Dr. Ramesh Kumar', email: 'ramesh.kumar@hshec.gov.in', role: 'Chief Evaluator' },
        { name: 'Prof. Anita Sharma', email: 'anita.sharma@hshec.gov.in', role: 'Academic Auditor' },
        { name: 'Sh. Vikram Singh', email: 'vikram.singh@hshec.gov.in', role: 'IT Administrator' }
      ]
    };
    localStorage.setItem('hshec_settings', JSON.stringify(defaultSettings));
  }
};

export const getColleges = () => {
  initializeDatabase();
  return JSON.parse(localStorage.getItem('hshec_colleges'));
};

export const saveColleges = (colleges) => {
  localStorage.setItem('hshec_colleges', JSON.stringify(colleges));
};

export const getSettings = () => {
  initializeDatabase();
  return JSON.parse(localStorage.getItem('hshec_settings'));
};

export const saveSettings = (settings) => {
  localStorage.setItem('hshec_settings', JSON.stringify(settings));
};

// Reset to initial mock data helper
export const resetDatabase = () => {
  localStorage.removeItem('hshec_colleges');
  localStorage.removeItem('hshec_settings');
  initializeDatabase();
  window.location.reload();
};
