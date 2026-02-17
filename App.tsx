
import React, { useState } from 'react';
import { analyzeStock } from './services/geminiService';
import { StockAnalysis, LoadingState } from './types';
import StockSearch from './components/StockSearch';
import MetricsCard from './components/MetricsCard';
import DCFCalculator from './components/DCFCalculator';
import SotpCalculator from './components/SotpCalculator';
import AnalysisView from './components/AnalysisView';
import LoadingView from './components/LoadingView';
import ManagementView from './components/ManagementView';
import TechnicalsView from './components/TechnicalsView';
import FinancialsView from './components/FinancialsView';
import EarningsView from './components/EarningsView';
import NewsInsightsView from './components/NewsInsightsView';
import CompanyProfileView from './components/CompanyProfileView';
import MarketActivityView from './components/MarketActivityView';
import { Wallet, TrendingUp, Activity, PieChart, AlertCircle, BarChart3, Scale, ShieldCheck, Calculator, Crown, Zap, Info, ArrowUpRight, Percent, ArrowDown, ArrowUp, Calendar, CreditCard, Book, Building2, Users, AlertTriangle } from 'lucide-react';

const App: React.FC = () => {
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [data, setData] = useState<StockAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [analyzingToken, setAnalyzingToken] = useState<string>('');

  const handleSearch = async (query: string, reportType: string) => {
    setLoadingState(LoadingState.LOADING);
    setAnalyzingToken(query);
    setError(null);
    setData(null);

    try {
      const result = await analyzeStock(query, reportType);
      setData(result);
      setLoadingState(LoadingState.SUCCESS);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze stock. Please try again.');
      setLoadingState(LoadingState.ERROR);
    }
  };

  const getFScoreColor = (score: number) => {
    if (score >= 7) return 'text-emerald-400';
    if (score >= 4) return 'text-amber-400';
    return 'text-red-400';
  };

  const getEvEbitdaColor = (ratio: number) => {
    if (ratio < 10) return 'text-emerald-400';
    if (ratio < 20) return 'text-amber-400';
    return 'text-red-400';
  };

  // Helper to calculate premium/discount
  const getValuationInsight = (targetPrice: number, currentPrice: number) => {
    const diff = ((currentPrice - targetPrice) / targetPrice) * 100;
    const isUndervalued = currentPrice < targetPrice;
    return {
      diff: Math.abs(diff).toFixed(1),
      isUndervalued,
      label: isUndervalued ? 'Discount' : 'Premium'
    };
  };

  return (
    <div className="min-h-screen pb-20 bg-[#0f172a] text-slate-200">
      {/* Header */}
      <header className="border-b border-slate-800 bg-[#0f172a]/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              ValueInvest Pro
            </h1>
          </div>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-400">
            <a href="#" className="hover:text-white transition-colors">Calculator</a>
            <a href="#" className="hover:text-white transition-colors">Methodology</a>
            <a href="#" className="hover:text-white transition-colors">About</a>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Hero / Search Section */}
        <div className={`transition-all duration-500 ${data || loadingState === LoadingState.LOADING ? 'mb-8' : 'min-h-[60vh] flex flex-col justify-center'}`}>
          {!data && loadingState !== LoadingState.LOADING && (
            <div className="text-center mb-10">
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
                Master the Art of <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                  Value Investing
                </span>
              </h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                Instant intrinsic value calculations, DCF analysis, and comprehensive financial breakdowns powered by AI and real-time data.
              </p>
            </div>
          )}
          
          <StockSearch onSearch={handleSearch} isLoading={loadingState === LoadingState.LOADING} />

          {loadingState === LoadingState.LOADING && (
            <LoadingView symbol={analyzingToken} />
          )}

          {loadingState === LoadingState.ERROR && (
            <div className="max-w-2xl mx-auto mt-4 p-4 bg-red-900/20 border border-red-900/50 rounded-lg flex items-center gap-3 text-red-300">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>{error}</p>
            </div>
          )}
        </div>

        {/* Results Dashboard */}
        {data && loadingState === LoadingState.SUCCESS && (
          <div className="animate-fade-in space-y-8">
            {/* Header Info */}
            <div className="border-b border-slate-800 pb-6">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-slate-700 text-slate-300 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide">
                      {data.marketCapCategory}
                    </span>
                    <span className="text-slate-500 text-xs flex items-center gap-1">
                      <Building2 className="w-3 h-3" /> {data.sector} • {data.industry}
                    </span>
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-1">{data.name}</h2>
                  <div className="flex items-center gap-3 text-slate-400">
                    <span className="font-mono bg-slate-800 px-2 py-0.5 rounded text-sm text-blue-400">{data.symbol}</span>
                    <span>•</span>
                    <span>{data.currency}</span>
                    <span>•</span>
                    <span className="text-xs">Updated: {data.lastUpdated}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-400 mb-1">Current Price</p>
                  <div className="text-4xl font-bold text-white tracking-tight">
                    {data.currency} {data.price}
                  </div>
                </div>
              </div>
              
              {/* Detailed Price Grid with New Fields */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 bg-slate-800/30 rounded-lg p-4">
                 <div>
                   <p className="text-xs text-slate-500 uppercase">Market Cap</p>
                   <p className="text-lg font-mono font-medium text-slate-200">{data.currency} {data.marketCap}</p>
                 </div>
                 <div>
                   <p className="text-xs text-slate-500 uppercase">Dividend Yield</p>
                   <div className="flex items-center gap-1">
                     <Percent className="w-3 h-3 text-emerald-500" />
                     <p className="text-lg font-mono font-medium text-slate-200">{data.dividendYield}%</p>
                   </div>
                 </div>
                 <div>
                   <p className="text-xs text-slate-500 uppercase">Face Value</p>
                   <div className="flex items-center gap-1">
                      <CreditCard className="w-3 h-3 text-slate-400" />
                      <p className="text-lg font-mono font-medium text-slate-200">{data.faceValue}</p>
                   </div>
                 </div>
                  <div>
                   <p className="text-xs text-slate-500 uppercase">Book Value</p>
                   <div className="flex items-center gap-1">
                      <Book className="w-3 h-3 text-slate-400" />
                      <p className="text-lg font-mono font-medium text-slate-200">{data.bookValue}</p>
                   </div>
                 </div>
                 <div className="col-span-2 md:col-span-1">
                   <p className="text-xs text-slate-500 uppercase">Listed Date</p>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <p className="text-lg font-mono font-medium text-slate-200 truncate">{data.listingDate}</p>
                   </div>
                 </div>
                 {/* Row 2: Price stats */}
                 <div>
                   <p className="text-xs text-slate-500 uppercase">52W High</p>
                   <div className="flex items-center gap-1">
                     <ArrowUp className="w-3 h-3 text-emerald-500" />
                     <p className="text-lg font-mono font-medium text-slate-200">{data.high52Week}</p>
                   </div>
                 </div>
                 <div>
                   <p className="text-xs text-slate-500 uppercase">52W Low</p>
                    <div className="flex items-center gap-1">
                     <ArrowDown className="w-3 h-3 text-red-500" />
                     <p className="text-lg font-mono font-medium text-slate-200">{data.low52Week}</p>
                   </div>
                 </div>
                 <div>
                   <p className="text-xs text-slate-500 uppercase">Open</p>
                   <p className="text-lg font-mono font-medium text-slate-200">{data.openPrice}</p>
                 </div>
                 <div>
                   <p className="text-xs text-slate-500 uppercase">Prev Close</p>
                   <p className="text-lg font-mono font-medium text-slate-200">{data.previousClose}</p>
                 </div>
              </div>
            </div>

            {/* NEW: Company Profile & Business Details */}
            <CompanyProfileView data={data.companyProfile} />

            {/* Management & Governance Section */}
            <ManagementView data={data.management} />

            {/* Top Metrics Grid (Valuation & Growth) */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <MetricsCard 
                label="P/E Ratio" 
                value={data.pe} 
                subValue={data.pe > 25 ? "Premium Valuation" : data.pe < 15 ? "Potential Value" : "Fair Value"}
                icon={<PieChart className="w-5 h-5" />}
                color="blue"
              />
              <MetricsCard 
                label="P/B Ratio" 
                value={data.pb} 
                icon={<Activity className="w-5 h-5" />}
                color="purple"
              />
               <MetricsCard 
                label="Dividend Yield" 
                value={`${data.dividendYield}%`} 
                subValue={data.dividendYield > 3 ? "High Yield" : "Standard"}
                icon={<Percent className="w-5 h-5" />}
                color="emerald"
              />
               <MetricsCard 
                label="EBITDA" 
                value={data.ebitda} 
                icon={<BarChart3 className="w-5 h-5" />}
                color="indigo"
              />
              <MetricsCard 
                label="PEG Ratio" 
                value={data.pegRatio} 
                subValue={data.pegRatio < 1 ? "Undervalued (<1.0)" : "Fair/Overvalued"}
                trend={data.pegRatio < 1 ? 'up' : 'neutral'}
                icon={<Calculator className="w-5 h-5" />}
                color="amber"
              />
              <MetricsCard 
                label="Intrinsic Value" 
                value={data.intrinsicValue.toFixed(2)} 
                subValue={`Upside: ${((data.intrinsicValue - data.price) / data.price * 100).toFixed(1)}%`}
                trend={data.intrinsicValue > data.price ? 'up' : 'down'}
                icon={<Wallet className="w-5 h-5" />}
                color={data.intrinsicValue > data.price ? 'emerald' : 'red'}
              />
            </div>
            
            {/* NEW: Market Activity (Corporate Actions, Insider, Blocks, Red Flags) */}
            <MarketActivityView data={data.marketActivity} />

            {/* Technical Indicators */}
            <TechnicalsView data={data.technicals} currentPrice={data.price} currency={data.currency} />

             {/* Buffett & Munger Quality Check */}
             <div>
              <h3 className="text-lg font-bold text-white mb-4 mt-6 flex items-center gap-2">
                <Crown className="w-5 h-5 text-yellow-400" />
                Buffett & Munger Quality Check
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Economic Moat (Defensibility) */}
                <div className={`bg-slate-800/50 border rounded-xl p-5 relative overflow-hidden flex flex-col justify-between ${
                  data.moatRating === 'Wide' ? 'border-emerald-500/30' : 
                  data.moatRating === 'Narrow' ? 'border-amber-500/30' : 
                  'border-slate-700'
                }`}>
                   <div>
                     <h4 className="text-slate-400 text-sm font-medium mb-1 flex items-center gap-2">
                       <ShieldCheck className="w-4 h-4" /> Economic Moat
                     </h4>
                     <div className="flex items-center gap-2 mb-2">
                       <span className={`text-2xl font-bold ${
                         data.moatRating === 'Wide' ? 'text-emerald-400' : 
                         data.moatRating === 'Narrow' ? 'text-amber-400' : 'text-slate-400'
                       }`}>{data.moatRating}</span>
                     </div>
                     <p className="text-xs text-slate-300 bg-slate-800 inline-block px-2 py-1 rounded border border-slate-700">
                        {data.moatSource}
                     </p>
                   </div>
                   <div className="mt-4 pt-3 border-t border-slate-700/50">
                     <p className="text-xs text-slate-400 leading-relaxed">
                       A durable advantage (brand, monopoly, low cost) that protects profits from competitors.
                     </p>
                   </div>
                </div>

                {/* Owner Earnings Yield (Price Check) */}
                {(() => {
                   // Calculate Owner Earnings Yield: (Owner Earnings Per Share / Current Price) * 100
                   const ownerYield = (data.ownerEarningsPerShare / data.price) * 100;
                   const isAttractive = ownerYield > 5; // General benchmark, though >10% is the golden rule
                   
                   return (
                    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 flex flex-col justify-between">
                       <div>
                         <div className="flex justify-between items-start mb-1">
                           <h4 className="text-slate-400 text-sm font-medium flex items-center gap-2">
                              <Wallet className="w-4 h-4" /> Owner Earnings Yield
                           </h4>
                         </div>
                         <div className="flex items-baseline gap-2 mb-1">
                            <div className={`text-2xl font-bold ${isAttractive ? 'text-emerald-400' : 'text-amber-400'}`}>
                                {ownerYield.toFixed(2)}%
                            </div>
                            <span className="text-xs text-slate-500">yield</span>
                         </div>
                         
                         {/* Visual Progress Bar for Yield */}
                         <div className="w-full h-2 bg-slate-700 rounded-full mt-2 mb-1 overflow-hidden">
                            <div 
                                className={`h-full rounded-full ${ownerYield > 8 ? 'bg-emerald-500' : ownerYield > 4 ? 'bg-amber-400' : 'bg-red-400'}`} 
                                style={{ width: `${Math.min(ownerYield * 10, 100)}%` }} // Visual scale maxing at 10%
                            ></div>
                         </div>
                         <div className="flex justify-between text-[10px] text-slate-500">
                            <span>0%</span>
                            <span>Risk Free (4.5%)</span>
                            <span>10%+</span>
                         </div>
                       </div>
                       
                       <div className="mt-3 pt-3 border-t border-slate-700/50">
                          <p className="text-xs text-slate-400 leading-relaxed">
                            If you bought the whole company today, you'd get a <strong>{ownerYield.toFixed(1)}%</strong> annual return in cash. Buffett prefers this > Risk Free Rate.
                          </p>
                       </div>
                    </div>
                   );
                })()}

                {/* The Compounding Engine (ROIC vs WACC) */}
                {(() => {
                    // Spread calculation
                    const spread = data.roic - data.wacc;
                    const isCreatingValue = spread > 0;

                    return (
                        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 flex flex-col justify-between">
                        <div>
                            <h4 className="text-slate-400 text-sm font-medium mb-1 flex items-center gap-2">
                                <Zap className="w-4 h-4" /> Compounding Engine
                            </h4>
                            <div className="flex items-center gap-3 mb-2">
                                <div>
                                    <span className="text-xs text-slate-500 block">ROIC</span>
                                    <span className="text-lg font-bold text-white">{data.roic}%</span>
                                </div>
                                <ArrowUpRight className="text-slate-600" />
                                <div>
                                    <span className="text-xs text-slate-500 block">WACC (Cost)</span>
                                    <span className="text-lg font-bold text-slate-300">{data.wacc}%</span>
                                </div>
                            </div>
                            
                            <div className={`text-sm font-bold px-2 py-1 rounded inline-block ${isCreatingValue ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                {isCreatingValue ? 'Creating Value' : 'Destroying Value'} (+{spread.toFixed(1)}%)
                            </div>
                        </div>
                        <div className="mt-2 pt-3 border-t border-slate-700/50">
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Munger's favorite. The company earns <strong>{data.roic}%</strong> on its investments while paying only <strong>{data.wacc}%</strong> to borrow money. This spread drives long-term growth.
                            </p>
                        </div>
                        </div>
                    );
                })()}
              </div>
            </div>

            {/* Classic Valuation Models Comparison */}
            <div>
              <h3 className="text-lg font-bold text-white mb-4 mt-6 flex items-center gap-2">
                <Scale className="w-5 h-5 text-indigo-400" />
                Classic Valuation Models
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Graham Number Enhanced */}
                {(() => {
                  const insight = getValuationInsight(data.grahamNumber, data.price);
                  return (
                    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 hover:border-slate-600 transition-colors flex flex-col justify-between">
                       <div>
                         <div className="flex justify-between items-start mb-1">
                            <h4 className="text-slate-400 text-sm font-medium">Graham Number</h4>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide ${insight.isUndervalued ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                              {insight.label}
                            </span>
                         </div>
                         <div className={`text-2xl font-bold mb-1 ${insight.isUndervalued ? 'text-emerald-400' : 'text-red-400'}`}>
                           {data.currency} {data.grahamNumber.toFixed(2)}
                         </div>
                         <p className="text-xs text-slate-500 mb-3">Limit: Sqrt(22.5 × EPS × BVPS)</p>
                       </div>
                       
                       <div className="mt-2 pt-3 border-t border-slate-700/50">
                         <div className="flex gap-2 items-start">
                           <Info className="w-3 h-3 text-blue-400 mt-0.5 shrink-0" />
                           <p className="text-xs text-slate-400 leading-relaxed">
                             <strong className="text-slate-300">Relevance:</strong> The theoretical maximum price for a defensive investor. 
                             Stock is trading at a <span className="text-slate-200">{insight.diff}% {insight.label}</span> to this conservative limit.
                           </p>
                         </div>
                       </div>
                    </div>
                  );
                })()}
                
                {/* Graham Growth Value Enhanced */}
                {(() => {
                   const insight = getValuationInsight(data.grahamGrowthValue, data.price);
                   return (
                    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 hover:border-slate-600 transition-colors flex flex-col justify-between">
                       <div>
                         <div className="flex justify-between items-start mb-1">
                            <h4 className="text-slate-400 text-sm font-medium">Graham Growth Value</h4>
                             <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide ${insight.isUndervalued ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                              {insight.label}
                            </span>
                         </div>
                         <div className={`text-2xl font-bold mb-1 ${insight.isUndervalued ? 'text-emerald-400' : 'text-red-400'}`}>
                           {data.currency} {data.grahamGrowthValue.toFixed(2)}
                         </div>
                         <p className="text-xs text-slate-500 mb-3">Formula: EPS × (8.5 + 2g)</p>
                       </div>

                       <div className="mt-2 pt-3 border-t border-slate-700/50">
                         <div className="flex gap-2 items-start">
                           <Info className="w-3 h-3 text-blue-400 mt-0.5 shrink-0" />
                           <p className="text-xs text-slate-400 leading-relaxed">
                             <strong className="text-slate-300">Relevance:</strong> Graham's formula for valuing growth companies. 
                             Currently trading at a <span className="text-slate-200">{insight.diff}% {insight.label}</span> based on earnings potential.
                           </p>
                         </div>
                       </div>
                    </div>
                   );
                })()}

                {/* Earnings Yield */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 hover:border-slate-600 transition-colors flex flex-col justify-between">
                   <div>
                     <h4 className="text-slate-400 text-sm font-medium mb-1">Earnings Yield (Greenblatt)</h4>
                     <div className="text-2xl font-bold text-white mb-1">{data.earningsYield}%</div>
                     <p className="text-xs text-slate-500 mb-3">EBIT / EV. Higher is better.</p>
                   </div>
                   <div className="mt-2 pt-3 border-t border-slate-700/50">
                     <div className="flex gap-2 items-start">
                       <Info className="w-3 h-3 text-blue-400 mt-0.5 shrink-0" />
                       <p className="text-xs text-slate-400 leading-relaxed">
                          <strong className="text-slate-300">Relevance:</strong> Shows how much the business earns relative to its purchase price. A high yield ({'>'}10%) suggests a bargain.
                       </p>
                     </div>
                   </div>
                </div>

                {/* Lynch Fair Value */}
                {(() => {
                   const lynchValue = data.eps * data.revenueGrowth;
                   const insight = getValuationInsight(lynchValue, data.price);
                   return (
                     <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 hover:border-slate-600 transition-colors flex flex-col justify-between">
                       <div>
                         <div className="flex justify-between items-start mb-1">
                           <h4 className="text-slate-400 text-sm font-medium">Lynch Fair Value</h4>
                           <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide ${insight.isUndervalued ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                              {insight.label}
                            </span>
                         </div>
                         <div className={`text-2xl font-bold mb-1 ${insight.isUndervalued ? 'text-emerald-400' : 'text-red-400'}`}>
                           {data.currency} {lynchValue.toFixed(2)}
                         </div>
                         <p className="text-xs text-slate-500 mb-3">Implied PEG = 1.0</p>
                       </div>
                       <div className="mt-2 pt-3 border-t border-slate-700/50">
                         <div className="flex gap-2 items-start">
                           <Info className="w-3 h-3 text-blue-400 mt-0.5 shrink-0" />
                           <p className="text-xs text-slate-400 leading-relaxed">
                              <strong className="text-slate-300">Relevance:</strong> Peter Lynch loved stocks where the P/E ratio roughly equaled the Growth Rate (PEG Ratio of 1).
                           </p>
                         </div>
                       </div>
                    </div>
                   );
                })()}

                {/* Piotroski F-Score */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 hover:border-slate-600 transition-colors flex flex-col justify-between">
                   <div>
                     <h4 className="text-slate-400 text-sm font-medium mb-1">Piotroski F-Score</h4>
                     <div className={`text-2xl font-bold mb-1 ${getFScoreColor(data.piotroskiFScore)}`}>
                       {data.piotroskiFScore} / 9
                     </div>
                     <p className="text-xs text-slate-500 mb-3">Financial Strength (7-9 is Strong).</p>
                   </div>
                   <div className="mt-2 pt-3 border-t border-slate-700/50">
                     <div className="flex gap-2 items-start">
                       <Info className="w-3 h-3 text-blue-400 mt-0.5 shrink-0" />
                       <p className="text-xs text-slate-400 leading-relaxed">
                          <strong className="text-slate-300">Relevance:</strong> A 9-point system to find financially strong companies. High scores historically outperform the market.
                       </p>
                     </div>
                   </div>
                </div>

                {/* EV / EBITDA */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 hover:border-slate-600 transition-colors flex flex-col justify-between">
                   <div>
                     <h4 className="text-slate-400 text-sm font-medium mb-1">EV / EBITDA</h4>
                     <div className={`text-2xl font-bold mb-1 ${getEvEbitdaColor(data.evToEbitda)}`}>
                       {data.evToEbitda.toFixed(2)}x
                     </div>
                     <p className="text-xs text-slate-500 mb-3">Valuation Multiple ({'<'}10 is Cheap).</p>
                   </div>
                   <div className="mt-2 pt-3 border-t border-slate-700/50">
                     <div className="flex gap-2 items-start">
                       <Info className="w-3 h-3 text-blue-400 mt-0.5 shrink-0" />
                       <p className="text-xs text-slate-400 leading-relaxed">
                          <strong className="text-slate-300">Relevance:</strong> A capital-structure neutral metric. Better than P/E for comparing companies with different debt levels.
                       </p>
                     </div>
                   </div>
                </div>
              </div>
            </div>

             {/* Solvency & Risk (Graham/Marks) */}
            <div>
              <h3 className="text-lg font-bold text-white mb-4 mt-6 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-red-400" />
                Solvency & Risk (Margin of Safety)
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                 <MetricsCard 
                  label="Debt / Equity" 
                  value={data.debtToEquity} 
                  subValue={data.debtToEquity < 1 ? "Healthy Balance Sheet" : "High Leverage"}
                  trend={data.debtToEquity < 1 ? 'up' : 'down'}
                  color="red" 
                />
                 <MetricsCard 
                  label="Interest Coverage" 
                  value={data.interestCoverage} 
                  subValue={data.interestCoverage > 5 ? "Safe" : "Risky"}
                  color="red" 
                />
                 <MetricsCard label="ROCE" value={`${data.roce}%`} color="emerald" />
                 <MetricsCard label="ROE" value={`${data.roe}%`} color="emerald" />
              </div>
            </div>

             {/* Fundamental Ratios & Growth Tables */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-white mb-4 mt-6 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-400" />
                Profitability & Growth
              </h3>
              
              {/* Ratio Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricsCard label="OPM" value={`${data.opm}%`} color="emerald" />
                <MetricsCard label="EPS" value={data.eps} color="blue" />
                <MetricsCard 
                  label="Revenue Growth" 
                  value={`${data.revenueGrowth}%`} 
                  trend={data.revenueGrowth > 10 ? 'up' : 'neutral'} 
                  color="amber" 
                />
                <MetricsCard 
                  label="Industry PE" 
                  value={data.industryPe} 
                  subValue={data.pe < data.industryPe ? "Cheaper than peers" : "Premium to peers"}
                  trend={data.pe < data.industryPe ? 'up' : 'down'}
                  color="purple" 
                />
              </div>

              {/* Compounded Growth Tables */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                 
                 {/* Compounded Sales Growth */}
                 <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
                    <h4 className="text-sm font-bold text-slate-300 mb-3 border-b border-slate-700/50 pb-2">Compounded Sales Growth</h4>
                    <div className="space-y-2 text-sm">
                       <div className="flex justify-between text-slate-400">
                          <span>10 Years:</span>
                          <span className="text-white font-mono">{data.salesGrowth.tenYear}</span>
                       </div>
                       <div className="flex justify-between text-slate-400">
                          <span>5 Years:</span>
                          <span className="text-white font-mono">{data.salesGrowth.fiveYear}</span>
                       </div>
                       <div className="flex justify-between text-slate-400">
                          <span>3 Years:</span>
                          <span className="text-white font-mono">{data.salesGrowth.threeYear}</span>
                       </div>
                       <div className="flex justify-between text-slate-400">
                          <span>TTM:</span>
                          <span className="text-white font-mono">{data.salesGrowth.recent}</span>
                       </div>
                    </div>
                 </div>

                 {/* Compounded Profit Growth */}
                 <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
                    <h4 className="text-sm font-bold text-slate-300 mb-3 border-b border-slate-700/50 pb-2">Compounded Profit Growth</h4>
                    <div className="space-y-2 text-sm">
                       <div className="flex justify-between text-slate-400">
                          <span>10 Years:</span>
                          <span className="text-white font-mono">{data.profitGrowth.tenYear}</span>
                       </div>
                       <div className="flex justify-between text-slate-400">
                          <span>5 Years:</span>
                          <span className="text-white font-mono">{data.profitGrowth.fiveYear}</span>
                       </div>
                       <div className="flex justify-between text-slate-400">
                          <span>3 Years:</span>
                          <span className="text-white font-mono">{data.profitGrowth.threeYear}</span>
                       </div>
                       <div className="flex justify-between text-slate-400">
                          <span>TTM:</span>
                          <span className="text-white font-mono">{data.profitGrowth.recent}</span>
                       </div>
                    </div>
                 </div>

                 {/* Stock Price CAGR */}
                 <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
                    <h4 className="text-sm font-bold text-slate-300 mb-3 border-b border-slate-700/50 pb-2">Stock Price CAGR</h4>
                    <div className="space-y-2 text-sm">
                       <div className="flex justify-between text-slate-400">
                          <span>10 Years:</span>
                          <span className="text-white font-mono">{data.stockPriceCagr.tenYear}</span>
                       </div>
                       <div className="flex justify-between text-slate-400">
                          <span>5 Years:</span>
                          <span className="text-white font-mono">{data.stockPriceCagr.fiveYear}</span>
                       </div>
                       <div className="flex justify-between text-slate-400">
                          <span>3 Years:</span>
                          <span className="text-white font-mono">{data.stockPriceCagr.threeYear}</span>
                       </div>
                       <div className="flex justify-between text-slate-400">
                          <span>1 Year:</span>
                          <span className="text-white font-mono">{data.stockPriceCagr.recent}</span>
                       </div>
                    </div>
                 </div>

                 {/* Return on Equity */}
                 <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
                    <h4 className="text-sm font-bold text-slate-300 mb-3 border-b border-slate-700/50 pb-2">Return on Equity</h4>
                    <div className="space-y-2 text-sm">
                       <div className="flex justify-between text-slate-400">
                          <span>10 Years:</span>
                          <span className="text-white font-mono">{data.roeHistory.tenYear}</span>
                       </div>
                       <div className="flex justify-between text-slate-400">
                          <span>5 Years:</span>
                          <span className="text-white font-mono">{data.roeHistory.fiveYear}</span>
                       </div>
                       <div className="flex justify-between text-slate-400">
                          <span>3 Years:</span>
                          <span className="text-white font-mono">{data.roeHistory.threeYear}</span>
                       </div>
                       <div className="flex justify-between text-slate-400">
                          <span>Last Year:</span>
                          <span className="text-white font-mono">{data.roeHistory.recent}</span>
                       </div>
                    </div>
                 </div>
              </div>

               {/* Peer Comparison Table */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mt-8">
                 <div className="flex items-center gap-2 mb-4">
                    <Users className="w-5 h-5 text-indigo-400" />
                    <h3 className="text-lg font-bold text-white">Peer Comparison</h3>
                 </div>
                 <div className="overflow-x-auto rounded-lg border border-slate-700/50">
                    <table className="w-full text-sm text-left">
                       <thead className="text-xs text-slate-400 uppercase bg-slate-900/50">
                          <tr>
                             <th className="px-4 py-3">Company</th>
                             <th className="px-4 py-3 text-right">Price</th>
                             <th className="px-4 py-3 text-right">P/E</th>
                             <th className="px-4 py-3 text-right">Market Cap</th>
                             <th className="px-4 py-3 text-right">ROE %</th>
                             <th className="px-4 py-3 text-right">Div Yield %</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-700/50">
                          {/* Current Stock */}
                          <tr className="bg-blue-900/20 hover:bg-blue-900/30">
                             <td className="px-4 py-3 font-bold text-white">{data.name}</td>
                             <td className="px-4 py-3 text-right font-mono text-white">{data.currency} {data.price}</td>
                             <td className="px-4 py-3 text-right font-mono text-white">{data.pe}x</td>
                             <td className="px-4 py-3 text-right font-mono text-white">{data.marketCap}</td>
                             <td className="px-4 py-3 text-right font-mono text-emerald-400">{data.roe}%</td>
                             <td className="px-4 py-3 text-right font-mono text-amber-400">{data.dividendYield}%</td>
                          </tr>
                          {/* Peers */}
                          {data.peers && data.peers.length > 0 ? (
                            data.peers.map((peer, idx) => (
                               <tr key={idx} className="bg-slate-800/30 hover:bg-slate-700/30 transition-colors">
                                  <td className="px-4 py-3 font-medium text-slate-300">
                                     {peer.name} <span className="text-xs text-slate-500 block">{peer.symbol}</span>
                                  </td>
                                  <td className="px-4 py-3 text-right font-mono text-slate-300">{data.currency} {peer.price}</td>
                                  <td className="px-4 py-3 text-right font-mono text-slate-300">{peer.pe}x</td>
                                  <td className="px-4 py-3 text-right font-mono text-slate-300">{peer.marketCap}</td>
                                  <td className="px-4 py-3 text-right font-mono text-emerald-500/80">{peer.roe}%</td>
                                  <td className="px-4 py-3 text-right font-mono text-amber-500/80">{peer.dividendYield}%</td>
                               </tr>
                            ))
                          ) : (
                             <tr>
                                <td colSpan={6} className="px-4 py-3 text-center text-slate-500 italic">No peer data available.</td>
                             </tr>
                          )}
                       </tbody>
                    </table>
                 </div>
              </div>
            </div>

            {/* Financial Statements */}
            <FinancialsView data={data.financials} currency={data.currency} />

            {/* Earnings & Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <EarningsView data={data.earnings} />
               <NewsInsightsView insights={data.latestInsights} />
            </div>

            {/* Main Interactive Sections */}
            <DCFCalculator data={data} />
            <SotpCalculator data={data} />
            <AnalysisView data={data} />
            
            {/* Disclaimer */}
            <div className="mt-12 p-6 bg-slate-900 border border-slate-800 rounded-xl text-center">
              <div className="flex justify-center mb-2">
                <AlertTriangle className="w-6 h-6 text-amber-500" />
              </div>
              <p className="text-slate-400 text-sm font-medium mb-1">Disclaimer</p>
              <p className="text-slate-500 text-xs leading-relaxed max-w-3xl mx-auto">
                This calculator generates data using AI and real-time search. It should not be used as the sole basis for any investment decision. 
                Data points, including prices and financial ratios, may be inaccurate or delayed. 
                The output generated varies based on real-time data availability and is for educational purposes only. 
                Always verify with official regulatory filings (e.g., SEC, SEBI) before investing.
              </p>
            </div>

          </div>
        )}
      </main>
    </div>
  );
};

export default App;
