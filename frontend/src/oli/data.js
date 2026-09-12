export const EXPERTS = [
  { name: 'Abhik Datta', did: '8012345678' },
  { name: 'Rahul Verma', did: '8012345679' },
  { name: 'Sneha Iyer', did: '8012345680' },
  { name: 'Arjun Mehta', did: '8012345681' },
  { name: 'Kavita Rao', did: '8012345682' },
  { name: 'Meera Nair', did: '8012345683' },
  { name: 'Priya Sharma', did: '8012345684' },
  { name: 'Vikram Singh', did: '8012345664' },
];

const DOCS = {
  gst: [
    { name: 'PAN Card', accepted: '.pdf,.jpg,.png' },
    { name: 'Address Proof', accepted: '.pdf,.jpg,.png' },
    { name: 'Bank Statement', accepted: '.pdf' },
  ],
  tm: [
    { name: 'Trademark Document', accepted: '.pdf,.jpg,.png' },
    { name: 'Logo / Mark', accepted: '.jpg,.png' },
  ],
  iso: [
    { name: 'Company Information', accepted: '.pdf' },
    { name: 'Quality Manual', accepted: '.pdf' },
  ],
  company: [
    { name: 'Director ID Proof (DIN KYC)', accepted: '.pdf,.jpg,.png' },
    { name: 'Registered Office Proof', accepted: '.pdf,.jpg,.png' },
    { name: 'Passport Photos', accepted: '.jpg,.png' },
  ],
  iec: [{ name: 'Cancelled Cheque', accepted: '.pdf,.jpg,.png' }],
  bookkeeping: [{ name: 'Sales & Purchase Invoices', accepted: '.pdf' }],
  afc: [
    { name: 'Financial Statements', accepted: '.pdf' },
    { name: 'Shareholding Details', accepted: '.pdf' },
  ],
  fssai: [
    { name: 'Food Safety Plan', accepted: '.pdf' },
    { name: 'Kitchen Photos', accepted: '.jpg,.png' },
  ],
  tmobj: [{ name: 'Objection Notice Copy', accepted: '.pdf' }],
  gstreturn: [{ name: 'Sales Data (GSTR-1)', accepted: '.pdf,.xlsx' }],
};

const R = {
  doc: 'We are reviewing your documents. Please upload any pending items to proceed.',
  filing: 'Your application has been filed and is under processing with the department.',
  done: 'Work completed successfully. Final documents/certificate delivered.',
  pending: 'Your request has been received. An expert will be assigned within 24 hours.',
};

const rd = (key, uploaded) => DOCS[key].map(d => ({ ...d, uploaded: !!uploaded }));
const rdMix = (key, n) => DOCS[key].map((d, i) => ({ ...d, uploaded: i < n }));

const tm = (oliId, cls, type, desc, o) => ({
  key: 'tm', name: 'Trademark Registration', oliId,
  sub: `Class ${cls} · ${type}`,
  meta: [`Type: ${type}`, `Class ${cls}`, desc],
  requiredDocs: rd('tm', false), docsSeed: [], live: false, pendingExpert: false,
  completed: false, completedAt: null, cert: null, feedback: null, ...o,
});

const iso = (oliId, code, desc, o) => ({
  key: 'iso', name: 'ISO Certification', oliId,
  sub: code,
  meta: [code, desc],
  requiredDocs: rd('iso', false), docsSeed: [], live: false, pendingExpert: false,
  completed: false, completedAt: null, cert: null, feedback: null, ...o,
});

