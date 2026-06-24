export interface CKANResource {
  id: string;
  name: string;
  format: 'CSV' | 'JSON' | 'PDF' | 'XLSX';
  url: string;
  size?: string;
  description?: string;
}

export interface CKANDataset {
  id: string;
  title: string;
  notes: string;
  author: string;
  tags: string[];
  resources: CKANResource[];
  organization: {
    name: string;
    title: string;
    description?: string;
  };
  metadataCreated: string;
  metadataModified: string;
  maintainer?: string;
  licenseTitle?: string;
  rowsCount?: number;
  previewData?: Record<string, string | number>[];
}

const mockDatasets: CKANDataset[] = [
  {
    id: 'nigerian-household-income-expenditure-2025',
    title: 'Nigerian Household Income and Expenditure Survey (2025)',
    notes: 'Micro-level survey data capturing household incomes, consumption expenditure, assets, and demographic characteristics across the six geopolitical zones of Nigeria.',
    author: 'NISER Poverty and Social Development Division',
    tags: ['poverty', 'household survey', 'income', 'expenditure', 'nigeria'],
    organization: {
      name: 'niser-poverty-social',
      title: 'Poverty & Social Development Division',
      description: 'Conducting empirical research to inform social welfare, poverty alleviation, and human development policies.',
    },
    metadataCreated: '2025-11-15T09:00:00Z',
    metadataModified: '2026-02-10T14:30:00Z',
    maintainer: 'Data Coordinator, NISER',
    licenseTitle: 'Creative Commons Attribution Share-Alike',
    rowsCount: 15420,
    resources: [
      {
        id: 'res-hies-csv',
        name: 'Household Survey Raw Data',
        format: 'CSV',
        url: '#',
        size: '4.8 MB',
        description: 'Primary raw CSV export containing anonymised household data.',
      },
      {
        id: 'res-hies-pdf',
        name: 'Survey Metadata & Data Dictionary',
        format: 'PDF',
        url: '#',
        size: '1.2 MB',
        description: 'Comprehensive guide to variables, coding structures, and data collection methodology.',
      },
    ],
    previewData: [
      { 'HH_ID': 'HH-2025-001', 'State': 'Oyo', 'Zone': 'South-West', 'Household_Size': 5, 'Monthly_Income_NGN': 250000, 'Food_Exp_Ratio': 0.52 },
      { 'HH_ID': 'HH-2025-002', 'State': 'Kano', 'Zone': 'North-West', 'Household_Size': 8, 'Monthly_Income_NGN': 180000, 'Food_Exp_Ratio': 0.65 },
      { 'HH_ID': 'HH-2025-003', 'State': 'Enugu', 'Zone': 'South-East', 'Household_Size': 4, 'Monthly_Income_NGN': 320000, 'Food_Exp_Ratio': 0.44 },
      { 'HH_ID': 'HH-2025-004', 'State': 'Kaduna', 'Zone': 'North-West', 'Household_Size': 6, 'Monthly_Income_NGN': 210000, 'Food_Exp_Ratio': 0.58 },
      { 'HH_ID': 'HH-2025-005', 'State': 'Delta', 'Zone': 'South-South', 'Household_Size': 5, 'Monthly_Income_NGN': 280000, 'Food_Exp_Ratio': 0.49 },
    ],
  },
  {
    id: 'national-youth-unemployment-trends-2026',
    title: 'National Youth Unemployment & Underemployment Trends',
    notes: 'Quarterly breakdown of employment classifications, occupational changes, and labor supply details among youths aged 18-35 across Nigerian states.',
    author: 'NISER Macroeconomics Division',
    tags: ['unemployment', 'youth', 'labor force', 'employment', 'macroeconomics'],
    organization: {
      name: 'niser-macroeconomics',
      title: 'Macroeconomics Division',
      description: 'Analysing macroeconomic variables, fiscal structures, inflation, and growth patterns in Nigeria.',
    },
    metadataCreated: '2026-01-20T10:15:00Z',
    metadataModified: '2026-05-01T16:00:00Z',
    maintainer: 'Labour Market Unit, NISER',
    licenseTitle: 'Open Data Commons Attribution License',
    rowsCount: 840,
    resources: [
      {
        id: 'res-unemp-csv',
        name: 'Youth Unemployment Quarterly CSV',
        format: 'CSV',
        url: '#',
        size: '850 KB',
        description: 'State-by-state quarterly summary dataset.',
      },
      {
        id: 'res-unemp-json',
        name: 'Youth Unemployment API Format',
        format: 'JSON',
        url: '#',
        size: '520 KB',
        description: 'Formatted JSON object for integration into dashboards.',
      },
    ],
    previewData: [
      { 'Year': 2025, 'Quarter': 'Q1', 'State': 'Lagos', 'Unemployment_Rate_Pct': 18.2, 'Underemployment_Rate_Pct': 12.4 },
      { 'Year': 2025, 'Quarter': 'Q2', 'State': 'Lagos', 'Unemployment_Rate_Pct': 17.9, 'Underemployment_Rate_Pct': 12.1 },
      { 'Year': 2025, 'Quarter': 'Q3', 'State': 'Lagos', 'Unemployment_Rate_Pct': 18.0, 'Underemployment_Rate_Pct': 12.3 },
      { 'Year': 2025, 'Quarter': 'Q4', 'State': 'Lagos', 'Unemployment_Rate_Pct': 17.5, 'Underemployment_Rate_Pct': 11.9 },
    ],
  },
  {
    id: 'southwest-social-safety-net-registry',
    title: 'Southwest Social Safety Net Registry Effectiveness Data',
    notes: 'Program evaluation metrics analyzing cash transfer distributions, community targeting accuracy, and impact assessments of state-sponsored social protection initiatives.',
    author: 'NISER Poverty and Social Development Division',
    tags: ['social safety net', 'cash transfers', 'social protection', 'evaluation'],
    organization: {
      name: 'niser-poverty-social',
      title: 'Poverty & Social Development Division',
      description: 'Conducting empirical research to inform social welfare, poverty alleviation, and human development policies.',
    },
    metadataCreated: '2025-08-05T08:00:00Z',
    metadataModified: '2026-03-12T11:45:00Z',
    maintainer: 'Social Policy Unit, NISER',
    licenseTitle: 'Creative Commons Attribution Share-Alike',
    rowsCount: 2350,
    resources: [
      {
        id: 'res-safety-csv',
        name: 'Safety Net Effectiveness Indicators',
        format: 'CSV',
        url: '#',
        size: '1.4 MB',
        description: 'Primary evaluation indicators and scores.',
      },
    ],
    previewData: [
      { 'Community_ID': 'COM-OYO-01', 'State': 'Oyo', 'Registered_HHs': 420, 'Disbursed_Funds_NGN': 8400000, 'Impact_Score_0_10': 7.8 },
      { 'Community_ID': 'COM-OSUN-03', 'State': 'Osun', 'Registered_HHs': 310, 'Disbursed_Funds_NGN': 6200000, 'Impact_Score_0_10': 8.1 },
      { 'Community_ID': 'COM-EKITI-02', 'State': 'Ekiti', 'Registered_HHs': 280, 'Disbursed_Funds_NGN': 5600000, 'Impact_Score_0_10': 7.5 },
    ],
  },
];

export async function getDatasets(): Promise<CKANDataset[]> {
  return mockDatasets;
}

export async function getDatasetById(id: string): Promise<CKANDataset | null> {
  const dataset = mockDatasets.find((d) => d.id === id);
  return dataset || null;
}
