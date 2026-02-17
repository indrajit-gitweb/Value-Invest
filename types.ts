
export interface Scenario {
  price: number;
  narrative: string;
  growthRate: number;
}

export interface Executive {
  name: string;
  role: string;
  tenure: string;
  background: string;
}

export interface SubHolding {
  name: string;
  percentage: number;
}

export interface Stakeholder {
  name: string;
  equityPercentage: number;
  type: string; // e.g. Promoter, FII, DII, Public
  breakdown?: SubHolding[]; // List of specific funds/individuals within this category
}

export interface ManagementData {
  executives: Executive[];
  stakeholders: Stakeholder[];
  governanceReview: string;
}

export interface Technicals {
  ma200: number;
  ma100: number;
  ma50: number;
  ema21: number;
  support: {
    s1: number;
    s2: number;
    s3: number;
  };
  resistance: {
    r1: number;
    r2: number;
    r3: number;
  };
}

export interface StockSuggestion {
  symbol: string;
  name: string;
  exchange: string;
}

export interface BusinessSegment {
  name: string;
  revenue: number; // Absolute number
  ebitda: number; // Absolute number
  valuationMultiple: number; // EV/EBITDA multiple
  growthRate: number;
  narrative: string;
}

export interface CompoundedGrowth {
  tenYear: string; 
  fiveYear: string;
  threeYear: string;
  recent: string; // TTM for sales/profit, 1Year for Price, Last Year for ROE
}

export interface Peer {
  symbol: string;
  name: string;
  price: number;
  pe: number;
  marketCap: string;
  roe: number;
  dividendYield: number;
}

// --- New Financial Types ---

export interface ProfitLossRow {
  year: string; // "Mar 2023", "TTM", etc.
  sales: string;
  expenses: string;
  operatingProfit: string;
  opm: string; // Percentage string
  otherIncome: string;
  interest: string;
  depreciation: string;
  profitBeforeTax: string;
  tax: string;
  netProfit: string;
  eps: string;
  dividendPayout: string; // Added field
}

export interface BalanceSheetRow {
  year: string;
  equityCapital: string;
  reserves: string;
  borrowings: string;
  otherLiabilities: string;
  totalLiabilities: string;
  fixedAssets: string;
  cwip: string; // Capital Work in Progress
  investments: string;
  otherAssets: string;
  totalAssets: string;
}

export interface CashFlowRow {
  year: string;
  cashFromOperating: string;
  cashFromInvesting: string;
  cashFromFinancing: string;
  netCashFlow: string;
}

export interface EarningsCall {
  date: string;
  quarter: string; // e.g., "Q3 FY24"
  keyTakeaways: string[]; // 3-5 bullet points
  sentiment: 'Positive' | 'Negative' | 'Neutral';
}

export interface NewsInsight {
  title: string;
  summary: string;
  source: string;
  date: string;
  sentiment: 'Positive' | 'Negative' | 'Neutral';
}

// --- New Business Intelligence Types ---

export interface ClientDependency {
  name: string;
  percentage: number; // Estimated % of revenue
  sector: string;
  relationDetails: string; // Added detail: Description of relationship
  isKeyClient: boolean; // Differentiates top/critical clients from the general list
}

export interface GeographicRevenue {
  region: string; // e.g. "India", "North America", "Rest of World"
  percentage: number;
}

export interface ImportExportData {
  exportRevenuePercentage: number;
  importMaterialPercentage: number;
  topExportCountries: string[];
  topImportCountries: string[];
  exportProducts: string[]; // Specific goods exported
  importMaterials: string[]; // Specific raw materials imported
  currencyRisk: string; // e.g., "High - USD Fluctuation"
}

export interface ProductSegmentDetail {
  name: string;
  description: string;
  revenueShare: number; // % contribution
}

export interface CompanyProfile {
  description: string;
  businessModel: string; // B2B, B2C, B2G, etc.
  segments: ProductSegmentDetail[]; // REPLACED simple string array with detailed objects
  clientele: ClientDependency[];
  tradeProfile: ImportExportData;
  geographicSplit: GeographicRevenue[]; // New: Demographics/Revenue by Geography
}