export const SERVICES_SEED = [
  {
    key: 'gst', name: 'GST Registration', oliId: 'OLI12345678914797', sub: 'Goods & Services Tax',
    meta: [], stage: 2, progress: 70, live: true, liveSince: '02/09/2026, 04:00 PM', pendingExpert: false,
    startedOn: '12/05/2026', lastUpdated: '02/09/2026, 04:30 PM', nextAction: 'Upload 3 pending documents',
    remark: 'GST application filed with the department. Awaiting ARN generation.',
    expert: 0, lastCall: { date: '02/09/2026', time: '04:30 PM', agent: 'Abhik Datta' },
    requiredDocs: rd('gst', false),
    docsSeed: [
      { name: 'Aadhaar.pdf', typeLabel: 'PDF', mime: 'application/pdf', date: '02/06/2026, 10:15 AM' },
      { name: 'PAN.pdf', typeLabel: 'PDF', mime: 'application/pdf', date: '02/06/2026, 10:18 AM' },
      { name: 'GST_Certificate_Sample.pdf', typeLabel: 'PDF', mime: 'application/pdf', date: '02/06/2026, 10:20 AM' },
      { name: 'Business_PAN_Sample.png', typeLabel: 'PNG Image', mime: 'image/png', date: '02/06/2026, 10:22 AM' },
    ],
    completed: false, completedAt: null, cert: null, feedback: null,
  },
  tm('OLI12345678914785', '35', 'Wordmark', 'Retail, advertising & business services', {
    stage: 3, progress: 100, expert: 6, startedOn: '02/01/2026', lastUpdated: '31/08/2026, 11:00 AM',
    nextAction: '—', remark: R.done, completed: true, completedAt: '31/08/2026 · 11:00 AM',
    cert: { no: 'TM-5523417', issuedOn: '31/08/2026' },
    lastCall: { date: '28/08/2026', time: '04:00 PM', agent: 'Priya Sharma' },
    requiredDocs: rd('tm', true),
    docsSeed: [
      { name: 'POWER OF AUTHORIZATION.pdf', typeLabel: 'PDF', mime: 'application/pdf', date: '09/03/2026, 11:46 AM' },
      { name: 'TM-QUESTIONNAIRE.pdf', typeLabel: 'PDF', mime: 'application/pdf', date: '09/03/2026, 11:50 AM' },
    ],
  }),
  tm('OLI12345678914786', '25', 'Logo Mark', 'Clothing, footwear & apparel', {
    stage: 2, progress: 50, expert: 1, startedOn: '03/02/2026', lastUpdated: '11/08/2026, 11:15 PM',
    nextAction: 'Upload 2 pending documents', remark: 'Trademark application filed. Awaiting examination report from the registry.',
    lastCall: { date: '11/08/2026', time: '11:15 PM', agent: 'Rahul Verma' },
    requiredDocs: rdMix('tm', 1),
  }),
  tm('OLI12345678914787', '42', 'Wordmark', 'Software & technology services', {
    stage: 1, progress: 30, live: true, liveSince: '17/08/2026, 12:30 PM', expert: 2, startedOn: '04/03/2026',
    lastUpdated: '17/08/2026, 12:40 PM', nextAction: 'Complete documentation', remark: R.doc,
    lastCall: { date: '17/08/2026', time: '12:40 PM', agent: 'Sneha Iyer' },
  }),
  tm('OLI12345678914788', '30', 'Device Mark', 'Food, bakery & confectionery products', {
    stage: 2, progress: 70, expert: 3, startedOn: '05/04/2026', lastUpdated: '13/08/2026, 01:15 PM',
    nextAction: 'Application under processing', remark: R.filing,
    lastCall: { date: '13/08/2026', time: '01:15 PM', agent: 'Arjun Mehta' },
    requiredDocs: rd('tm', true),
  }),
  tm('OLI12345678914789', '41', 'Wordmark', 'Education & training services', {
    stage: 1, progress: 30, expert: 4, startedOn: '06/05/2026', lastUpdated: '14/08/2026, 02:40 PM',
    nextAction: 'Complete documentation', remark: R.doc,
    lastCall: { date: '14/08/2026', time: '02:40 PM', agent: 'Kavita Rao' },
    requiredDocs: rdMix('tm', 1),
  }),
  tm('OLI12345678914790', '43', 'Logo Mark', 'Restaurant, café & hospitality services', {
    stage: 3, progress: 100, expert: 7, startedOn: '07/06/2026', lastUpdated: '14/07/2026, 03:15 PM',
    nextAction: '—', remark: R.done, completed: true, completedAt: '14/07/2026 · 03:15 PM',
    cert: { no: 'TM-5523602', issuedOn: '14/07/2026' },
    lastCall: { date: '13/07/2026', time: '03:15 PM', agent: 'Vikram Singh' },
    requiredDocs: rd('tm', true),
    docsSeed: [{ name: 'TM_Logo_4790.png', typeLabel: 'PNG Image', mime: 'image/png', date: '10/06/2026, 12:00 PM' }],
  }),
  tm('OLI12345678914791', '3', 'Wordmark', 'Cosmetics, skincare & personal care', {
    stage: 2, progress: 90, expert: 5, startedOn: '08/01/2026', lastUpdated: '16/08/2026, 10:40 AM',
    nextAction: 'Application under processing', remark: R.filing,
    lastCall: { date: '16/08/2026', time: '10:40 AM', agent: 'Meera Nair' },
    requiredDocs: rd('tm', true),
  }),
  tm('OLI12345678914792', '9', 'Device Mark', 'Electronics, computers & software', {
    stage: 1, progress: 30, expert: 0, startedOn: '09/02/2026', lastUpdated: '17/08/2026, 11:15 PM',
    nextAction: 'Complete documentation', remark: R.doc,
    lastCall: { date: '17/08/2026', time: '11:15 PM', agent: 'Abhik Datta' },
  }),
  tm('OLI12345678914793', '44', 'Wordmark', 'Healthcare, medical & wellness services', {
    stage: 2, progress: 50, live: true, liveSince: '18/08/2026, 12:30 PM', expert: 6, startedOn: '10/03/2026',
    lastUpdated: '18/08/2026, 12:40 AM', nextAction: 'Application under processing', remark: R.filing,
    lastCall: { date: '18/08/2026', time: '12:40 PM', agent: 'Priya Sharma' },
    requiredDocs: rd('tm', true),
  }),
  tm('OLI12345678914794', '18', 'Logo Mark', 'Leather goods, bags & accessories', {
    stage: 1, progress: 30, expert: 1, startedOn: '11/04/2026', lastUpdated: '19/08/2026, 01:15 PM',
    nextAction: 'Complete documentation', remark: R.doc,
    lastCall: { date: '19/08/2026', time: '01:15 PM', agent: 'Rahul Verma' },
    requiredDocs: rdMix('tm', 1),
  }),
  tm('OLI12345678914795', '37', 'Wordmark', 'Construction, installation & repair services', {
    stage: 2, progress: 70, expert: 2, startedOn: '12/05/2026', lastUpdated: '20/08/2026, 02:40 PM',
    nextAction: 'Application under processing', remark: R.filing,
    lastCall: { date: '20/08/2026', time: '02:40 PM', agent: 'Sneha Iyer' },
    requiredDocs: rd('tm', true),
  }),
  tm('OLI12345678914796', '29', 'Device Mark', 'Dairy, meat & processed food products', {
    stage: 1, progress: 30, expert: 3, startedOn: '13/06/2026', lastUpdated: '21/08/2026, 03:15 PM',
    nextAction: 'Complete documentation', remark: R.doc,
    lastCall: { date: '21/08/2026', time: '03:15 PM', agent: 'Arjun Mehta' },
  }),
  iso('OLI12345698714785', 'ISO 9001:2015', 'Quality Management System', {
    stage: 2, progress: 70, expert: 2, startedOn: '05/05/2026', lastUpdated: '15/08/2026, 11:50 AM',
    nextAction: 'Upload 2 pending documents', remark: 'Your ISO documentation is being prepared by our team.',
    lastCall: { date: '15/08/2026', time: '11:50 AM', agent: 'Sneha Iyer' },
    requiredDocs: rdMix('iso', 1),
    docsSeed: [{ name: 'Company Profile.pdf', typeLabel: 'PDF', mime: 'application/pdf', date: '18/05/2026, 12:10 PM' }],
  }),
  iso('OLI12345698714786', 'ISO 14001:2015', 'Environmental Management System', {
    stage: 1, progress: 30, expert: 3, startedOn: '06/05/2026', lastUpdated: '16/08/2026, 12:05 PM',
    nextAction: 'Complete documentation', remark: R.doc,
    lastCall: { date: '16/08/2026', time: '12:05 PM', agent: 'Arjun Mehta' },
  }),
  iso('OLI12345698714787', 'ISO 45001:2018', 'Occupational Health & Safety Management System', {
    stage: 2, progress: 90, live: true, liveSince: '17/08/2026, 01:40 PM', expert: 4, startedOn: '07/05/2026',
    lastUpdated: '17/08/2026, 01:50 PM', nextAction: 'Application under processing',
    remark: 'Audit documentation is complete. Your file is under final review.',
    lastCall: { date: '17/08/2026', time: '01:50 PM', agent: 'Kavita Rao' },
    requiredDocs: rd('iso', true),
  }),
  iso('OLI12345698714788', 'ISO 22000:2018', 'Food Safety Management System', {
    stage: 1, progress: 30, expert: 5, startedOn: '08/05/2026', lastUpdated: '19/08/2026, 03:50 PM',
    nextAction: 'Complete documentation', remark: R.doc,
    lastCall: { date: '19/08/2026', time: '03:50 PM', agent: 'Meera Nair' },
  }),
  iso('OLI12345698714789', 'ISO 27001:2022', 'Information Security Management System', {
    stage: 1, progress: 30, expert: 1, startedOn: '09/05/2026', lastUpdated: '19/08/2026, 04:10 PM',
    nextAction: 'Complete documentation', remark: R.doc,
    lastCall: { date: '19/08/2026', time: '04:10 PM', agent: 'Rahul Verma' },
    requiredDocs: rdMix('iso', 1),
  }),
  {
    key: 'company', name: 'Company Registration', oliId: 'OLI12345678914798', sub: 'Private Limited Company',
    meta: ['Private Limited Company'], stage: 1, progress: 30, live: false, pendingExpert: false,
    startedOn: '20/06/2026', lastUpdated: '01/09/2026, 12:10 PM', nextAction: 'Upload 3 pending documents', remark: R.doc,
    expert: 1, lastCall: { date: '01/09/2026', time: '12:10 PM', agent: 'Rahul Verma' },
    requiredDocs: rd('company', false),
    docsSeed: [{ name: 'MOA Draft.pdf', typeLabel: 'PDF', mime: 'application/pdf', date: '22/06/2026, 01:05 PM' }],
    completed: false, completedAt: null, cert: null, feedback: null,
  },
  {
    key: 'iec', name: 'IEC (Import Export Code)', oliId: 'OLI12345678914799', sub: 'Import Export Code',
    meta: ['Import Export Code'], stage: 1, progress: 50, live: false, pendingExpert: false,
    startedOn: '05/06/2026', lastUpdated: '29/08/2026, 03:20 PM', nextAction: 'Upload 1 pending document', remark: R.doc,
    expert: 7, lastCall: { date: '29/08/2026', time: '03:20 PM', agent: 'Vikram Singh' },
    requiredDocs: rd('iec', false), docsSeed: [], completed: false, completedAt: null, cert: null, feedback: null,
  },
  {
    key: 'bookkeeping', name: 'Bookkeeping', oliId: 'OLI12345678914800', sub: 'Monthly Books & Accounts',
    meta: ['Monthly bookkeeping'], stage: 2, progress: 90, live: false, pendingExpert: false,
    startedOn: '13/04/2026', lastUpdated: '30/08/2026, 10:00 AM', nextAction: 'Upload 1 pending document',
    remark: 'Books for the current period are being reconciled by our team.',
    expert: 3, lastCall: { date: '30/08/2026', time: '10:00 AM', agent: 'Arjun Mehta' },
    requiredDocs: rd('bookkeeping', false),
    docsSeed: [{ name: 'Bank Statement Apr.pdf', typeLabel: 'PDF', mime: 'application/pdf', date: '03/05/2026, 09:40 AM' }],
    completed: false, completedAt: null, cert: null, feedback: null,
  },
  {
    key: 'afc', name: 'AFC (Annual Filing & Compliance)', oliId: 'OLI12345678914801', sub: 'Annual Filing & Compliance',
    meta: ['Annual compliance'], stage: 1, progress: 30, live: false, pendingExpert: false,
    startedOn: '01/06/2026', lastUpdated: '25/08/2026, 05:45 PM', nextAction: 'Upload 2 pending documents', remark: R.doc,
    expert: 2, lastCall: { date: '25/08/2026', time: '05:45 PM', agent: 'Sneha Iyer' },
    requiredDocs: rd('afc', false), docsSeed: [], completed: false, completedAt: null, cert: null, feedback: null,
  },
  {
    key: 'fssai', name: 'FSSAI License', oliId: 'OLI12345678914802', sub: 'Food Safety License',
    meta: ['Food Safety & Standards Authority of India'], stage: 3, progress: 100, live: false, pendingExpert: false,
    startedOn: '01/05/2026', lastUpdated: '14/07/2026, 11:00 AM', nextAction: '—', remark: R.done,
    expert: 5, lastCall: { date: '10/07/2026', time: '02:00 PM', agent: 'Meera Nair' },
    requiredDocs: rd('fssai', true),
    docsSeed: [{ name: 'Food Safety Plan.pdf', typeLabel: 'PDF', mime: 'application/pdf', date: '08/05/2026, 10:00 AM' }],
    completed: true, completedAt: '14/07/2026 · 11:00 AM',
    cert: { no: 'FSSAI-13260998800123', issuedOn: '14/07/2026' }, feedback: null,
  },
  {
    key: 'tmobj', name: 'Trademark Objection Reply', oliId: 'OLI74021773409602', sub: 'Reply to examination report',
    meta: [], stage: 1, progress: 5, live: false, pendingExpert: true,
    startedOn: '28/08/2026', lastUpdated: '28/08/2026, 06:00 PM', nextAction: 'Awaiting expert assignment (within 24 hrs)',
    remark: R.pending, expert: null, lastCall: null,
    requiredDocs: rd('tmobj', false), docsSeed: [], completed: false, completedAt: null, cert: null, feedback: null,
  },
  {
    key: 'gstreturn', name: 'GST Return Filing (Aug 2026)', oliId: 'OLI74021773409603', sub: 'GSTR-1 & GSTR-3B Filing',
    meta: ['Aug 2026 period'], stage: 1, progress: 5, live: false, pendingExpert: true,
    startedOn: '01/09/2026', lastUpdated: '01/09/2026, 06:00 PM', nextAction: 'Awaiting expert assignment (within 24 hrs)',
    remark: R.pending, expert: null, lastCall: null,
    requiredDocs: rd('gstreturn', false), docsSeed: [], completed: false, completedAt: null, cert: null, feedback: null,
  },
];

