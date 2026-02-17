
import React, { useState } from 'react';
import { MarketActivity } from '../types';
import { AlertTriangle, Megaphone, UserMinus, HandCoins, History, Lock, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';

interface MarketActivityViewProps {
  data: MarketActivity;
}

const MarketActivityView: React.FC<MarketActivityViewProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<'actions' | 'insider' | 'blocks'>('actions');

  return (
    <div className="mb-8 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Red Flags (Critical Alerts) */}
        <div className="lg:col-span-1">
           <div className="bg-red-950/10 border border-red-900/30 rounded-xl p-5 h-full">
             <h4 className="text-sm font-bold text-red-400 mb-4 flex items-center gap-2 uppercase tracking-wide">
               <AlertTriangle className="w-4 h-4" /> Red Flags & Risks
             </h4>
             <div className="space-y-3">
               {data.redFlags && data.redFlags.length > 0 ? (
                 data.redFlags.map((flag, idx) => (
                   <div key={idx} className="flex gap-3 items-start bg-red-900/20 p-3 rounded-lg border border-red-900/20">
                      <div className={`w-1.5 h-1.5 mt-1.5 rounded-full shrink-0 ${
                        flag.severity === 'High' ? 'bg-red-500 animate-pulse' : 'bg-amber-500'
                      }`}></div>
                      <div>
                        <div className="text-[10px] font-bold text-red-200 uppercase mb-0.5 tracking-wider">{flag.category}</div>
                        <p className="text-xs text-red-100/80 leading-relaxed">{flag.description}</p>
                      </div>
                   </div>
                 ))
               ) : (
                 <div className="text-center py-8 text-emerald-500/70 text-sm flex flex-col items-center gap-2">
                   <Lock className="w-6 h-6 opacity-50" />
                   No major red flags detected.
                 </div>
               )}
             </div>
           </div>
        </div>

        {/* Right Column: Compact Activity Tables */}
        <div className="lg:col-span-2 bg-slate-800 border border-slate-700 rounded-xl p-5 flex flex-col">
           <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-bold text-white">Corporate & Market Activity</h3>
              </div>
              
              {/* Compact Tabs */}
              <div className="flex bg-slate-900/50 p-0.5 rounded-lg border border-slate-700/50">
                <button 
                  onClick={() => setActiveTab('actions')}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all flex items-center gap-1 ${activeTab === 'actions' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  Actions
                </button>
                <button 
                  onClick={() => setActiveTab('insider')}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all flex items-center gap-1 ${activeTab === 'insider' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  Insider
                </button>
                <button 
                  onClick={() => setActiveTab('blocks')}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all flex items-center gap-1 ${activeTab === 'blocks' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  Blocks
                </button>
              </div>
           </div>

           {/* Dynamic Content Area */}
           <div className="flex-1 bg-slate-900/20 rounded-lg border border-slate-700/30 overflow-hidden relative">
              <div className="absolute inset-0 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600">
                {activeTab === 'actions' && (
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-900/50 text-slate-400 uppercase font-semibold sticky top-0 z-10">
                      <tr>
                        <th className="px-4 py-2">Date</th>
                        <th className="px-4 py-2">Type</th>
                        <th className="px-4 py-2 text-right">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/30">
                      {data.corporateActions && data.corporateActions.length > 0 ? (
                        data.corporateActions.map((action, idx) => (
                          <tr key={idx} className="hover:bg-slate-800/30">
                            <td className="px-4 py-2 text-slate-400 whitespace-nowrap">{action.date}</td>
                            <td className="px-4 py-2 font-medium text-white">{action.type}</td>
                            <td className="px-4 py-2 text-right text-blue-300">{action.details}</td>
                          </tr>
                        ))
                      ) : (
                        <tr><td colSpan={3} className="px-4 py-8 text-center text-slate-500 italic">No recent corporate actions.</td></tr>
                      )}
                    </tbody>
                  </table>
                )}

                {activeTab === 'insider' && (
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-900/50 text-slate-400 uppercase font-semibold sticky top-0 z-10">
                      <tr>
                        <th className="px-4 py-2">Date</th>
                        <th className="px-4 py-2">Insider</th>
                        <th className="px-4 py-2 text-center">Type</th>
                        <th className="px-4 py-2 text-right">Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/30">
                      {data.insiderTrading && data.insiderTrading.length > 0 ? (
                        data.insiderTrading.map((trade, idx) => (
                          <tr key={idx} className="hover:bg-slate-800/30">
                            <td className="px-4 py-2 text-slate-400 whitespace-nowrap">{trade.date}</td>
                            <td className="px-4 py-2 font-medium text-white truncate max-w-[150px]" title={trade.person}>{trade.person}</td>
                            <td className="px-4 py-2 text-center">
                              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase border ${
                                 trade.type === 'Buy' ? 'text-emerald-400 border-emerald-900 bg-emerald-900/10' : 
                                 trade.type === 'Sell' ? 'text-red-400 border-red-900 bg-red-900/10' : 'text-amber-400 border-amber-900 bg-amber-900/10'
                               }`}>
                                {trade.type}
                              </span>
                            </td>
                            <td className="px-4 py-2 text-right text-slate-300">{trade.value}</td>
                          </tr>
                        ))
                      ) : (
                        <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-500 italic">No recent insider activity.</td></tr>
                      )}
                    </tbody>
                  </table>
                )}

                {activeTab === 'blocks' && (
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-900/50 text-slate-400 uppercase font-semibold sticky top-0 z-10">
                      <tr>
                        <th className="px-4 py-2">Date</th>
                        <th className="px-4 py-2">Client</th>
                        <th className="px-4 py-2 text-center">Action</th>
                        <th className="px-4 py-2 text-right">Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/30">
                      {data.blockDeals && data.blockDeals.length > 0 ? (
                        data.blockDeals.map((deal, idx) => (
                          <tr key={idx} className="hover:bg-slate-800/30">
                            <td className="px-4 py-2 text-slate-400 whitespace-nowrap">{deal.date}</td>
                            <td className="px-4 py-2 font-medium text-white truncate max-w-[150px]" title={deal.clientName}>{deal.clientName}</td>
                            <td className="px-4 py-2 text-center">
                               <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase border ${
                                 deal.type === 'Buy' ? 'text-emerald-400 border-emerald-900 bg-emerald-900/10' : 'text-red-400 border-red-900 bg-red-900/10'
                               }`}>
                                {deal.type}
                              </span>
                            </td>
                            <td className="px-4 py-2 text-right text-slate-300">{deal.price}</td>
                          </tr>
                        ))
                      ) : (
                        <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-500 italic">No recent block deals.</td></tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>
           </div>
        </div>
      </div>

      {/* Bottom Row: Market Sentiment */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 flex flex-col md:flex-row items-center gap-6">
         <div className="flex-1">
            <h4 className="text-sm font-bold text-slate-300 mb-2 flex items-center gap-2 uppercase tracking-wide">
              <TrendingUp className="w-4 h-4 text-blue-400" /> Market Sentiment
            </h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              {data.marketSentiment}
            </p>
         </div>
         <div className="shrink-0 flex items-center gap-4 border-l border-slate-700 pl-6">
            <div className={`text-center ${
                data.marketSentiment?.includes('Bullish') ? 'text-emerald-400' : 
                data.marketSentiment?.includes('Bearish') ? 'text-red-400' : 'text-slate-300'
            }`}>
               <div className="text-3xl font-bold">
                 {data.marketSentiment?.includes('Bullish') ? 'Bullish' : 
                  data.marketSentiment?.includes('Bearish') ? 'Bearish' : 'Neutral'}
               </div>
               <div className="text-[10px] uppercase tracking-wider text-slate-500">Current Mood</div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default MarketActivityView;
