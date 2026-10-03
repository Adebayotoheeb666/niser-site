const urlBase = process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:10003/wp-json/niser/v1';
const endpoints = [
  { path: '/publications', type: 'Publication' },
  { path: '/researchers', type: 'Researcher' },
  { path: '/insights', type: 'Insight' },
  { path: '/events', type: 'CMSEvent' },
  { path: '/news', type: 'NewsItem' },
  { path: '/divisions', type: 'Division' },
  { path: '/procurement', type: 'ProcurementNotice' },
  { path: '/datasets', type: 'Dataset' },
  { path: '/jobs', type: 'Job' },
  { path: '/internships', type: 'Internship' },
  { path: '/training', type: 'TrainingProgram' },
  { path: '/annual-reports', type: 'AnnualReport' },
  { path: '/partners', type: 'Partner' },
  { path: '/research-centers', type: 'ResearchCenter' },
  { path: '/working-groups', type: 'WorkingGroup' },
  { path: '/governance', type: 'GovernanceMember' },
  { path: '/funding', type: 'FundingOpportunity' },
  { path: '/case-studies', type: 'CaseStudy' },
  { path: '/site-settings', type: 'SiteSetting' },
  { path: '/settings', type: 'SiteSetting' },
  { path: '/researcher-contact-template', type: 'ContactTemplate' },
  { path: '/contact-template', type: 'ContactTemplate' },
];
const requiredFields = {
  Publication: ['id','title','slug','publicationType','authors','researchDivision','abstract','publishedYear','isOpenAccess','status'],
  Researcher: ['id','fullName','slug','position','division','isActive','status'],
  Insight: ['id','title','slug','contentType','publishedDate','status'],
  CMSEvent: ['id','title','slug','eventType','startDate','isOnline','status'],
  NewsItem: ['id','title','slug','publishedDate','category','status'],
  Division: ['id','name','slug','status'],
  ProcurementNotice: ['id','title','slug','noticeType','issueDate','status'],
  Dataset: ['id','title','notes','author','resources','metadataCreated','metadataModified'],
  Job: ['id','title','slug','department','level','jobType','location','postedDate','closingDate','isActive','status'],
  Internship: ['id','title','slug','department','duration','closingDate','isActive','status'],
  TrainingProgram: ['id','title','slug','programType','trainingStatus','status'],
  AnnualReport: ['id','title','slug','year','status'],
  Partner: ['id','name','slug','partnerType','isActive','status'],
  ResearchCenter: ['id','name','slug','status'],
  WorkingGroup: ['id','title','slug','isActive','status'],
  GovernanceMember: ['id','name','slug','roleType','status'],
  FundingOpportunity: ['id','title','slug','fundingType','isActive','status'],
  CaseStudy: ['id','title','slug','status'],
  SiteSetting: [],
  ContactTemplate: [],
};
async function fetchJson(path) {
  const url = `${urlBase}${path}`;
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = text; }
  return { res, data };
}
function checkFields(item, required) {
  const missing = [];
  if (!item || typeof item !== 'object') return required.slice();
  for (const field of required) {
    if (!(field in item) || item[field] === null || item[field] === undefined || (typeof item[field] === 'string' && item[field].trim() === '')) {
      missing.push(field);
    }
  }
  return missing;
}
function sampleDetailFromArray(arr) { return Array.isArray(arr) && arr.length ? arr[0] : null; }
async function run() {
  console.log('CMS audit base URL:', urlBase);
  for (const ep of endpoints) {
    console.log('\n=== ' + ep.path + ' ===');
    try {
      const { res, data } = await fetchJson(ep.path);
      console.log('status', res.status, res.statusText);
      if (!res.ok) {
        console.log('ERROR:', typeof data === 'string' ? data.slice(0, 400) : JSON.stringify(data).slice(0, 400));
        continue;
      }
      const isArray = Array.isArray(data);
      console.log('type', isArray ? 'array' : typeof data);
      if (Array.isArray(data)) console.log('count', data.length);
      const required = requiredFields[ep.type] || [];
      if (Array.isArray(data) && data.length && required.length) {
        const sample = sampleDetailFromArray(data);
        console.log('sample missing', checkFields(sample, required).join(', ') || 'none');
        console.log('sample keys', Object.keys(sample).slice(0, 30).join(', '));
      } else if (!Array.isArray(data) && required.length) {
        console.log('object missing', checkFields(data, required).join(', ') || 'none');
        if (data && typeof data === 'object') console.log('keys', Object.keys(data).slice(0, 30).join(', '));
      }
      if (Array.isArray(data) && data.length && ['Publication','Researcher','Insight','CMSEvent','NewsItem','Division','Job','Internship','TrainingProgram','AnnualReport','Partner','ResearchCenter','WorkingGroup','GovernanceMember','FundingOpportunity','CaseStudy'].includes(ep.type)) {
        const sample = sampleDetailFromArray(data);
        if (sample && sample.slug) {
          const slugRes = await fetchJson(`${ep.path}/${encodeURIComponent(sample.slug)}`);
          console.log('detail', ep.path + '/' + sample.slug, 'status', slugRes.res.status, slugRes.res.statusText);
          if (slugRes.res.ok && typeof slugRes.data === 'object') {
            console.log('detail missing', checkFields(slugRes.data, requiredFields[ep.type]).join(', ') || 'none');
            console.log('detail keys', Object.keys(slugRes.data).slice(0, 40).join(', '));
          }
        }
      }
    } catch (err) {
      console.log('FETCH ERROR:', err.message);
    }
  }
}
run().catch(err => { console.error('Audit failed:', err); process.exit(1); });