const INV = (no, oliId, service, date, amount) => ({ no, oliId, service, date, amount, status: 'Paid' });
export const INVOICES_SEED = [
  INV('OLI/2026/500', 'OLI12345678914797', 'GST Registration', '12/05/2026', '2,499'),
  INV('OLI/2026/507', 'OLI12345678914785', 'Trademark Registration (Class 35)', '02/01/2026', '5,999'),
  INV('OLI/2026/514', 'OLI12345678914786', 'Trademark Registration (Class 25)', '03/02/2026', '5,999'),
  INV('OLI/2026/521', 'OLI12345678914787', 'Trademark Registration (Class 42)', '04/03/2026', '5,999'),
  INV('OLI/2026/528', 'OLI12345678914788', 'Trademark Registration (Class 30)', '05/04/2026', '5,999'),
  INV('OLI/2026/535', 'OLI12345678914789', 'Trademark Registration (Class 41)', '06/05/2026', '5,999'),
  INV('OLI/2026/542', 'OLI12345678914790', 'Trademark Registration (Class 43)', '07/06/2026', '5,999'),
  INV('OLI/2026/549', 'OLI12345678914791', 'Trademark Registration (Class 3)', '08/01/2026', '5,999'),
  INV('OLI/2026/556', 'OLI12345678914792', 'Trademark Registration (Class 9)', '09/02/2026', '5,999'),
  INV('OLI/2026/563', 'OLI12345678914793', 'Trademark Registration (Class 44)', '10/03/2026', '5,999'),
  INV('OLI/2026/570', 'OLI12345678914794', 'Trademark Registration (Class 18)', '11/04/2026', '5,999'),
  INV('OLI/2026/577', 'OLI12345678914795', 'Trademark Registration (Class 37)', '12/05/2026', '5,999'),
  INV('OLI/2026/584', 'OLI12345678914796', 'Trademark Registration (Class 29)', '13/06/2026', '5,999'),
  INV('OLI/2026/591', 'OLI12345698714785', 'ISO Certification (ISO 9001:2015)', '05/05/2026', '7,499'),
  INV('OLI/2026/598', 'OLI12345698714786', 'ISO Certification (ISO 14001:2015)', '06/05/2026', '7,499'),
  INV('OLI/2026/1005', 'OLI12345698714787', 'ISO Certification (ISO 45001:2018)', '07/05/2026', '7,499'),
  INV('OLI/2026/1012', 'OLI12345698714788', 'ISO Certification (ISO 22000:2018)', '08/05/2026', '7,499'),
  INV('OLI/2026/1019', 'OLI12345698714789', 'ISO Certification (ISO 27001:2022)', '09/05/2026', '7,499'),
  INV('OLI/2026/1026', 'OLI12345678914798', 'Company Registration', '20/06/2026', '9,999'),
  INV('OLI/2026/1033', 'OLI12345678914799', 'IEC (Import Export Code)', '05/06/2026', '1,999'),
  INV('OLI/2026/1040', 'OLI12345678914800', 'Bookkeeping', '13/04/2026', '2,999'),
  INV('OLI/2026/1047', 'OLI12345678914801', 'AFC (Annual Filing & Compliance)', '01/06/2026', '4,999'),
  INV('OLI/2026/1054', 'OLI12345678914802', 'FSSAI License', '01/05/2026', '3,499'),
  INV('OLI/2026/1061', 'OLI74021773409602', 'Trademark Objection Reply', '28/08/2026', '3,499'),
  INV('OLI/2026/1068', 'OLI74021773409603', 'GST Return Filing (Aug 2026)', '01/09/2026', '1,499'),
];