export interface CorporateAction {
  type: string; // Dividend, Split, Bonus, Buyback, Rights
  date: string; // Ex-Date or Announcement Date
  details: string; // e.g., "1:10 Split", "Rs 5/share Dividend"
}

export interface InsiderTrade {
  date: string;
  person: string; // Name of insider/promoter
  type: 'Buy' | 'Sell' | 'Pledge';
  quantity: string;
  price: string;
  value: string; // Total value
}

export interface BlockDeal {
  date: string;
  clientName: string;
  type: 'Buy' | 'Sell';
  quantity: string;
  price: string;
}

export interface RedFlag {
  severity: 'High' | 'Medium' | 'Low';
  category: 'Accounting' | 'Governance' | 'Regulatory' | 'Pledging';
  description: string;
}

export interface MarketActivity {
  corporateActions: CorporateAction[];
  insiderTrading: InsiderTrade[];
  blockDeals: BlockDeal[];
  redFlags: RedFlag[];
  marketSentiment: string; // Overall summary of market mood
}

export interface StockAnalysis {
  symbol: string;
  name: string;
  price: number;
  previousOpen: number; // Opening price of the previous trading session
  previousClose: number;
  openPrice: number;
  high52Week: number;
  low52Week: number;
  currency: string;
  
  // New Header Fields
  listingDate: string;
  faceValue: number;
  bookValue: number;
  marketCapCategory: string; // Large Cap, Mid Cap, Small Cap, Micro Cap
  sector: string;
  industry: string;

  pe: number;
  pb: number;
  dividendYield: number;
  marketCap: string;
  ebitda: string; // Formatted string e.g. "12.5B"
  
  fcfPerShare: number;
  growthRate: number; // Base case growth rate
  discountRate: number;
  terminalRate: number;
  intrinsicValue: number;
  reverseDcfRate: number;
  
  // New Fundamentals
  roce: number;
  roe: number;
  eps: number;
  pat: string;
  freeCashFlow: string; // Total absolute FCF
  opm: number;
  revenue: string;
  revenueGrowth: number;
  sectorPe: number;
  industryPe: number;

  // Growth Tables
  salesGrowth: CompoundedGrowth;
  profitGrowth: CompoundedGrowth;
  stockPriceCagr: CompoundedGrowth;
  roeHistory: CompoundedGrowth;

  // Peer Comparison
  peers: Peer[];

  // Financial Statements
  financials: {
    profitLoss: ProfitLossRow[];
    balanceSheet: BalanceSheetRow[];
    cashFlow: CashFlowRow[];
  };

  // Earnings
  earnings: {
    history: EarningsCall[];
    nextDate: string;
  };

  // Insights
  latestInsights: NewsInsight[];

  // New Profile & Activity Data
  companyProfile: CompanyProfile;
  marketActivity: MarketActivity;

  // New Value Investing Specifics (Graham, Lynch, Greenblatt)
  grahamNumber: number;
  pegRatio: number;
  earningsYield: number;
  debtToEquity: number;
  interestCoverage: number;

  // Additional Classic Models
  grahamGrowthValue: number;
  piotroskiFScore: number;
  evToEbitda: number; // Replaces Altman Z-Score

  // Buffett & Munger Specifics (Moat & Management)
  moatRating: 'Wide' | 'Narrow' | 'None';
  moatSource: string; // e.g., "Network Effect", "Cost Advantage"
  ownerEarningsPerShare: number; // Buffett's adjusted earnings
  buffettTenCapPrice: number; // Price where Owner Earnings yield is 10%
  roic: number; // Return on Invested Capital (Critical for Munger)
  wacc: number; // Weighted Average Cost of Capital
  shareBuybackYield: number; // % of shares repurchased last year (Cannibals)

  // SOTP / Segment Analysis
  segments: BusinessSegment[];
  netDebt: number; // Absolute numerical value for calculation
  totalShares: number; // Total number of outstanding shares

  // Management & Governance
  management: ManagementData;
  
  // Technical Indicators
  technicals: Technicals;

  scenarios: {
    bull: Scenario;
    base: Scenario;
    bear: Scenario;
  };
  growthFactors: string[];
  riskFactors: string[];
  financialReview: string;
  lastUpdated: string;
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