const RCPT = (service, oliId, fee, date, ref) => ({ service, oliId, fee, date, ref, status: 'Paid' });
export const RECEIPTS_SEED = [
  RCPT('GST Registration', 'OLI12345678914797', '0', '30/05/2026', 'GST-ARN-AB240626001234'),
  RCPT('Trademark Registration (Class 35)', 'OLI12345678914785', '4,500', '15/03/2026', 'TM-APP-5523417'),
  RCPT('FSSAI Licence', 'OLI12345678914802', '2,000', '20/05/2026', 'FSSAI-APP-99800123'),
  RCPT('ISO Certification (ISO 9001:2015)', 'OLI12345698714785', '1,500', '02/06/2026', 'ISO-APP-9001-44521'),
  RCPT('IEC (Import Export Code)', 'OLI12345678914799', '500', '12/05/2026', 'IEC-DGFT-52114799'),
];

export const EXPLORE_SERVICES = [
  { name: 'Private Company Registration', fee: '2,999', timeline: '10-15 working days' },
  { name: 'Limited Liability Company Registration', fee: '5,499', timeline: '10-15 working days' },
  { name: 'One Person Company Registration', fee: '3,999', timeline: '10-15 working days' },
  { name: 'NIDHI Company Registration', fee: '17,999', timeline: '20-25 working days' },
  { name: 'Food Safety and Standards Authority of India (FSSAI)', fee: '1,999', timeline: '7-10 working days' },
  { name: 'FSSAI License Renewal', fee: '1,999', timeline: '7-10 working days' },
  { name: 'Import Export Code', fee: '1,999', timeline: '3-5 working days' },
  { name: 'Trademark Registration', fee: '5,999', timeline: '15-20 working days' },
  { name: 'Trademark Objection', fee: '3,499', timeline: '7-10 working days' },
  { name: 'GST Registration', fee: '2,499', timeline: '3-7 working days' },
  { name: 'ISO Certification', fee: '7,499', timeline: '10-15 working days' },
  { name: 'Bookkeeping', fee: '2,999', timeline: 'Monthly' },
  { name: 'Annual Filing & Compliance (AFC)', fee: '4,999', timeline: 'Yearly' },
  { name: 'Trademark Renewal', fee: '4,499', timeline: '10-15 working days' },
  { name: 'GST Return Filing', fee: '1,499', timeline: 'Monthly' },
];

const REC = (name, desc, fee, opts = {}) => ({ name, desc, fee, taken: false, reco: false, ...opts });
export const RECOMMENDED = [
  {
    section: 'Business Started', icon: 'rocket',
    items: [
      REC('Incorporation Certificate', 'Establish the legal structure and formal existence of the business.', '9,999'),
      REC('GST Registration', 'GST registration for an eligible business based on applicable requirements.', '2,499', { taken: true }),
      REC('Business Registration License', 'Applicable registration or license required for the business activity.', '1,999'),
      REC('P-Tax', 'Professional tax registration/compliance where applicable.', '1,499'),
      REC('Startup India', 'Recognition and benefits for eligible startups.', '4,999'),
    ],
  },
  {
    section: 'Business Identity', icon: 'fingerprint',
    items: [
      REC('Trademark', 'Protect the business name, logo, brand or distinctive marks.', '5,999', { taken: true }),
      REC('Copyright', 'Protect eligible original creative and intellectual works.', '3,999'),
    ],
  },
  {
    section: 'Business Operations', icon: 'settings',
    items: [
      REC('FSSAI', 'Food businesses may require FSSAI registration or licensing to operate.', '1,999', { reco: true }),
      REC('FSSAI Renewal', 'Renew an existing FSSAI registration or license before expiry.', '1,999', { reco: true }),
      REC('Bookkeeping', 'Maintain regular financial records and business transactions.', '2,999', { taken: true }),
      REC('GST Return', 'Periodic GST return filing based on applicable requirements.', '1,499', { reco: true }),
    ],
  },
  {
    section: 'Business Growth', icon: 'trending',
    items: [
      REC('IEC', 'Import Export Code for eligible import/export activities.', '1,999'),
      REC('ISO', 'Certification that can strengthen process and business credibility.', '7,499', { taken: true }),
      REC('Trademark', 'Continue protecting the brand as the business expands.', '5,999', { taken: true }),
      REC('Copyright', 'Protect original business content and creative assets during growth.', '3,999'),
      REC('Startup India', 'Support eligible businesses seeking startup recognition and benefits.', '4,999'),
    ],
  },
  {
    section: 'Ongoing Compliances', icon: 'calendar',
    items: [
      REC('GST Return', 'Recurring GST filing and compliance.', '1,499'),
      REC('Bookkeeping', 'Continuous maintenance of financial records.', '2,999', { taken: true }),
      REC('Annual Filing Compliances', 'Annual regulatory and financial compliance requirements.', '4,999'),
      REC('FSSAI Renewal', 'Renew the existing FSSAI registration/license when required.', '1,999'),
      REC('P-Tax', 'Ongoing professional tax compliance where applicable.', '1,499'),
    ],
  },
];

export const PROFILE_SEED = {
  name: 'Vamsee Krishna',
  company: 'ABC Foods Private Limited',
  email: 'demo@email.com',
  mobile: '98765 43210',
  altNumber: '91234 56780',
  altPerson: 'Krishna Rao',
  priorityAlt: false,
  cpEnabled: false,
  cpName: '',
  cpDesig: '',
  cpPhone: '',
  cpEmail: '',
};

export const CALLBACKS_SEED = [
  {
    id: 'cb-1', oliId: 'OLI12345678914797', service: 'GST Registration',
    expert: 'Abhik Datta', did: '8012345678',
    requestedAt: '30/06/2026, 11:00 AM', revisedAt: '30/06/2026, 12:00 PM',
    preferred: '2026-07-01 12:00', status: 'Pending',
    remark: 'Need help understanding ARN status.',
    history: [
      { at: '30/06/2026, 11:00 AM', action: 'Requested', detail: 'Preferred 2026-07-01 11:00' },
      { at: '30/06/2026, 12:00 PM', action: 'Revised', detail: 'Preferred updated to 2026-07-01 12:00' },
    ],
  },
  {
    id: 'cb-2', oliId: 'OLI12345678914785', service: 'Trademark Registration',
    expert: 'Priya Sharma', did: '8012345684',
    requestedAt: '20/03/2026, 04:00 PM', revisedAt: '—',
    preferred: '2026-03-21 10:00', status: 'Completed',
    remark: 'Discuss examination report.',
    history: [{ at: '20/03/2026, 04:00 PM', action: 'Requested', detail: 'Preferred 2026-03-21 10:00' }],
  },
];

export const TOUR_SLIDES = [
  { icon: 'dashboard', title: 'Dashboard', text: 'Your home screen shows one-click access to My Services, My Documents, My Certificates and OLI Other Services. The support chatbot lives here only.' },
  { icon: 'services', title: 'My Services', text: 'All services purchased or being processed through Online Legal India, with live progress and status.' },
  { icon: 'detail', title: 'Service Details', text: 'Open any service to see its progress, assigned expert, documents, payments and remarks.' },
  { icon: 'upload', title: 'Upload Documents', text: 'Upload required documents service-wise. Files are stored in your browser and can be previewed or downloaded.' },
  { icon: 'cert', title: 'My Certificates', text: 'Certificates for completed services appear here. View, download or email them.' },
  { icon: 'invoice', title: 'Invoices & Receipts', text: 'OLI Invoices and Govt Receipts are available separately with view and download options.' },
  { icon: 'callback', title: 'Callback Requests', text: 'Request a callback from your assigned expert. Re-requesting revises the existing callback.' },
  { icon: 'explore', title: 'ExploreServices', text: 'Explore and instantly purchase additional services from Online Legal India.' },
  { icon: 'reco', title: 'Recommended Services', text: 'Services recommended for your business journey based on your profile and existing services.' },
  { icon: 'profile', title: 'Profile', text: 'Update your alternative number, alternative person and contact person details.' },
  { icon: 'complaint', title: 'Complaint & Suggestion', text: 'Raise a complaint to our escalation team or share a suggestion to improve your experience.' },
  { icon: 'chat', title: 'Support Chatbot', text: 'Ask the OLI Support bot on the Dashboard for status, invoices, callbacks and more.' },
];

export const CUSTOMER = { name: 'Vamsee Krishna', company: 'ABC Foods Private Limited', mainOli: 'OLI12345678914797' };
